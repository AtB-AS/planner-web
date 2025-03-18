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
  LineData,
  TripPatternWithDetails,
  nonTransitSchema,
  tripPatternWithDetailsSchema,
  TripsWithDetailsData,
  tripsWithDetailsSchema,
} from './validators';
import type {
  FromToTripQuery,
  LineInput,
  NonTransitData,
  NonTransitTripData,
  NonTransitTripInput,
  TripInput,
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
import { getOrgData } from '@atb/modules/org-data';
import {
  ViaTripsWithDetailsQuery,
  ViaTripsWithDetailsDocument,
  ViaTripsWithDetailsQueryVariables,
} from './journey-gql/via-trip-with-details.generated';
import {
  ViaTripsQuery,
  ViaTripsDocument,
  ViaTripsQueryVariables,
} from './journey-gql/via-trip.generated';

const { journeyApiConfigurations } = getOrgData();
import {
  addAssistantTripToCache,
  getAssistantTripIfCached,
} from '../trip-cache';
import {
  LineFragment,
  LinesDocument,
  LinesQuery,
  LinesQueryVariables,
} from './journey-gql/lines.generated';
import { isLineFlexibleTransport } from '@atb/modules/flexible';
import { z } from 'zod';

const DEFAULT_JOURNEY_CONFIG = {
  numTripPatterns: 8, // The maximum number of trip patterns to return.
  waitReluctance: journeyApiConfigurations.waitReluctance ?? 1, // Setting this to a value lower than 1 indicates that waiting is better than staying on a vehicle.
  walkReluctance: journeyApiConfigurations.walkingReluctance ?? 4, // This is the main parameter to use for limiting walking.
  walkSpeed: journeyApiConfigurations.walkingSpeed ?? 1.3, // The maximum walk speed along streets, in meters per second.
  transferPenalty: journeyApiConfigurations.transferPenalty ?? 10, // An extra penalty added on transfers (i.e. all boardings except the first one)
  transferSlack: journeyApiConfigurations.transferSlack ?? 0, // An expected transfer time (in seconds) that specifies the amount of time that must pass between exiting one public transport vehicle and boarding another.
};

export type JourneyPlannerApi = {
  trip(input: TripInput): Promise<TripsWithDetailsData>;
  nonTransitTrips(input: NonTransitTripInput): Promise<NonTransitTripData>;
  singleTrip(input: string): Promise<TripPatternWithDetails | undefined>;
  lines(input: LineInput): Promise<LineData>;
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

    async lines(input) {
      const result = await client.query<LinesQuery, LinesQueryVariables>({
        query: LinesDocument,
        variables: { authorities: input.authorities },
        fetchPolicy: 'cache-first',
      });

      if (result.error || result.errors) {
        throw result.error || result.errors;
      }

      return createLinesRecord(result.data.lines);
    },
    async trip(input): Promise<TripsWithDetailsData> {
      const journeyModes = {
        accessMode: StreetMode.Foot,
        // Show specific non-transit suggestions through separate API call
        directMode: undefined,
        egressMode: StreetMode.Foot,
        transportModes: input.transportModes as GraphQlTransportModes[],
      };

      const potential = getAssistantTripIfCached(input as FromToTripQuery);
      if (potential) return potential;

      if (input.via)
        return getSortedViaTrips(client, input, journeyModes.transportModes);

      const from = inputToLocation(input, 'from');
      const to = inputToLocation(input, 'to');

      const lineFilter = input.lineFilter ?? [];

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
        lineFilter,
        ...DEFAULT_JOURNEY_CONFIG,
      };

      const result = await client.query<
        TripsWithDetailsQuery,
        TripsWithDetailsQueryVariables
      >({
        query: TripsWithDetailsDocument,
        variables: queryVariables,
      });

      if (result.error || result.errors) {
        throw result.error || result.errors;
      }

      const data: RecursivePartial<TripsWithDetailsData> = mapResultToTrips(
        result.data.trip,
        queryVariables,
      );

      const validated = tripsWithDetailsSchema.safeParse(data);
      if (!validated.success) {
        console.log('There was an error');
        throw validated.error;
      }
      addAssistantTripToCache(input as FromToTripQuery, validated.data);

      return validated.data;
    },

    async singleTrip(input) {
      const tripQuery = parseTripQueryString(input);
      if (!tripQuery) return;

      const queryVariables = {
        ...tripQuery.query,
        ...DEFAULT_JOURNEY_CONFIG,
      };

      let formattedResult;
      if ('via' in queryVariables) {
        const result = await client.query<
          ViaTripsWithDetailsQuery,
          ViaTripsWithDetailsQueryVariables
        >({
          query: ViaTripsWithDetailsDocument,
          variables: queryVariables,
        });

        if (result.error || result.errors) {
          throw result.error || result.errors;
        }

        const { tripPatternCombinations, tripPatternsPerSegment } =
          result.data.viaTrip;

        // Create list to make all trip pattern combinations more accessable.
        const tripPatternCombinationList = findTripPatternCombinationsList(
          tripPatternCombinations,
        );

        // Find trip patterns from-via and via-to destination.
        const tripPatternsFromVia = tripPatternsPerSegment[0].tripPatterns;
        const tripPatternsViaTo = tripPatternsPerSegment[1].tripPatterns;

        // Find all possible trip patterns where the legs from the from-via location and the via-to location are concatenated.
        const tripPatternsFromViaTo = findTripPatternsFromViaToWithDetails(
          tripPatternCombinationList,
          tripPatternsFromVia,
          tripPatternsViaTo,
        );
        formattedResult = { trip: tripPatternsFromViaTo };
      } else {
        const result = await client.query<
          TripsWithDetailsQuery,
          TripsWithDetailsQueryVariables
        >({
          query: TripsWithDetailsDocument,
          variables: {
            ...queryVariables,
            arriveBy: false,
          },
        });

        if (result.error || result.errors) {
          throw result.error || result.errors;
        }

        formattedResult = { trip: result.data.trip.tripPatterns };
      }

      // Find the trip pattern that matches the journey IDs in the query
      const singleTripPattern = formattedResult.trip.find((pattern) => {
        const journeyIds = extractServiceJourneyIds(pattern);
        if (journeyIds.length != tripQuery.journeyIds.length) return false; // Fast comparison
        return (
          JSON.stringify(journeyIds) === JSON.stringify(tripQuery.journeyIds) // Slow comparison
        );
      });

      if (!singleTripPattern) return;

      const data: RecursivePartial<TripsWithDetailsData> = mapResultToTrips(
        { tripPatterns: [singleTripPattern] },
        queryVariables,
      );

      const tp = data.tripPatterns;

      /*
      const validated = tripPatternWithDetailsSchema.safeParse(
        data.tripPatterns,
      );
      if (!validated.success) {
        throw validated.error;
      }
      */
      if (!firstTripPattern) throw Error('No tripPattern found');
      return firstTripPattern;
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
function inputToViaLocation(input: TripInput) {
  if (!input.via) throw new Error('Via is required in the input');
  return {
    place: input.via.id,
    coordinates: {
      latitude: input.via.geometry.coordinates[1],
      longitude: input.via.geometry.coordinates[0],
    },
    name: input.via.name,
    minSlack: 'PT120S',
    maxSlack: 'PT9H',
  };
}

function mapResultToTrips(
  trip: TripsWithDetailsQuery['trip'],
  queryVariables:
    | TripsWithDetailsQueryVariables
    | ViaTripsWithDetailsQueryVariables,
): RecursivePartial<TripsWithDetailsData> {
  return {
    nextPageCursor: trip.nextPageCursor ?? null,
    previousPageCursor: trip.previousPageCursor ?? null,
    tripPatterns: trip.tripPatterns.map((tripPattern) => ({
      compressedQuery: generateSingleTripQueryString(
        extractServiceJourneyIds(tripPattern),
        tripPattern.legs[0].aimedStartTime,
        queryVariables,
      ),
      expectedEndTime: tripPattern.expectedEndTime,
      expectedStartTime: tripPattern.expectedStartTime,
      legs: tripPattern.legs.map((leg) => {
        return {
          aimedEndTime: leg.aimedEndTime,
          aimedStartTime: leg.aimedStartTime,
          bookingArrangements: leg.bookingArrangements
            ? {
                bookingContact: leg.bookingArrangements.bookingContact
                  ? {
                      contactPerson:
                        leg.bookingArrangements.bookingContact.contactPerson ??
                        null,
                      email:
                        leg.bookingArrangements.bookingContact.email ?? null,
                      furtherDetails:
                        leg.bookingArrangements.bookingContact.furtherDetails ??
                        null,
                      phone:
                        leg.bookingArrangements.bookingContact.phone ?? null,
                      url: leg.bookingArrangements.bookingContact.url ?? null,
                    }
                  : null,
                bookingMethods: leg.bookingArrangements.bookingMethods ?? null,
                bookingNote: leg.bookingArrangements.bookingNote ?? null,
                bookWhen: leg.bookingArrangements.bookWhen ?? null,
                latestBookingTime: leg.bookingArrangements.latestBookingTime,
                minimumBookingPeriod:
                  leg.bookingArrangements.minimumBookingPeriod ?? null,
              }
            : null,
          distance: leg.distance,
          duration: leg.duration,
          expectedEndTime: leg.expectedEndTime,
          expectedStartTime: leg.expectedStartTime,
          fromEstimatedCall: leg.fromEstimatedCall
            ? {
                cancellation: leg.fromEstimatedCall.cancellation,
                notices: mapNotices(leg.fromEstimatedCall.notices),
              }
            : null,
          fromPlace: {
            latitude: leg.fromPlace.latitude,
            longitude: leg.fromPlace.longitude,
            name: leg.fromPlace.name,
            quay: leg.fromPlace.quay
              ? {
                  description: leg.fromPlace.quay.description ?? null,
                  id: leg.fromPlace.quay.id,
                  name: leg.fromPlace.quay.name,
                  publicCode: leg.fromPlace.quay.publicCode ?? null,
                  situations: mapSituations(leg.fromPlace.quay.situations),
                }
              : null,
          },
          interchangeTo: leg.interchangeTo
            ? {
                guaranteed: leg.interchangeTo.guaranteed,
                maximumWaitTime: leg.interchangeTo.maximumWaitTime,
                staySeated: leg.interchangeTo.staySeated,
                toServiceJourney: {
                  id: leg.interchangeTo?.toServiceJourney?.id,
                },
              }
            : null,
          line: leg.line
            ? {
                flexibleLineType: leg.line.flexibleLineType ?? null,
                name: leg.line.name,
                notices: mapNotices(leg.line.notices),
                publicCode: leg.line.publicCode ?? null,
              }
            : null,
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
                isLineFlexibleTransport(
                  leg.line as TripPatternWithDetails['legs'][0]['line'],
                ),
              )
            : [],
          mode: isTransportModeType(leg.mode) ? leg.mode : undefined,
          notices: mapAndFilterNotices([
            ...(leg.line?.notices || []),
            ...(leg.serviceJourney?.notices || []),
            ...(leg.serviceJourney?.journeyPattern?.notices || []),
            ...(leg.fromEstimatedCall?.notices || []),
          ]),
          numberOfIntermediateEstimatedCalls:
            leg.intermediateEstimatedCalls.length,
          realtime: leg.realtime,
          serviceJourney: leg.serviceJourney
            ? {
                id: leg.serviceJourney.id,
                journeyPattern: {
                  notices: mapNotices(
                    leg.serviceJourney?.journeyPattern?.notices ?? [],
                  ),
                },
                notices: mapNotices(leg.serviceJourney?.notices ?? []),
              }
            : null,
          serviceJourneyEstimatedCalls: leg.serviceJourneyEstimatedCalls.map(
            (estimatedCall) => {
              return {
                actualDepartureTime: estimatedCall.actualDepartureTime ?? null,
                aimedDepartureTime: estimatedCall.aimedDepartureTime,
                cancellation: estimatedCall.cancellation,
                expectedDepartureTime: estimatedCall.expectedDepartureTime,
                quay: {
                  description: estimatedCall.quay.description ?? null,
                  name: estimatedCall.quay.name,
                },
                realtime: estimatedCall.realtime,
              };
            },
          ),
          situations: mapSituations(leg.situations),
          toPlace: {
            name: leg.toPlace.name,
            quay: leg.toPlace.quay
              ? {
                  description: leg.toPlace.quay.description ?? null,
                  name: leg.toPlace.quay.name,
                  publicCode: leg.toPlace.quay.publicCode ?? '',
                }
              : null,
          },
          transportSubmode: isTransportSubmodeType(leg.transportSubmode)
            ? leg.transportSubmode
            : null,
        };
      }),
      walkDistance: tripPattern.streetDistance || 0,
    })),
  };
}

function mapSituations(
  situations: TripsWithDetailsQuery['trip']['tripPatterns'][0]['legs'][0]['situations'][0][],
): Situation[] {
  return situations.map((situation) => ({
    id: situation.id,
    situationNumber: situation.situationNumber,
    reportType: situation.reportType,
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
    infoLinks: situation.infoLinks?.map((infoLink) => ({
      uri: infoLink.uri,
      label: infoLink.label,
    })),
    validityPeriod: {
      startTime: situation.validityPeriod?.startTime ?? null,
      endTime: situation.validityPeriod?.endTime ?? null,
    },
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
    text: notice.text,
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
    JSON.stringify({
      query: singleTripQuery,
      journeyIds,
      originalSearchTime,
    }),
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

export function setFilterSegments(transportModes: GraphQlTransportModes[]) {
  return [
    {
      filters: [{ select: [{ transportModes: transportModes }] }],
    },
    {
      filters: [{ select: [{ transportModes: transportModes }] }],
    },
  ];
}

export function findTripPatternCombinationsList(
  tripPatternCombinations: ViaTripsWithDetailsQuery['viaTrip']['tripPatternCombinations'],
): { from: number; to: number }[][] {
  return tripPatternCombinations.map((combinations) =>
    combinations.map((combination) => ({
      from: combination.from!,
      to: combination.to!,
    })),
  );
}

export function findTripPatternsFromViaTo(
  tripPatternCombinations: { from: number; to: number }[][],
  tripPatternsFromVia: ViaTripsQuery['viaTrip']['tripPatternsPerSegment'][0]['tripPatterns'],
  tripPatternsViaTo: ViaTripsQuery['viaTrip']['tripPatternsPerSegment'][0]['tripPatterns'],
) {
  const tripPatterns: ViaTripsQuery['viaTrip']['tripPatternsPerSegment'][0]['tripPatterns'] =
    [];
  tripPatternCombinations.map((segment) => {
    segment.map((combo) =>
      tripPatterns.push({
        expectedStartTime: tripPatternsFromVia[combo.from].expectedStartTime,
        expectedEndTime: tripPatternsViaTo[combo.to].expectedEndTime,
        legs: [
          ...tripPatternsFromVia[combo.from].legs,
          ...tripPatternsViaTo[combo.to].legs,
        ],
      }),
    );
  });
  return tripPatterns;
}

export function findTripPatternsFromViaToWithDetails(
  tripPatternCombinations: { from: number; to: number }[][],
  tripPatternsFromVia: ViaTripsWithDetailsQuery['viaTrip']['tripPatternsPerSegment'][0]['tripPatterns'],
  tripPatternsViaTo: ViaTripsWithDetailsQuery['viaTrip']['tripPatternsPerSegment'][0]['tripPatterns'],
) {
  const tripPatterns: ViaTripsWithDetailsQuery['viaTrip']['tripPatternsPerSegment'][0]['tripPatterns'] =
    [];
  tripPatternCombinations.map((segment) => {
    segment.map((combo) =>
      tripPatterns.push({
        expectedStartTime: tripPatternsFromVia[combo.from].expectedStartTime,
        expectedEndTime: tripPatternsViaTo[combo.to].expectedEndTime,
        legs: [
          ...tripPatternsFromVia[combo.from].legs,
          ...tripPatternsViaTo[combo.to].legs,
        ],
      }),
    );
  });
  return tripPatterns;
}

async function getSortedViaTrips(
  client: GraphQlRequester<'graphql-journeyPlanner3'>,
  input: TripInput,
  transportModes: GraphQlTransportModes[],
): Promise<TripsWithDetailsData> {
  const from = inputToLocation(input, 'from');
  const to = inputToLocation(input, 'to');
  const via = inputToViaLocation(input);
  const segments = setFilterSegments(transportModes);

  const when =
    input.searchTime.mode !== 'now'
      ? new Date(input.searchTime.dateTime)
      : new Date();

  const queryVariables = {
    from,
    to,
    via,
    when,
    segments,
    ...DEFAULT_JOURNEY_CONFIG,
  };

  const result = await client.query<
    ViaTripsWithDetailsQuery,
    ViaTripsWithDetailsQueryVariables
  >({
    query: ViaTripsWithDetailsDocument,
    variables: queryVariables,
  });

  if (result.error || result.errors) {
    throw result.error || result.errors;
  }

  const { tripPatternCombinations, tripPatternsPerSegment } =
    result.data.viaTrip;

  const tripPatternCombinationList = findTripPatternCombinationsList(
    tripPatternCombinations,
  );
  const tripPatternsFromVia = tripPatternsPerSegment[0].tripPatterns;
  const tripPatternsViaTo = tripPatternsPerSegment[1].tripPatterns;

  const tripPatternsFromViaTo = findTripPatternsFromViaToWithDetails(
    tripPatternCombinationList,
    tripPatternsFromVia,
    tripPatternsViaTo,
  );

  const data: RecursivePartial<TripsWithDetailsData> = mapResultToTrips(
    {
      tripPatterns: tripPatternsFromViaTo,
    },
    queryVariables,
  );

  const validated = tripsWithDetailsSchema.safeParse(data);

  if (!validated.success) {
    throw validated.error;
  }

  const { tripPatterns, ...restData } = validated.data;
  const tripPatternsSortedByExpectedEndTime = [...tripPatterns].sort(
    (a, b) =>
      new Date(a.expectedEndTime).getTime() -
      new Date(b.expectedEndTime).getTime(),
  );

  const sortedData = {
    ...restData,
    tripPatterns: tripPatternsSortedByExpectedEndTime,
  };
  return sortedData;
}

function createLinesRecord(lines: LineFragment[]) {
  const record: Record<string, string[]> = {};
  for (const line of lines) {
    if (!line.publicCode) continue;
    if (!record[line.publicCode]) {
      record[line.publicCode] = [];
    }

    record[line.publicCode].push(line.id);
  }
  return record;
}
