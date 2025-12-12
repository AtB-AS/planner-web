import { GraphQlRequester } from '@atb/modules/api-server';
import {
  Notice as GraphQlNotice,
  StreetMode,
  TransportModes as GraphQlTransportModes,
} from '@atb/modules/graphql-types';
import { LineData } from './validators';
import type {
  FromToTripQuery,
  LineInput,
  NonTransitTripData,
  NonTransitTripInput,
  TripInput,
  TripsType,
  TripWithDetailsType,
} from '../../types';
import { filterNotices } from '@atb/modules/situations';
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';
import { addSeconds, parseISO } from 'date-fns';
import {
  NoticeFragment,
  TripPatternWithDetailsFragment,
  TripsWithDetailsDocument,
  TripsWithDetailsQuery,
  TripsWithDetailsQueryVariables,
} from '@atb/page-modules/assistant/journey-gql/trip-with-details.generated';
import { mapToMapLegs } from '@atb/components/map';
import { getOrgData } from '@atb/modules/org-data';
import {
  ViaTripsWithDetailsDocument,
  ViaTripsWithDetailsQuery,
  ViaTripsWithDetailsQueryVariables,
} from '@atb/page-modules/assistant/journey-gql/via-trip-with-details.generated';
import {
  addAssistantTripToCache,
  getAssistantTripIfCached,
} from '../trip-cache';
import {
  LineFragment,
  LinesDocument,
  LinesQuery,
  LinesQueryVariables,
} from '@atb/page-modules/assistant/journey-gql/lines.generated';
import {
  TripsNonTransitQuery,
  TripsNonTransitQueryVariables,
  TripsNonTransitDocument,
} from '@atb/page-modules/assistant/journey-gql/non-transit-trip.generated';

const { journeyApiConfigurations } = getOrgData();

const DEFAULT_JOURNEY_CONFIG = {
  numTripPatterns: 8, // The maximum number of trip patterns to return.
  waitReluctance: journeyApiConfigurations.waitReluctance ?? 1, // Setting this to a value lower than 1 indicates that waiting is better than staying on a vehicle.
  walkReluctance: journeyApiConfigurations.walkingReluctance ?? 4, // This is the main parameter to use for limiting walking.
  transferPenalty: journeyApiConfigurations.transferPenalty ?? 10, // An extra penalty added on transfers (i.e. all boardings except the first one)
  transferSlack: journeyApiConfigurations.transferSlack ?? 0, // An expected transfer time (in seconds) that specifies the amount of time that must pass between exiting one public transport vehicle and boarding another.
};

export type JourneyPlannerApi = {
  trip(input: TripInput): Promise<TripsType>;
  nonTransitTrips(input: NonTransitTripInput): Promise<NonTransitTripData>;
  singleTrip(input: string): Promise<TripWithDetailsType | undefined>;
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
        walkSpeed: input.walkSpeed ?? 1.3,

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

        if (!tripPattern.duration) {
          throw Error('Trip pattern duration is required, but missing');
        }

        nonTransits[legType as keyof NonTransitTripData] = {
          duration: tripPattern.duration,
          mode: tripPattern.legs[0]?.mode,
          rentedBike: tripPattern.legs?.some((leg) => leg.rentedBike) ?? false,
          compressedQuery: generateSingleTripQueryString(
            [],
            tripPattern.legs[0].aimedStartTime,
            { ...queryVariables, modes },
          ),
        };
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
    async trip(input) {
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
        walkSpeed: input.walkSpeed,
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

      const trips: TripsType = {
        trip: {
          ...result.data.trip,
          tripPatterns: result.data.trip.tripPatterns.map((tripPattern) => ({
            ...tripPattern,
            compressedQuery: generateSingleTripQueryString(
              extractServiceJourneyIds(tripPattern),
              tripPattern.legs[0].aimedStartTime,
              queryVariables,
            ),

            legs: tripPattern.legs.map((leg) => ({
              ...leg,
              mapLegs: leg.pointsOnLink?.points
                ? mapToMapLegs(
                    leg.pointsOnLink,
                    leg.mode,
                    leg.transportSubmode,
                    leg.fromPlace,
                    leg.toPlace,
                    !!leg.line?.flexibleLineType,
                  )
                : [],
              notices: mapAndFilterNotices([
                ...(leg.line?.notices ?? []),
                ...(leg.serviceJourney?.notices ?? []),
                ...(leg.serviceJourney?.journeyPattern?.notices ?? []),
                ...(leg.fromEstimatedCall?.notices ?? []),
                ...(leg.toEstimatedCall?.notices ?? []),
              ]),
            })),
          })),
        },
      };

      addAssistantTripToCache(input as FromToTripQuery, trips);

      return trips;
    },

    async singleTrip(input) {
      const tripQuery = parseTripQueryString(input);
      if (!tripQuery) return;

      let formattedResult;
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
            ...tripQuery.query,
            arriveBy: false,
            ...DEFAULT_JOURNEY_CONFIG,
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

      // Extend GraphQL-type with mapLegs for easy map rendering
      return {
        trip: {
          tripPatterns: [
            {
              ...singleTripPattern,
              compressedQuery: generateSingleTripQueryString(
                extractServiceJourneyIds(singleTripPattern),
                singleTripPattern.legs[0].aimedStartTime,
                tripQuery.query,
              ),
              legs: singleTripPattern.legs.map((leg) => ({
                ...leg,
                mapLegs: leg.pointsOnLink?.points
                  ? mapToMapLegs(
                      leg.pointsOnLink,
                      leg.mode,
                      leg.transportSubmode,
                      leg.fromPlace,
                      leg.toPlace,
                      !!leg.line?.flexibleLineType,
                    )
                  : [],
                notices: mapAndFilterNotices([
                  ...(leg.line?.notices ?? []),
                  ...(leg.serviceJourney?.notices ?? []),
                  ...(leg.serviceJourney?.journeyPattern?.notices ?? []),
                  ...(leg.fromEstimatedCall?.notices ?? []),
                  ...(leg.toEstimatedCall?.notices ?? []),
                ]),
              })),
            },
          ],
        },
      };
    },
  };

  return api;
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
    maxSlack: 'PT2H',
  };
}

function generateSingleTripQueryString(
  journeyIds: string[],
  aimedStartTime: string,
  queryVariables:
    | TripsWithDetailsQueryVariables
    | ViaTripsWithDetailsQueryVariables,
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
      query: TripsWithDetailsQueryVariables | ViaTripsWithDetailsQueryVariables;
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

function isTripsQueryVariables(a: any): a is TripsWithDetailsQueryVariables {
  return a && 'from' in a && 'to' in a && 'when' in a && 'arriveBy' in a;
}

function isTripsViaQueryVariables(a: any): a is TripsWithDetailsQueryVariables {
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
  tripPattern: TripPatternWithDetailsFragment,
) {
  return tripPattern.legs
    .map((leg) => {
      return leg.serviceJourney?.id ?? null;
    })
    .filter((jId): jId is string => {
      return typeof jId === 'string';
    });
}

function mapAndFilterNotices(notices: GraphQlNotice[]): NoticeFragment[] {
  const mappedNotices = notices
    .map((notice) => {
      if (!notice) return;
      return {
        id: notice.id,
        text: notice.text,
      };
    })
    .filter((n) => n) as NoticeFragment[];

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
): Promise<TripsType> {
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

  const tripPatternsFromViaTo = findTripPatternsFromViaTo(
    tripPatternCombinationList,
    tripPatternsFromVia,
    tripPatternsViaTo,
  );

  const tripPatternsSortedByExpectedEndTime = tripPatternsFromViaTo.sort(
    (a, b) =>
      new Date(a.expectedEndTime!).getTime() -
      new Date(b.expectedEndTime!).getTime(),
  );

  return {
    trip: {
      tripPatterns: tripPatternsSortedByExpectedEndTime.map((tripPattern) => ({
        ...tripPattern,
        compressedQuery: generateSingleTripQueryString(
          extractServiceJourneyIds(tripPattern),
          tripPattern.legs[0].aimedStartTime,
          queryVariables,
        ),
        legs: tripPattern.legs.map((leg) => ({
          ...leg,
          mapLegs: leg.pointsOnLink?.points
            ? mapToMapLegs(
                leg.pointsOnLink,
                leg.mode,
                leg.transportSubmode,
                leg.fromPlace,
                leg.toPlace,
                !!leg.line?.flexibleLineType,
              )
            : [],
          notices: mapAndFilterNotices([
            ...(leg.line?.notices ?? []),
            ...(leg.serviceJourney?.notices ?? []),
            ...(leg.serviceJourney?.journeyPattern?.notices ?? []),
            ...(leg.fromEstimatedCall?.notices ?? []),
            ...(leg.toEstimatedCall?.notices ?? []),
          ]),
        })),
      })),
    },
  };
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
