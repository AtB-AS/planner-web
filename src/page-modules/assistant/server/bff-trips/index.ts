import { HttpRequester } from '@atb/modules/api-server';
import type { GeocoderFeature } from '@atb/modules/geocoder';
import { getOrgData } from '@atb/modules/org-data';
import {
  Mode,
  StreetMode,
} from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';
import type {
  ExtendedLegType,
  ExtendedTripPatternWithDetailsType,
  FromToTripQuery,
  NonTransitTripData,
  NonTransitTripInput,
  TripInput,
  TripsType,
} from '../../types';
import { extendLeg } from '../journey-planner';
import {
  addAssistantTripToCache,
  getAssistantTripIfCached,
} from '../trip-cache';

const { journeyApiConfigurations } = getOrgData();

const DEFAULT_JOURNEY_CONFIG = {
  numTripPatterns: 5, // The maximum number of trip patterns to return.
  waitReluctance: journeyApiConfigurations.waitReluctance ?? 1, // Setting this to a value lower than 1 indicates that waiting is better than staying on a vehicle.
  walkReluctance: journeyApiConfigurations.walkingReluctance ?? 4, // This is the main parameter to use for limiting walking.
  transferPenalty: journeyApiConfigurations.transferPenalty ?? 10, // An extra penalty added on transfers (i.e. all boardings except the first one)
};

/**
 * A trip pattern in the format atb-bff returns and the journey service stores.
 */
export type BffTripPattern = Omit<
  ExtendedTripPatternWithDetailsType,
  'legs'
> & {
  legs: Omit<ExtendedLegType, 'mapLegs' | 'notices'>[];
};

export type BffTripApi = {
  trip(input: TripInput): Promise<TripsType>;
  nonTransitTrips(input: NonTransitTripInput): Promise<NonTransitTripData>;
  refreshSingleTrip(
    tripPattern: ExtendedTripPatternWithDetailsType,
  ): Promise<ExtendedTripPatternWithDetailsType>;
};

export function createBffTripApi(
  request: HttpRequester<'http-bff'>,
): BffTripApi {
  return {
    async trip(input) {
      const potential = getAssistantTripIfCached(input as FromToTripQuery);

      if (potential) return potential;

      const result = await request('/v2/trips', {
        method: 'POST',
        body: JSON.stringify({
          from: inputToLocation(input, 'from'),
          to: inputToLocation(input, 'to'),
          arriveBy: input.searchTime.mode === 'arriveBy',
          when: getSearchDate(input),
          cursor: input.cursor ?? undefined,
          modes: {
            accessMode: StreetMode.Foot,
            egressMode: StreetMode.Foot,
            transportModes: input.transportModes ?? [],
          },
          walkSpeed: input.walkSpeed,
          transferSlack: input.transferSlack,
          ...DEFAULT_JOURNEY_CONFIG,
          includeCancellations: true,
          lineFilter: input.lineFilter?.length ? input.lineFilter : undefined,
          via: input.via ? [{ visit: toViaVisit(input.via) }] : undefined,
        }),
      });
      const {
        trip,
      }: { trip: TripsType['trip'] & { tripPatterns: BffTripPattern[] } } =
        await result.json();

      const trips: TripsType = {
        trip: {
          ...trip,
          tripPatterns: trip.tripPatterns.map(toExtendedTripPattern),
        },
      };

      // Invalid cast. Input is not FromToTripQuery at this point
      addAssistantTripToCache(input as FromToTripQuery, trips);

      return trips;
    },

    async nonTransitTrips(input) {
      const result = await request('/v2/trips/non-transit', {
        method: 'POST',
        body: JSON.stringify({
          from: inputToLocation(input, 'from'),
          to: inputToLocation(input, 'to'),
          arriveBy: input.searchTime.mode === 'arriveBy',
          when: getSearchDate(input),
          walkSpeed: input.walkSpeed,
          directModes: input.directModes,
        }),
      });
      // The trip patterns of all direct modes, in one list.
      const tripPatterns: BffTripPattern[] = await result.json();

      const nonTransits: NonTransitTripData = {};

      for (const tripPattern of tripPatterns) {
        const mode = tripPattern.legs[0].mode;
        const rentedBike = tripPattern.legs.some((leg) => leg.rentedBike);
        const key = rentedBike
          ? 'bikeRentalTrip'
          : mode === Mode.Foot
            ? 'footTrip'
            : mode === Mode.Bicycle
              ? 'bicycleTrip'
              : undefined;

        if (!key || nonTransits[key]) continue;

        if (!tripPattern.duration) {
          throw Error('Trip pattern duration is required, but missing');
        }

        nonTransits[key] = {
          duration: tripPattern.duration,
          mode,
          rentedBike,
          tripPattern: toExtendedTripPattern(tripPattern),
        };
      }

      return nonTransits;
    },

    async refreshSingleTrip(tripPattern) {
      const result = await request('/v3/singleTrip', {
        method: 'POST',
        body: JSON.stringify(toBffTripPattern(tripPattern)),
      });
      return toExtendedTripPattern(await result.json());
    },
  };
}

/**
 * Adds the fields planner-web's trip components read, but atb-bff does not
 * return.
 */
export function toExtendedTripPattern(
  tripPattern: BffTripPattern,
): ExtendedTripPatternWithDetailsType {
  const now = new Date().toISOString();
  return {
    ...tripPattern,
    legs: tripPattern.legs.map((leg) => extendLeg(leg, leg.refreshedAt ?? now)),
  };
}

/**
 * Removes the fields added by `toExtendedTripPattern`, since the journey
 * service rejects unknown fields.
 */
export function toBffTripPattern(
  tripPattern: ExtendedTripPatternWithDetailsType,
): BffTripPattern {
  return {
    ...tripPattern,
    legs: tripPattern.legs.map(({ mapLegs, notices, ...leg }) => leg),
  };
}

function getSearchDate(input: NonTransitTripInput | TripInput) {
  return input.searchTime.mode !== 'now'
    ? new Date(input.searchTime.dateTime)
    : new Date();
}

function inputToLocation(
  input: NonTransitTripInput | TripInput,
  direction: 'from' | 'to',
) {
  return {
    place: input[direction].id,
    coordinates: {
      latitude: input[direction].geometry.coordinates[1],
      longitude: input[direction].geometry.coordinates[0],
    },
    name: input[direction].name,
  };
}

/**
 * Entur only accepts stop IDs as `stopLocationIds`, so other locations, such
 * as addresses, are visited by coordinate.
 */
function toViaVisit(via: GeocoderFeature) {
  if (via.id.startsWith('NSR:')) {
    return { label: via.name, stopLocationIds: [via.id] };
  }
  return {
    label: via.name,
    coordinate: {
      latitude: via.geometry.coordinates[1],
      longitude: via.geometry.coordinates[0],
    },
  };
}
