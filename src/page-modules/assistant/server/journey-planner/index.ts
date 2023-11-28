import { GraphQlRequester } from '@atb/modules/api-server';
import {
  StreetMode,
  TransportMode as GraphQlTransportMode,
} from '@atb/modules/graphql-types';
import {
  TripsDocument,
  TripsNonTransitDocument,
  TripsNonTransitQuery,
  TripsNonTransitQueryVariables,
  TripsQuery,
  TripsQueryVariables,
} from './journey-gql/trip.generated';
import {
  TripData,
  TripPatternWithDetails,
  nonTransitSchema,
  tripPatternWithDetailsSchema,
  tripSchema,
} from './validators';
import type {
  NonTransitData,
  NonTransitTripData,
  NonTransitTripInput,
  TripInput,
} from '../../types';
import { filterOutDuplicates, getCursorBySearchMode } from '../../utils';
import {
  isTransportModeType,
  isTransportSubmodeType,
} from '@atb/modules/transport-mode';
import { Notice, Situation } from '@atb/modules/situations';
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';
import { addSeconds, parseISO } from 'date-fns';
import {
  TripsWithDetailsDocument,
  TripsWithDetailsQuery,
  TripsWithDetailsQueryVariables,
} from './journey-gql/trip-with-details.generated';
import { mapToMapLegs } from '@atb/components/map';

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
  singleTrip(input: string): Promise<TripPatternWithDetails | undefined>;
};

export function createJourneyApi(
  client: GraphQlRequester<'graphql-journeyPlanner3'>,
): JourneyPlannerApi {
  const api: JourneyPlannerApi = {
    async nonTransitTrips(input) {
      const from = inputToLocation(input, 'from');
      const to = inputToLocation(input, 'to');
      const when =
        input.searchTime.mode !== 'now'
          ? new Date(input.searchTime.dateTime)
          : new Date();

      const result = await client.query<
        TripsNonTransitQuery,
        TripsNonTransitQueryVariables
      >({
        query: TripsNonTransitDocument,
        variables: {
          from,
          to,
          arriveBy: input.searchTime.mode === 'arriveBy',
          when,
          walkSpeed: 1.3,

          includeFoot: input.directModes.includes(StreetMode.Foot),
          includeBicycle: input.directModes.includes(StreetMode.Bicycle),
          includeBikeRental: input.directModes.includes(StreetMode.BikeRental),
        },
      });

      if (result.error || result.errors) {
        throw result.error || result.errors;
      }

      let nonTransits: NonTransitTripData = {};

      for (let [legType, nonTransitTrip] of Object.entries(result.data)) {
        const tripPattern = nonTransitTrip.tripPatterns[0];

        if (!tripPattern) {
          // No trip pattern for trip, continuing.
          continue;
        }

        const data: Partial<NonTransitData> = {
          duration: tripPattern.duration,
          mode: tripPattern.legs[0]?.mode as any,
          rentedBike: tripPattern.legs?.some((leg) => leg.rentedBike) ?? false,
        };

        const validated = nonTransitSchema.safeParse(data);
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
        transportModes:
          input.transportModes?.map((mode) => ({
            transportMode: mode as GraphQlTransportMode,
          })) ?? undefined,
      };

      const from = inputToLocation(input, 'from');
      const to = inputToLocation(input, 'to');

      const when =
        input.searchTime.mode !== 'now'
          ? new Date(input.searchTime.dateTime)
          : new Date();

      const queryVariables = {
        from,
        to,
        arriveBy: input.searchTime.mode === 'arriveBy',
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
            getCursorBySearchMode(trip, input.searchTime.mode) || undefined;
        }

        const result = await client.query<TripsQuery, TripsQueryVariables>({
          query: TripsDocument,
          variables: { ...queryVariables, cursor },
        });

        if (result.error || result.errors) {
          throw result.error || result.errors;
        }

        const data: RecursivePartial<TripData> = mapResultToTrips(
          result.data.trip,
          queryVariables,
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
            tripPatterns: [
              ...trip.tripPatterns,
              ...filterOutDuplicates(
                validated.data.tripPatterns,
                trip.tripPatterns,
              ),
            ],
          };
        }
        searchAttempt += 1;
      } while (
        searchAttempt <= MAX_NUMBER_OF_SEARCH_ATTEMPTS &&
        trip.tripPatterns.length < MIN_NUMBER_OF_TRIP_PATTERNS
      );

      return trip;
    },
    async singleTrip(input) {
      const tripQuery = parseTripQueryString(input);
      if (!tripQuery) return;

      const result = await client.query<
        TripsWithDetailsQuery,
        TripsWithDetailsQueryVariables
      >({
        query: TripsWithDetailsDocument,
        variables: tripQuery.query,
      });

      if (result.error || result.errors) {
        throw result.error || result.errors;
      }

      // Find the trip pattern that matches the journey IDs in the query
      const singleTripPattern = result.data.trip.tripPatterns.find(
        (pattern) => {
          const journeyIds = extractServiceJourneyIds(pattern);
          if (journeyIds.length != tripQuery.journeyIds.length) return false; // Fast comparison
          return (
            JSON.stringify(journeyIds) === JSON.stringify(tripQuery.journeyIds) // Slow comparison
          );
        },
      );

      if (!singleTripPattern) return;

      const data: RecursivePartial<TripPatternWithDetails> = {
        expectedStartTime: singleTripPattern?.expectedStartTime,
        expectedEndTime: singleTripPattern?.expectedEndTime,
        duration: singleTripPattern?.duration ?? 0,
        walkDistance: singleTripPattern?.streetDistance ?? 0,
        legs: singleTripPattern?.legs.map((leg) => ({
          mode: isTransportModeType(leg.mode) ? leg.mode : 'unknown',
          transportSubmode: isTransportSubmodeType(leg.transportSubmode)
            ? leg.transportSubmode
            : 'unknown',
          aimedStartTime: leg.aimedStartTime,
          aimedEndTime: leg.aimedEndTime,
          expectedStartTime: leg.expectedStartTime,
          expectedEndTime: leg.expectedEndTime,
          realtime: leg.realtime,
          duration: leg.duration,
          mapLegs: leg.pointsOnLink?.points
            ? mapToMapLegs(
                leg.pointsOnLink,
                isTransportModeType(leg.mode) ? leg.mode : 'unknown',
                isTransportSubmodeType(leg.transportSubmode)
                  ? leg.transportSubmode
                  : 'unknown',
                leg.fromPlace
                  ? {
                      latitude: leg.fromPlace.latitude,
                      longitude: leg.fromPlace.longitude,
                    }
                  : undefined,
                leg.toPlace
                  ? {
                      latitude: leg.toPlace.latitude,
                      longitude: leg.toPlace.longitude,
                    }
                  : undefined,
              )
            : [],
          line:
            leg.line && leg.line.name
              ? {
                  name: leg.line.name,
                  publicCode: leg.line.publicCode ?? '',
                }
              : null,
          fromPlace: {
            name: leg.fromPlace.name,
            latitude: leg.fromPlace.latitude,
            longitude: leg.fromPlace.longitude,
            quay: leg.fromPlace.quay
              ? {
                  name: leg.fromPlace.quay.name,
                  publicCode: leg.fromPlace.quay.publicCode ?? '',
                }
              : null,
          },
          toPlace: {
            name: leg.toPlace.name,
            quay: leg.toPlace.quay
              ? {
                  name: leg.toPlace.quay.name,
                  publicCode: leg.toPlace.quay.publicCode ?? '',
                }
              : null,
          },
          serviceJourney: {
            id: leg.serviceJourney?.id ?? null,
          },
          fromEstimatedCall: leg.fromEstimatedCall?.destinationDisplay
            ?.frontText
            ? {
                destinationDisplay: {
                  frontText: leg.fromEstimatedCall.destinationDisplay.frontText,
                },
              }
            : null,
        })),
      };

      const validated = tripPatternWithDetailsSchema.safeParse(data);
      if (!validated.success) {
        throw validated.error;
      }

      return validated.data;
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
  queryVariables: TripsQueryVariables,
): RecursivePartial<TripData> {
  return {
    nextPageCursor: trip.nextPageCursor ?? null,
    previousPageCursor: trip.previousPageCursor ?? null,
    tripPatterns: trip.tripPatterns.map((tripPattern) => ({
      expectedStartTime: tripPattern.expectedStartTime,
      expectedEndTime: tripPattern.expectedEndTime,
      duration: tripPattern.duration || 0,
      walkDistance: tripPattern.streetDistance || 0,
      legs: tripPattern.legs.map((leg) => {
        return {
          mode: isTransportModeType(leg.mode) ? leg.mode : null,
          distance: leg.distance,
          duration: leg.duration,
          aimedStartTime: leg.aimedStartTime,
          expectedEndTime: leg.expectedEndTime,
          expectedStartTime: leg.expectedStartTime,
          realtime: leg.realtime,
          transportSubmode: isTransportSubmodeType(leg.transportSubmode)
            ? leg.transportSubmode
            : null,
          line: leg.line
            ? {
                publicCode: leg.line.publicCode ?? null,
                flexibleLineType: leg.line.flexibleLineType ?? null,
                notices: mapNotices(leg.line.notices),
              }
            : null,
          fromEstimatedCall: leg.fromEstimatedCall
            ? {
                notices: mapNotices(leg.fromEstimatedCall.notices),
              }
            : null,
          situations: mapSituations(leg.situations),
          fromPlace: {
            name: leg.fromPlace.name ?? null,
            quay: leg.fromPlace.quay
              ? {
                  publicCode: leg.fromPlace.quay.publicCode ?? null,
                  name: leg.fromPlace.quay.name,
                  id: leg.fromPlace.quay.id,
                  situations: mapSituations(leg.fromPlace.quay.situations),
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
        };
      }),
      compressedQuery: generateSingleTripQueryString(
        extractServiceJourneyIds(tripPattern),
        tripPattern.legs[0].aimedStartTime,
        queryVariables,
      ),
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
    summary: situation.summary
      .map((summary) => ({
        ...(summary.language ? { language: summary.language } : {}),
        value: summary.value,
      }))
      .filter((summary) => Boolean(summary.value)),
    description: situation.description
      .map((description) => ({
        ...(description.language ? { language: description.language } : {}),
        value: description.value,
      }))
      .filter((description) => Boolean(description.value)),
    advice: situation.advice
      .map((advice) => ({
        ...(advice.language ? { language: advice.language } : {}),
        value: advice.value,
      }))
      .filter((advice) => Boolean(advice.value)),
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

function generateSingleTripQueryString(
  journeyIds: string[],
  aimedStartTime: string,
  queryVariables: TripsQueryVariables,
) {
  const when = getPaddedStartTime(aimedStartTime);
  const {
    from,
    to,
    transferPenalty,
    waitReluctance,
    walkReluctance,
    walkSpeed,
    modes,
  } = queryVariables;
  const arriveBy = false;
  const singleTripQuery: TripsQueryVariables = {
    when,
    from,
    to,
    transferPenalty,
    waitReluctance,
    walkReluctance,
    walkSpeed,
    arriveBy,
    modes,
  };

  // encode to string
  return compressToEncodedURIComponent(
    JSON.stringify({ query: singleTripQuery, journeyIds }),
  );
}

function parseTripQueryString(
  compressedQueryString: string,
): { query: TripsQueryVariables; journeyIds: string[] } | undefined {
  const queryString = decompressFromEncodedURIComponent(compressedQueryString);
  if (!queryString) return;

  const queryFields = JSON.parse(queryString);
  if (isTripsQueryVariables(queryFields.query) && 'journeyIds' in queryFields)
    return queryFields;
  return;
}

function isTripsQueryVariables(a: any): a is TripsQueryVariables {
  return a && 'from' in a && 'to' in a && 'when' in a && 'arriveBy' in a;
}

function getPaddedStartTime(time: string): string {
  const startTime = parseISO(time);
  return addSeconds(startTime, -60).toISOString();
}

/**
 * Extracts an array of ServiceJourney IDs from a TripPattern.
 * used as an attempt to identify a single Trip
 */
export function extractServiceJourneyIds(
  tripPattern:
    | TripPatternWithDetails
    | TripsQuery['trip']['tripPatterns'][0]
    | TripsWithDetailsQuery['trip']['tripPatterns'][0],
) {
  return tripPattern.legs
    .map((leg) => {
      return leg.serviceJourney?.id ?? null;
    })
    .filter((jId): jId is string => {
      return typeof jId === 'string';
    });
}
