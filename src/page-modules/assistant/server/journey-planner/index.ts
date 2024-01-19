import { GraphQlRequester } from '@atb/modules/api-server';
import {
  StreetMode,
  TransportModes as GraphQlTransportModes,
  Notice as GraphQlNotice,
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
  TripViaInput,
} from '../../types';
import {
  isTransportModeType,
  isTransportSubmodeType,
} from '@atb/modules/transport-mode';
import { Notice, Situation, filterNotices } from '@atb/modules/situations';
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
import {
  ViaTripsDocument,
  ViaTripsQuery,
  ViaTripsQueryVariables,
} from './journey-gql/via-trip.generated';
import {
  ViaTripsWithDetailsDocument,
  ViaTripsWithDetailsQuery,
  ViaTripsWithDetailsQueryVariables,
} from './journey-gql/via-trip-with-details.generated';

const DEFAULT_JOURNEY_CONFIG = {
  numTripPatterns: 8, // The maximum number of trip patterns to return.
  waitReluctance: 1.5, // Setting this to a value lower than 1 indicates that waiting is better than staying on a vehicle.
  walkReluctance: 4, // This is the main parameter to use for limiting walking.
  walkSpeed: 1.3, // The maximum walk speed along streets, in meters per second.
  transferPenalty: 10, // An extra penalty added on transfers (i.e. all boardings except the first one)
  transferSlack: 0, // An expected transfer time (in seconds) that specifies the amount of time that must pass between exiting one public transport vehicle and boarding another.
};

export type JourneyPlannerApi = {
  trip(input: TripInput): Promise<TripData>;
  viaTrip(input: TripViaInput): Promise<TripData>;
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

      const queryVariables = {
        from,
        to,
        arriveBy: input.searchTime.mode === 'arriveBy',
        when,
        walkSpeed: 1.3,

        includeFoot: input.directModes.includes(StreetMode.Foot),
        includeBicycle: input.directModes.includes(StreetMode.Bicycle),
        includeBikeRental: input.directModes.includes(StreetMode.BikeRental),
      };

      const result = await client.query<
        TripsNonTransitQuery,
        TripsNonTransitQueryVariables
      >({
        query: TripsNonTransitDocument,
        variables: queryVariables,
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

        const modes = { directMode: StreetMode.Foot, transportModes: [] };

        switch (legType) {
          case 'footTrip':
            modes.directMode = StreetMode.Foot;
            break;
          case 'bicycleTrip':
            modes.directMode = StreetMode.Bicycle;
            break;
          case 'bikeRentalTrip':
            modes.directMode = StreetMode.BikeRental;
            break;
        }

        const data: Partial<NonTransitData> = {
          duration: tripPattern.duration,
          mode: tripPattern.legs[0]?.mode as any,
          rentedBike: tripPattern.legs?.some((leg) => leg.rentedBike) ?? false,
          compressedQuery: generateSingleTripQueryString(
            [],
            tripPattern.legs[0].aimedStartTime,
            { ...queryVariables, modes },
          ),
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
        transportModes: input.transportModes as GraphQlTransportModes[],
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

      const result = await client.query<TripsQuery, TripsQueryVariables>({
        query: TripsDocument,
        variables: queryVariables,
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

      return validated.data;
    },
    async singleTrip(input) {
      const tripQuery = parseTripQueryString(input);
      if (!tripQuery) return;

      let formatedResult;
      if ('via' in tripQuery.query) {
        const result = await client.query<
          ViaTripsWithDetailsQuery,
          ViaTripsWithDetailsQueryVariables
        >({
          query: ViaTripsWithDetailsDocument,
          variables: {
            ...tripQuery.query,
            ...DEFAULT_JOURNEY_CONFIG,
          },
        });

        if (result.error || result.errors) {
          throw result.error || result.errors;
        }

        // Create list to make all trip pattern combinations more accessable.
        const tripPatternCombinations = findTripPatternCombinations(
          result.data.viaTrip.tripPatternCombinations,
        );

        // Find trip patterns from-via and via-to destination.
        const tripPatternsFromVia =
          result.data.viaTrip.tripPatternsPerSegment[0].tripPatterns;
        const tripPatternsViaTo =
          result.data.viaTrip.tripPatternsPerSegment[1].tripPatterns;

        // Find all possible trip patterns where the legs from the from-via location and the via-to location are concatinated.
        const tripPatternsFromViaTo = generateTripPatternsFromViaToWithDetails(
          tripPatternCombinations,
          tripPatternsFromVia,
          tripPatternsViaTo,
        );

        formatedResult = { trip: tripPatternsFromViaTo };
      } else {
        const result = await client.query<
          TripsWithDetailsQuery,
          TripsWithDetailsQueryVariables
        >({
          query: TripsWithDetailsDocument,
          variables: {
            ...tripQuery.query,
            arriveBy: false,
            ...DEFAULT_JOURNEY_CONFIG,
          },
        });

        if (result.error || result.errors) {
          throw result.error || result.errors;
        }

        formatedResult = { trip: result.data.trip.tripPatterns };
      }

      // Find the trip pattern that matches the journey IDs in the query
      const singleTripPattern = formatedResult.trip.find((pattern) => {
        const journeyIds = extractServiceJourneyIds(pattern);
        if (journeyIds.length != tripQuery.journeyIds.length) return false; // Fast comparison
        return (
          JSON.stringify(journeyIds) === JSON.stringify(tripQuery.journeyIds) // Slow comparison
        );
      });

      if (!singleTripPattern) return;

      const data: RecursivePartial<TripPatternWithDetails> = {
        expectedStartTime: singleTripPattern?.expectedStartTime,
        expectedEndTime: singleTripPattern?.expectedEndTime,
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
                  id: leg.fromPlace.quay.id,
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
          serviceJourney: leg.serviceJourney
            ? {
                id: leg.serviceJourney.id,
              }
            : null,
          fromEstimatedCall: leg.fromEstimatedCall?.destinationDisplay
            ?.frontText
            ? {
                destinationDisplay: {
                  frontText: leg.fromEstimatedCall.destinationDisplay.frontText,
                },
              }
            : null,
          interchangeTo: leg.interchangeTo?.toServiceJourney?.id
            ? {
                guaranteed: leg.interchangeTo.guaranteed ?? false,
                toServiceJourney: {
                  id: leg.interchangeTo.toServiceJourney.id,
                },
              }
            : null,
          numberOfIntermediateEstimatedCalls:
            leg.intermediateEstimatedCalls.length,
          notices: mapAndFilterNotices([
            ...(leg.line?.notices || []),
            ...(leg.serviceJourney?.notices || []),
            ...(leg.serviceJourney?.journeyPattern?.notices || []),
            ...(leg.fromEstimatedCall?.notices || []),
          ]),
          situations: mapSituations(leg.situations),
        })),
      };
      const validated = tripPatternWithDetailsSchema.safeParse(data);
      if (!validated.success) {
        throw validated.error;
      }

      return validated.data;
    },

    async viaTrip(input) {
      const journeyModes = {
        accessMode: StreetMode.Foot,
        // Show specific non-transit suggestions through separate API call
        directMode: undefined,
        egressMode: StreetMode.Foot,
        transportModes: input.transportModes as GraphQlTransportModes[],
      };

      const from = inputToLocation(input, 'from');
      const to = inputToLocation(input, 'to');
      const via = inputToViaLocation(input, 'via');
      const when =
        input.searchTime.mode !== 'now'
          ? new Date(input.searchTime.dateTime)
          : new Date();

      const queryVariables = {
        from,
        to,
        via,
        when,
        modes: journeyModes,
        cursor: input.cursor,
        ...DEFAULT_JOURNEY_CONFIG,
      };

      const result = await client.query<ViaTripsQuery, ViaTripsQueryVariables>({
        query: ViaTripsDocument,
        variables: queryVariables,
      });

      if (result.error || result.errors) {
        throw result.error || result.errors;
      }

      // Create list to make all trip pattern combinations more accessable.
      const tripPatternCombinations = findTripPatternCombinations(
        result.data.viaTrip.tripPatternCombinations,
      );

      // Find trip patterns from-via and via-to destination.
      const tripPatternsFromVia =
        result.data.viaTrip.tripPatternsPerSegment[0].tripPatterns;
      const tripPatternsViaTo =
        result.data.viaTrip.tripPatternsPerSegment[1].tripPatterns;

      // Find all possible trip patterns where the legs from the from-via location and the via-to location are concatinated.
      const tripPatternsFromViaTo = generateTripPatternsFromViaTo(
        tripPatternCombinations,
        tripPatternsFromVia,
        tripPatternsViaTo,
      );

      const data: RecursivePartial<TripData> = mapResultToTrips(
        {
          nextPageCursor: undefined,
          previousPageCursor: undefined,
          metadata: undefined,
          tripPatterns: tripPatternsFromViaTo,
        },
        queryVariables,
      );

      const validated = tripSchema.safeParse(data);
      if (!validated.success) {
        throw validated.error;
      }

      const sortedData = {
        ...validated.data,
        tripPatterns: validated.data.tripPatterns.sort((a, b) => {
          const endTimeA = new Date(a.expectedEndTime).getTime();
          const endTimeB = new Date(b.expectedEndTime).getTime();

          return endTimeA - endTimeB;
        }),
      };

      return sortedData;
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
function inputToViaLocation(input: TripViaInput, direction: 'via') {
  return {
    place: input[direction].id,
    coordinates: {
      latitude: input[direction].geometry.coordinates[1],
      longitude: input[direction].geometry.coordinates[0],
    },
    name: input[direction].name,
    minSlack: 'PT120S',
    maxSlack: 'PT2H',
  };
}

function mapResultToTrips(
  trip: TripsQuery['trip'],
  queryVariables: TripsQueryVariables | ViaTripsQueryVariables,
): RecursivePartial<TripData> {
  return {
    nextPageCursor: trip.nextPageCursor ?? null,
    previousPageCursor: trip.previousPageCursor ?? null,
    tripPatterns: trip.tripPatterns.map((tripPattern) => ({
      expectedStartTime: tripPattern.expectedStartTime,
      expectedEndTime: tripPattern.expectedEndTime,
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
  queryVariables: TripsQueryVariables | ViaTripsQueryVariables,
) {
  const when = getPaddedStartTime(aimedStartTime);
  const originalSearchTime = queryVariables.when;
  const singleTripQuery = isTripsQueryVariables(queryVariables)
    ? { ...queryVariables, when, arriveBy: queryVariables.arriveBy }
    : { ...queryVariables, when, via: queryVariables.via };

  // encode to string
  return compressToEncodedURIComponent(
    JSON.stringify({ query: singleTripQuery, journeyIds, originalSearchTime }),
  );
}

export function parseTripQueryString(compressedQueryString: string):
  | {
      query: TripsQueryVariables | ViaTripsQueryVariables;
      journeyIds: string[];
      originalSearchTime: string;
    }
  | undefined {
  const queryString = decompressFromEncodedURIComponent(compressedQueryString);

  if (!queryString) return;

  const queryFields = JSON.parse(queryString);
  if (isTripsQueryVariables(queryFields.query)) return queryFields;
  if (isTripsViaQueryVariables(queryFields.query)) return queryFields;
  return;
}

function isTripsQueryVariables(a: any): a is TripsQueryVariables {
  return a && 'from' in a && 'to' in a && 'when' in a && 'arriveBy' in a;
}

function isTripsViaQueryVariables(a: any): a is TripsQueryVariables {
  return a && 'from' in a && 'to' in a && 'when' in a && 'via' in a;
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

function mapAndFilterNotices(notices: GraphQlNotice[]): Notice[] {
  const mappedNotices = notices
    .map((notice) => {
      if (!notice) return;
      return {
        id: notice.id,
        text: notice.text ?? null,
      };
    })
    .filter((n) => n) as Notice[];

  return filterNotices(mappedNotices);
}

function findTripPatternCombinations(
  tripPatternCombinations: ViaTripsWithDetailsQuery['viaTrip']['tripPatternCombinations'],
): { from: number; to: number }[] {
  return tripPatternCombinations.flatMap((combinations) =>
    combinations.map((combination) => ({
      from: combination.from!,
      to: combination.to!,
    })),
  );
}

// Todo: generateTripPatternsFromViaTo solves the same task. Should rewrite to one function where the type is taken into account.
function generateTripPatternsFromViaTo(
  tripPatternCombinations: { from: number; to: number }[],
  tripPatternsFromVia: ViaTripsQuery['viaTrip']['tripPatternsPerSegment'][0]['tripPatterns'],
  tripPatternsViaTo: ViaTripsQuery['viaTrip']['tripPatternsPerSegment'][0]['tripPatterns'],
): ViaTripsQuery['viaTrip']['tripPatternsPerSegment'][0]['tripPatterns'] {
  return tripPatternCombinations.map((combo) => ({
    expectedStartTime: tripPatternsFromVia[combo.from].expectedStartTime,
    expectedEndTime: tripPatternsViaTo[combo.to].expectedEndTime,
    legs: [
      ...tripPatternsFromVia[combo.from].legs,
      ...tripPatternsViaTo[combo.to].legs,
    ],
  }));
}

function generateTripPatternsFromViaToWithDetails(
  tripPatternCombinations: { from: number; to: number }[],
  tripPatternsFromVia: ViaTripsWithDetailsQuery['viaTrip']['tripPatternsPerSegment'][0]['tripPatterns'],
  tripPatternsViaTo: ViaTripsWithDetailsQuery['viaTrip']['tripPatternsPerSegment'][0]['tripPatterns'],
): ViaTripsWithDetailsQuery['viaTrip']['tripPatternsPerSegment'][0]['tripPatterns'] {
  return tripPatternCombinations.map((combo) => ({
    expectedStartTime: tripPatternsFromVia[combo.from].expectedStartTime,
    expectedEndTime: tripPatternsViaTo[combo.to].expectedEndTime,
    legs: [
      ...tripPatternsFromVia[combo.from].legs,
      ...tripPatternsViaTo[combo.to].legs,
    ],
  }));
}
