import { GraphQlRequester } from '@atb/modules/api-server';
import {
  TripsDocument,
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
  getTransportModesEnums,
  isTransportModeType,
  isTransportSubmodeType,
} from '@atb/page-modules/departures/server/journey-planner';
import { TripInput } from '@atb/page-modules/assistant';

export type JourneyPlannerApi = {
  trip(input: TripInput): Promise<TripData>;
};

export function createJourneyApi(
  client: GraphQlRequester<'graphql-journeyPlanner3'>,
): JourneyPlannerApi {
  const api: JourneyPlannerApi = {
    async trip(input) {
      const modes = input.transportModes
        ? {
            transportModes: getTransportModesEnums(input.transportModes)?.map(
              (mode) => ({
                transportMode: mode,
              }),
            ),
          }
        : undefined;

      const from = {
        place: input.from.id,
        coordinates: {
          latitude: input.from.geometry.coordinates[1],
          longitude: input.from.geometry.coordinates[0],
        },
        name: input.from.name,
      };
      const to = {
        place: input.to.id,
        coordinates: {
          latitude: input.to.geometry.coordinates[1],
          longitude: input.to.geometry.coordinates[0],
        },
        name: input.to.name,
      };

      const result = await client.query<TripsQuery, TripsQueryVariables>({
        query: TripsDocument,
        variables: {
          from,
          to,
          arriveBy: input.arriveBy,
          when: input.when,
          numTripPatterns: 10,
          modes,
        },
      });

      if (result.error) {
        throw result.error;
      }

      const data: RecursivePartial<TripData> = {
        nextPageCursor: result.data.trip.nextPageCursor ?? null,
        tripPatterns: result.data.trip.tripPatterns.map((tripPattern) => ({
          expectedStartTime: tripPattern.expectedStartTime,
          expectedEndTime: tripPattern.expectedEndTime,
          duration: tripPattern.duration || 0,
          walkDistance: tripPattern.walkDistance || 0,
          legs: tripPattern.legs.map((leg) => ({
            mode: isTransportModeType(leg.mode) ? leg.mode : null,
            distance: leg.distance,
            duration: leg.duration,
            aimedStartTime: leg.aimedStartTime,
            aimedEndTime: leg.aimedEndTime,
            expectedEndTime: leg.expectedEndTime,
            expectedStartTime: leg.expectedStartTime,
            realtime: leg.realtime,
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
          })),
        })),
      };

      const validated = tripSchema.safeParse(data);
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
