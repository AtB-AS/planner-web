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
  StopPlaceFragment,
} from './journey-gql/nearest-stop-places.generated';
import {
  GetStopPlaceDocument,
  GetStopPlaceQuery,
  GetStopPlaceQueryVariables,
} from './journey-gql/stop-place.generated';
import {
  EstimatedCallFragment,
  QuayEstimatedCallsDocument,
  QuayEstimatedCallsQuery,
  QuayEstimatedCallsQueryVariables,
} from './journey-gql/estimated-calls.generated';
import {
  NearestStopPlacesData,
  StopPlaceInfo,
  stopPlaceSchema,
  StopPlaceWithDistance,
} from './validators';
import { PtSituationElement as GraphQlSituation } from '@atb/modules/graphql-types';
import { isTransportModeType } from '@atb/modules/transport-mode';
import {
  ServiceJourneyWithEstimatedCallsDocument,
  ServiceJourneyWithEstimatedCallsQuery,
  ServiceJourneyWithEstimatedCallsQueryVariables,
} from './journey-gql/service-journey-with-estimated-calls.generated';
import { formatISO } from 'date-fns';
import { Situation } from '@atb/modules/situations';
import { mapToMapLegs } from '@atb/components/map';
import { sortQuays } from './utils';
import {
  DeparturesType,
  NearestStopPlaceType,
  ServiceJourneyType,
} from '@atb/page-modules/departures/types.ts';
import { SituationFragment } from '@atb/page-modules/assistant/server/journey-planner/journey-gql/trip.generated.ts';

export type DepartureInput = {
  id: string;
  date: number | null;
};

export type StopPlaceInput = {
  id: string;
};

export type NearestStopPlacesInput = {
  lat: number;
  lon: number;
};

export type EstimatedCallsInput = {
  quayId: string;
  startTime: string;
};

export type ServiceJourneyInput = {
  id: string;
  date: Date;
  fromQuayId: string;
};

export type { StopPlaceInfo, NearestStopPlacesData, StopPlaceWithDistance };

export type JourneyPlannerApi = {
  departures(input: DepartureInput): Promise<DeparturesType>;
  stopPlace(input: StopPlaceInput): Promise<StopPlaceInfo>;
  nearestStopPlaces(
    input: NearestStopPlacesInput,
  ): Promise<NearestStopPlaceType[]>;
  estimatedCalls(input: EstimatedCallsInput): Promise<EstimatedCallFragment[]>;
  serviceJourney(input: ServiceJourneyInput): Promise<ServiceJourneyType>;
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
        },
      });

      if (result.error || result.errors) {
        throw result.error || result.errors;
      }
      const data = result.data as DeparturesType;
      data.stopPlace?.quays?.sort(sortQuays);
      return {
        stopPlace: {
          ...data.stopPlace,
          quays: data.stopPlace?.quays?.map((q) => ({
            ...q,
            estimatedCalls: q.estimatedCalls.map((departure) => ({
              ...departure,
              id: departure.serviceJourney.id,
            })),
          })),
          position:
            data.stopPlace.latitude && data.stopPlace.longitude
              ? {
                  lat: data.stopPlace.latitude,
                  lon: data.stopPlace.longitude,
                }
              : undefined,
        },
      };
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

          latitude: input.lat,
          longitude: input.lon,
        },
      });

      if (result.error || result.errors) {
        throw result.error || result.errors;
      }

      return (
        result.data.nearest?.edges?.reduce<NearestStopPlaceType[]>(function (
          acc,
          edge,
        ) {
          if (!edge.node?.place || !('id' in edge.node.place)) {
            return acc;
          }
          const stopPlace = edge.node?.place;
          const situations =
            stopPlace.quays
              ?.map((q) => q?.situations ?? ([] as SituationFragment[]))
              ?.flat() ?? [];

          return [
            ...acc,
            {
              stopPlace: {
                ...stopPlace,
                situations,
              },
              distance: edge.node?.distance,
            },
          ];
        }, []) ?? []
      );
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
        },
      });

      if (result.error || result.errors) {
        throw result.error || result.errors;
      }

      /**
       *
       stopPlace: {
       ...data.stopPlace,
       quays: data.stopPlace?.quays?.map((q) => ({
       ...q,
       estimatedCalls: q.estimatedCalls.map((departure) => ({
       ...departure,
       id: departure.serviceJourney.id,
       })),
       })),
       position:
       data.stopPlace.latitude && data.stopPlace.longitude
       ? {
       lat: data.stopPlace.latitude,
       lon: data.stopPlace.longitude,
       }
       : undefined,
       },
       */

      return (
        result.data.quay?.estimatedCalls.map((departure) => ({
          ...departure,
          id: departure.serviceJourney.id,
        })) ?? []
      );
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

      if (result.error || result.errors || !result.data.serviceJourney) {
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

      return {
        ...serviceJourney,
        mapLegs: mapToMapLegs(
          serviceJourney?.pointsOnLink,
          transportMode,
          transportSubmode,
          fromStopPlace,
        ),
      };
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
