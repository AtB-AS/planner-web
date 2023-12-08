import { GraphQlRequester } from '@atb/modules/api-server';
import {
  StopPlaceQuayDeparturesDocument,
  StopPlaceQuayDeparturesQuery,
  StopPlaceQuayDeparturesQueryVariables,
} from './journey-gql/departures.generated';
import {
  NearestStopPlacesDocument,
  NearestStopPlacesQuery,
  NearestStopPlacesQueryVariables,
} from './journey-gql/nearest-stop-places.generated';
import {
  GetStopPlaceDocument,
  GetStopPlaceQuery,
  GetStopPlaceQueryVariables,
} from './journey-gql/stop-place.generated';
import {
  QuayEstimatedCallsDocument,
  QuayEstimatedCallsQuery,
  QuayEstimatedCallsQueryVariables,
} from './journey-gql/estimated-calls.generated';
import {
  DepartureData,
  EstimatedCallsData,
  NearestStopPlacesData,
  StopPlaceInfo,
  StopPlaceWithDistance,
  departureDataSchema,
  estimatedCallsSchema,
  nearestStopPlaces,
  stopPlaceSchema,
  Quay,
  Departure,
  ServiceJourneyData,
  serviceJourneySchema,
} from './validators';
import { TransportMode as GraphQlTransportMode } from '@atb/modules/graphql-types';
import { PtSituationElement as GraphQlSituation } from '@atb/modules/graphql-types';
import {
  type TransportModeType,
  isTransportModeType,
  filterGraphQlTransportModes,
} from '@atb/modules/transport-mode';
import {
  ServiceJourneyWithEstimatedCallsDocument,
  ServiceJourneyWithEstimatedCallsQuery,
  ServiceJourneyWithEstimatedCallsQueryVariables,
} from './journey-gql/service-journey-with-estimated-calls.generated';
import { formatISO } from 'date-fns';
import { Situation } from '@atb/modules/situations';
import { mapToMapLegs } from '@atb/components/map';

export type DepartureInput = {
  id: string;
  date: number | null;
  transportModes: TransportModeType[] | null;
};
export type { DepartureData, Quay, Departure };

export type StopPlaceInput = {
  id: string;
};

export type NearestStopPlacesInput = {
  lat: number;
  lon: number;
  transportModes: TransportModeType[] | null;
};

export type EstimatedCallsInput = {
  quayId: string;
  startTime: string;
  transportModes: TransportModeType[] | null;
};

export type ServiceJourneyInput = {
  id: string;
  date: Date;
  fromQuayId: string;
};

export type { StopPlaceInfo, NearestStopPlacesData, StopPlaceWithDistance };

export type JourneyPlannerApi = {
  departures(input: DepartureInput): Promise<DepartureData>;
  stopPlace(input: StopPlaceInput): Promise<StopPlaceInfo>;
  nearestStopPlaces(
    input: NearestStopPlacesInput,
  ): Promise<NearestStopPlacesData>;
  estimatedCalls(input: EstimatedCallsInput): Promise<EstimatedCallsData>;
  serviceJourney(input: ServiceJourneyInput): Promise<ServiceJourneyData>;
};

export function createJourneyApi(
  client: GraphQlRequester<'graphql-journeyPlanner3'>,
): JourneyPlannerApi {
  const api: JourneyPlannerApi = {
    async departures(input) {
      const result = await client.query<
        StopPlaceQuayDeparturesQuery,
        StopPlaceQuayDeparturesQueryVariables
      >({
        query: StopPlaceQuayDeparturesDocument,
        variables: {
          id: input.id,
          startTime: input.date
            ? new Date(input.date).toISOString()
            : new Date().toISOString(),
          numberOfDepartures: 10,
          transportModes:
            (input.transportModes as GraphQlTransportMode[]) ?? null,
        },
      });

      if (result.error || result.errors) {
        throw result.error || result.errors;
      }

      const data: RecursivePartial<DepartureData> = {
        stopPlace: {
          id: result.data.stopPlace?.id,
          name: result.data.stopPlace?.name,
          position: {
            lat: result.data.stopPlace?.latitude,
            lon: result.data.stopPlace?.longitude,
          },
          transportMode: filterGraphQlTransportModes(
            result.data.stopPlace?.transportMode,
          ),
          transportSubmode: result.data.stopPlace?.transportSubmode,
          description: result.data.stopPlace?.description,
        },
        quays: result.data.stopPlace?.quays?.map((q) => ({
          name: q.name,
          id: q.id,
          publicCode: q.publicCode,
          description: q.description,
          situations:
            q.situations?.map((situation) =>
              mapGraphQlSituationToSituation(situation as GraphQlSituation),
            ) ?? [],
          departures: q.estimatedCalls.map((e) => ({
            id: e.serviceJourney.id,
            name: e.destinationDisplay?.frontText,
            date: e.date,
            expectedDepartureTime: e.expectedDepartureTime,
            aimedDepartureTime: e.aimedDepartureTime,
            cancelled: e.cancellation,
            transportMode: isTransportModeType(
              e.serviceJourney.line.transportMode,
            )
              ? e.serviceJourney.line.transportMode
              : undefined,
            transportSubmode: e.serviceJourney.line.transportSubmode,
            publicCode: e.serviceJourney.line.publicCode,
            notices: [],
            situations: e.situations.map((situation) =>
              mapGraphQlSituationToSituation(situation as GraphQlSituation),
            ),
          })),
        })),
      };

      const validated = departureDataSchema.safeParse(data);
      if (!validated.success) {
        throw validated.error;
      }

      validated.data.quays.sort((a, b) => {
        // Place quays with no departures at the end
        if (a.departures.length === 0) return 1;
        if (b.departures.length === 0) return -1;
        
        const publicA = parseInt(a.publicCode, 10);
        const publicB = parseInt(b.publicCode, 10);
        
        if (Number.isNaN(publicB) || Number.isNaN(publica)) {
          return a.publicCode.localeCompare(b.publicCode);
        }

        return publicA - publicB;

        return a.publicCode.localeCompare(b.publicCode);
      });

      return validated.data;
    },

    async stopPlace(input) {
      const result = await client.query<
        GetStopPlaceQuery,
        GetStopPlaceQueryVariables
      >({
        query: GetStopPlaceDocument,
        variables: {
          id: input.id,
        },
      });

      if (result.error || result.errors) {
        throw result.error || result.errors;
      }

      const data: RecursivePartial<StopPlaceInfo> = {
        id: result.data.stopPlace?.id,
        name: result.data.stopPlace?.name,
        description: result.data.stopPlace?.description,

        position: {
          lat: result.data.stopPlace?.latitude,
          lon: result.data.stopPlace?.longitude,
        },
      };

      const validated = stopPlaceSchema.safeParse(data);
      if (!validated.success) {
        throw validated.error;
      }

      return validated.data;
    },

    async nearestStopPlaces(input) {
      const result = await client.query<
        NearestStopPlacesQuery,
        NearestStopPlacesQueryVariables
      >({
        query: NearestStopPlacesDocument,
        variables: {
          // Max distance in meters
          distance: 900,
          transportModes:
            (input.transportModes as GraphQlTransportMode[]) ?? null,

          latitude: input.lat,
          longitude: input.lon,
        },
      });

      if (result.error || result.errors) {
        throw result.error || result.errors;
      }

      const data: RecursivePartial<NearestStopPlacesData> =
        result.data.nearest?.edges?.reduce(function (acc, edge) {
          if (!edge.node?.place || !('id' in edge.node?.place)) {
            return acc;
          }

          const situations =
            edge.node.place.quays
              ?.map((q) => q?.situations ?? ([] as GraphQlSituation[]))
              ?.flat() ?? [];

          return acc.concat({
            stopPlace: {
              id: edge.node?.place.id,
              name: edge.node?.place.name,
              description: edge.node?.place?.description
                ? edge.node?.place?.description
                : null,
              position: {
                lat: edge.node?.place.latitude,
                lon: edge.node?.place.longitude,
              },
              situations: mapAndFilterDuplicateGraphQlSituations(
                situations as GraphQlSituation[],
              ),
              transportMode: filterGraphQlTransportModes(
                edge.node?.place.transportMode,
              ),
            },
            distance: edge.node.distance,
          });
        }, [] as RecursivePartial<NearestStopPlacesData>) ?? [];

      const validated = nearestStopPlaces.safeParse(data);

      if (!validated.success) {
        throw validated.error;
      }

      return validated.data;
    },

    async estimatedCalls(input) {
      const result = await client.query<
        QuayEstimatedCallsQuery,
        QuayEstimatedCallsQueryVariables
      >({
        query: QuayEstimatedCallsDocument,
        variables: {
          id: input.quayId,
          numberOfDepartures: 6,
          startTime: new Date(input.startTime),
          transportModes:
            (input.transportModes as GraphQlTransportMode[]) ?? null,
        },
      });

      if (result.error || result.errors) {
        throw result.error || result.errors;
      }

      const data: RecursivePartial<EstimatedCallsData> = {
        quay: {
          id: result.data.quay?.id,
        },
        departures: result.data.quay?.estimatedCalls?.map((e) => ({
          id: e.serviceJourney.id,
          name: e.destinationDisplay?.frontText,
          date: e.date,
          expectedDepartureTime: e.expectedDepartureTime,
          aimedDepartureTime: e.aimedDepartureTime,
          transportMode: isTransportModeType(
            e.serviceJourney.line.transportMode,
          )
            ? e.serviceJourney.line.transportMode
            : 'unknown',
          transportSubmode: e.serviceJourney.line.transportSubmode,
          publicCode: e.serviceJourney.line.publicCode,
        })),
      };
      const validated = estimatedCallsSchema.safeParse(data);
      if (!validated.success) {
        throw validated.error;
      }

      return validated.data;
    },
    async serviceJourney(input) {
      const result = await client.query<
        ServiceJourneyWithEstimatedCallsQuery,
        ServiceJourneyWithEstimatedCallsQueryVariables
      >({
        query: ServiceJourneyWithEstimatedCallsDocument,
        variables: {
          id: input.id,
          date: formatISO(input.date, { representation: 'date' }),
        },
      });

      if (result.error || result.errors) {
        throw result.error || result.errors;
      }

      const serviceJourney = result.data.serviceJourney;

      const transportMode =
        serviceJourney?.transportMode &&
        isTransportModeType(serviceJourney?.transportMode)
          ? serviceJourney?.transportMode
          : 'unknown';
      const transportSubmode = serviceJourney?.transportSubmode;

      const fromStopPlace = serviceJourney?.estimatedCalls?.find(
        (call) => call.quay.id === input.fromQuayId,
      )?.quay?.stopPlace;

      const data: RecursivePartial<ServiceJourneyData> = {
        id: serviceJourney?.id,
        transportMode,
        transportSubmode,
        line: {
          publicCode: serviceJourney?.line.publicCode,
          notices:
            serviceJourney?.notices?.map((notice) => ({
              id: notice.id,
              text: notice.text,
            })) ?? [],
        },
        mapLegs: mapToMapLegs(
          serviceJourney?.pointsOnLink,
          transportMode,
          transportSubmode,
          fromStopPlace,
        ),
        notices:
          serviceJourney?.notices?.map((notice) => ({
            id: notice.id,
            text: notice.text,
          })) ?? [],
        estimatedCalls: serviceJourney?.estimatedCalls?.map(
          (estimatedCall) => ({
            actualArrivalTime: estimatedCall.actualArrivalTime || null,
            actualDepartureTime: estimatedCall.actualDepartureTime || null,
            aimedArrivalTime: estimatedCall.aimedArrivalTime,
            aimedDepartureTime: estimatedCall.aimedDepartureTime,
            cancellation: estimatedCall.cancellation,
            date: estimatedCall.date,
            destinationDisplay: {
              frontText: estimatedCall.destinationDisplay?.frontText,
            },
            expectedDepartureTime: estimatedCall.expectedDepartureTime,
            expectedArrivalTime: estimatedCall.expectedArrivalTime,
            forAlighting: estimatedCall.forAlighting,
            forBoarding: estimatedCall.forBoarding,
            realtime: estimatedCall.realtime,
            quay: {
              id: estimatedCall.quay.id,
              publicCode: estimatedCall.quay.publicCode,
              name: estimatedCall.quay.name,
              stopPlace: {
                id: estimatedCall.quay.stopPlace?.id,
                longitude: estimatedCall.quay.stopPlace?.longitude,
                latitude: estimatedCall.quay.stopPlace?.latitude,
              },
            },
            notices:
              estimatedCall.notices?.map((notice) => ({
                id: notice.id,
                text: notice.text,
              })) ?? [],
            situations:
              estimatedCall.situations?.map((situation) =>
                mapGraphQlSituationToSituation(situation as GraphQlSituation),
              ) ?? [],
          }),
        ),
      };

      const validated = serviceJourneySchema.safeParse(data);
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

const mapAndFilterDuplicateGraphQlSituations = (
  gqlSituations: GraphQlSituation[],
) => {
  const situations = gqlSituations.map((situation) =>
    mapGraphQlSituationToSituation(situation),
  );
  const filteredSituations = situations.sort((n1, n2) =>
    n1.id.localeCompare(n2.id),
  );
  return filteredSituations;
};

const mapGraphQlSituationToSituation = (
  situation: GraphQlSituation,
): Situation => ({
  id: situation.id,
  situationNumber: situation.situationNumber ?? null,
  reportType: situation.reportType ?? null,
  summary: situation.summary
    .map((summary) => ({
      ...(summary.language ? { language: summary.language } : {}),
      value: summary.value ?? undefined,
    }))
    .filter((summary) => Boolean(summary.value)),
  description: situation.description
    .map((description) => ({
      ...(description.language ? { language: description.language } : {}),
      value: description.value ?? undefined,
    }))
    .filter((description) => Boolean(description.value)),
  advice: situation.advice
    .map((advice) => ({
      ...(advice.language ? { language: advice.language } : {}),
      value: advice.value ?? undefined,
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
});
