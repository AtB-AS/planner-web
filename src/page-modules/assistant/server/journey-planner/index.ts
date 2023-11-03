import { GraphQlRequester } from '@atb/modules/api-server';
import { StreetMode } from '@atb/modules/graphql-types';
import {
  TripsDocument,
  TripsNonTransitDocument,
  TripsNonTransitQuery,
  TripsNonTransitQueryVariables,
  TripsQuery,
  TripsQueryVariables,
} from '@atb/page-modules/assistant/server/journey-planner/journey-gql/trip.generated';
import {
  Notice,
  Situation,
  TripData,
  tripSchema,
} from '@atb/page-modules/assistant/server/journey-planner/validators';
import {
  NonTransitTripData,
  NonTransitTripInput,
  TripInput,
} from '@atb/page-modules/assistant/types';
import {
  getTransportModesEnums,
  isTransportModeType,
  isTransportSubmodeType,
} from '@atb/page-modules/departures/server/journey-planner';
import { filterDuplicateTripPatterns, getCursorByDepartureMode } from '../..';

const MIN_NUMBER_OF_TRIP_PATTERNS = 8;
const MAX_NUMBER_OF_SEARCH_ATTEMPTS = 5;
const DEFAULT_JOURNEY_CONFIG = {
  numTripPatterns: 8, // The maximum number of trip patterns to return.
  waitReluctance: 1.5, // Setting this to a value lower than 1 indicates that waiting is better than staying on a vehicle.
  walkReluctance: 1.5, // This is the main parameter to use for limiting walking.
  walkSpeed: 1.3, // The maximum walk speed along streets, in meters per second.
  transferPenalty: 10, // An extra penalty added on transfers (i.e. all boardings except the first one)
};

export type JourneyPlannerApi = {
  trip(input: TripInput): Promise<TripData>;
  nonTransitTrips(input: NonTransitTripInput): Promise<NonTransitTripData>;
};

export function createJourneyApi(
  client: GraphQlRequester<'graphql-journeyPlanner3'>,
): JourneyPlannerApi {
  const api: JourneyPlannerApi = {
    async nonTransitTrips(input) {
      const from = inputToLocation(input, 'from');
      const to = inputToLocation(input, 'to');
      const when = input.departureDate
        ? new Date(input.departureDate)
        : new Date();

      const result = await client.query<
        TripsNonTransitQuery,
        TripsNonTransitQueryVariables
      >({
        query: TripsNonTransitDocument,
        variables: {
          from,
          to,
          arriveBy: input.departureMode === 'arriveBy',
          when,
          walkSpeed: 1.3,

          includeFoot: input.directModes.includes(StreetMode.Foot),
          includeBicycle: input.directModes.includes(StreetMode.Bicycle),
          includeBikeRental: input.directModes.includes(StreetMode.BikeRental),
        },
      });

      if (result.error) {
        throw result.error;
      }

      let nonTransits: NonTransitTripData = {};

      for (let [legType, trip] of Object.entries(result.data)) {
        const data: RecursivePartial<TripData> = mapResultToTrips(trip);
        const validated = tripSchema.safeParse(data);
        if (!validated.success) {
          throw validated.error;
        }
        nonTransits[legType as keyof NonTransitTripData] = validated.data;
      }

      return nonTransits;
    },

    async trip(input) {
      const journeyModes = {
        accessMode: StreetMode.Foot,
        // Show specific non-transit suggestions through separate API call
        directMode: undefined,
        egressMode: StreetMode.Foot,
        transportModes: input.transportModes
          ? getTransportModesEnums(input.transportModes)?.map((mode) => ({
              transportMode: mode,
            }))
          : undefined,
      };

      const from = inputToLocation(input, 'from');
      const to = inputToLocation(input, 'to');

      const when = input.departureDate
        ? new Date(input.departureDate)
        : new Date();

      const queryVariables = {
        from,
        to,
        arriveBy: input.departureMode === 'arriveBy',
        when,
        modes: journeyModes,
        cursor: input.cursor,
        ...DEFAULT_JOURNEY_CONFIG,
      };

      let trip: TripData | undefined = undefined;
      let cursor = input.cursor;
      let searchAttempt = 1;
      do {
        if (trip && trip.nextPageCursor && trip.previousPageCursor) {
          cursor =
            getCursorByDepartureMode(trip, input.departureMode) || undefined;
        }

        const result = await client.query<TripsQuery, TripsQueryVariables>({
          query: TripsDocument,
          variables: { ...queryVariables, cursor },
        });

        const data: RecursivePartial<TripData> = mapResultToTrips(
          result.data.trip,
        );

        const validated = tripSchema.safeParse(data);
        if (!validated.success) {
          throw validated.error;
        }

        if (!trip) {
          trip = validated.data;
        } else {
          trip = {
            ...validated.data,
            tripPatterns: filterDuplicateTripPatterns([
              ...trip.tripPatterns,
              ...validated.data.tripPatterns,
            ]),
          };
        }
        searchAttempt += 1;
      } while (
        searchAttempt <= MAX_NUMBER_OF_SEARCH_ATTEMPTS &&
        trip.tripPatterns.length <= MIN_NUMBER_OF_TRIP_PATTERNS
      );

      return trip;
    },
  };

  return api;
}

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object | undefined
    ? RecursivePartial<T[P]>
    : T[P];
};

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

function mapResultToTrips(
  trip: TripsQuery['trip'],
): RecursivePartial<TripData> {
  return {
    nextPageCursor: trip.nextPageCursor ?? null,
    previousPageCursor: trip.previousPageCursor ?? null,
    tripPatterns: trip.tripPatterns.map((tripPattern) => ({
      expectedStartTime: tripPattern.expectedStartTime,
      expectedEndTime: tripPattern.expectedEndTime,
      duration: tripPattern.duration || 0,
      walkDistance: tripPattern.walkDistance || 0,
      legs: tripPattern.legs.map((leg) => {
        return {
          mode: isTransportModeType(leg.mode) ? leg.mode : null,
          distance: leg.distance,
          duration: leg.duration,
          aimedStartTime: leg.aimedStartTime,
          aimedEndTime: leg.aimedEndTime,
          expectedEndTime: leg.expectedEndTime,
          expectedStartTime: leg.expectedStartTime,
          realtime: leg.realtime,
          rentedBike: leg.rentedBike,
          transportSubmode: isTransportSubmodeType(leg.transportSubmode)
            ? leg.transportSubmode
            : null,
          line: leg.line
            ? {
                id: leg.line.id,
                name: leg.line.name ?? null,
                transportSubmode: isTransportSubmodeType(
                  leg.line.transportSubmode,
                )
                  ? leg.line.transportSubmode
                  : null,
                publicCode: leg.line.publicCode ?? null,
                flexibleLineType: leg.line.flexibleLineType ?? null,
                notices: mapNotices(leg.line.notices),
              }
            : null,
          fromEstimatedCall: leg.fromEstimatedCall
            ? {
                aimedDepartureTime: leg.fromEstimatedCall.aimedDepartureTime,
                expectedDepartureTime:
                  leg.fromEstimatedCall.expectedDepartureTime,
                destinationDisplay: leg.fromEstimatedCall.destinationDisplay
                  ? {
                      frontText:
                        leg.fromEstimatedCall.destinationDisplay.frontText ??
                        null,
                    }
                  : null,
                quay: {
                  publicCode: leg.fromEstimatedCall.quay.publicCode ?? null,
                  name: leg.fromEstimatedCall.quay.name,
                },
                notices: mapNotices(leg.fromEstimatedCall.notices),
              }
            : null,
          situations: mapSituations(leg.situations),
          fromPlace: {
            name: leg.fromPlace.name ?? null,
            longitude: leg.fromPlace.longitude,
            latitude: leg.fromPlace.latitude,
            quay: leg.fromPlace.quay
              ? {
                  publicCode: leg.fromPlace.quay.publicCode ?? null,
                  name: leg.fromPlace.quay.name,
                  id: leg.fromPlace.quay.id,
                  situations: mapSituations(leg.fromPlace.quay.situations),
                }
              : null,
          },
          toPlace: {
            name: leg.toPlace.name ?? null,
            longitude: leg.toPlace.longitude,
            latitude: leg.toPlace.latitude,
            quay: leg.toPlace.quay
              ? {
                  publicCode: leg.toPlace.quay.publicCode ?? null,
                  name: leg.toPlace.quay.name,
                  id: leg.toPlace.quay.id,
                  situations: mapSituations(leg.toPlace.quay.situations),
                }
              : null,
          },
          serviceJourney: leg.serviceJourney
            ? {
                id: leg.serviceJourney.id,
                notices: mapNotices(leg.serviceJourney.notices),
                journeyPattern: leg.serviceJourney.journeyPattern
                  ? {
                      notices: mapNotices(
                        leg.serviceJourney.journeyPattern.notices,
                      ),
                    }
                  : null,
              }
            : null,
          interchangeTo: leg.interchangeTo
            ? {
                guaranteed: leg.interchangeTo?.guaranteed ?? false,
                toServiceJourney: leg.interchangeTo.toServiceJourney?.id
                  ? {
                      id: leg.interchangeTo.toServiceJourney.id,
                    }
                  : null,
              }
            : null,
          pointsOnLink:
            leg.pointsOnLink?.points && leg.pointsOnLink?.length
              ? {
                  points: leg.pointsOnLink.points,
                  length: leg.pointsOnLink.length,
                }
              : null,
          intermediateEstimatedCalls: leg.intermediateEstimatedCalls.map(
            (intermediateEstimatedCall) => ({
              date: intermediateEstimatedCall.date,
              quay: {
                id: intermediateEstimatedCall.quay.id,
                name: intermediateEstimatedCall.quay.name,
              },
            }),
          ),
          authority: leg.authority?.id
            ? {
                id: leg.authority.id,
              }
            : null,
          serviceJourneyEstimatedCalls: null,
          datedServiceJourney: null,
        };
      }),
    })),
  };
}

function mapSituations(
  situations: TripsQuery['trip']['tripPatterns'][0]['legs'][0]['situations'][0][],
): Situation[] {
  return situations.map((situation) => ({
    id: situation.id,
    situationNumber: situation.situationNumber ?? null,
    reportType: situation.reportType ?? null,
    summary: situation.summary.map((summary) => ({
      language: summary.language ?? null,
      value: summary.value,
    })),
    description: situation.description.map((description) => ({
      language: description.language ?? null,
      value: description.value,
    })),
    advice: situation.advice.map((advice) => ({
      language: advice.language ?? null,
      value: advice.value,
    })),
    infoLinks: situation.infoLinks
      ? situation.infoLinks.map((infoLink) => ({
          uri: infoLink.uri,
          label: infoLink.label ?? null,
        }))
      : null,
    validityPeriod: situation.validityPeriod
      ? {
          startTime: situation.validityPeriod.startTime ?? null,
          endTime: situation.validityPeriod.endTime ?? null,
        }
      : null,
  }));
}

function mapNotices(
  notices: {
    id: string;
    text?: string;
  }[],
): Notice[] {
  return notices.map((notice) => ({
    id: notice.id,
    text: notice.text ?? null,
  }));
}
