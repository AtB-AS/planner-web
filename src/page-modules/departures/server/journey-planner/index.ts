import { GraphQlRequester } from '@atb/modules/api-server';
import {
  StopPlaceQuayDeparturesDocument,
  StopPlaceQuayDeparturesQuery,
  StopPlaceQuayDeparturesQueryVariables,
} from '@atb/page-modules/departures/journey-gql/departures.generated';
import {
  NearestStopPlacesDocument,
  NearestStopPlacesQuery,
  NearestStopPlacesQueryVariables,
} from '@atb/page-modules/departures/journey-gql/nearest-stop-places.generated';
import {
  GetStopPlaceDocument,
  GetStopPlaceQuery,
  GetStopPlaceQueryVariables,
} from '@atb/page-modules/departures/journey-gql/stop-place.generated';
import {
  EstimatedCallFragment,
  QuayEstimatedCallsDocument,
  QuayEstimatedCallsQuery,
  QuayEstimatedCallsQueryVariables,
} from '@atb/page-modules/departures/journey-gql/estimated-calls.generated';
import { isTransportModeType } from '@atb/modules/transport-mode';
import {
  ServiceJourneyWithEstimatedCallsDocument,
  ServiceJourneyWithEstimatedCallsQuery,
  ServiceJourneyWithEstimatedCallsQueryVariables,
} from '@atb/page-modules/departures/journey-gql/service-journey-with-estimated-calls.generated';
import { formatISO } from 'date-fns';
import { mapToMapLegs } from '@atb/components/map';
import { sortQuays } from './utils';
import {
  ExtendedDeparturesType,
  NearestStopPlaceType,
  ServiceJourneyType,
  StopPlaceType,
} from '@atb/page-modules/departures/types.ts';
import { SituationFragment } from '@atb/page-modules/assistant/journey-gql/trip.generated.ts';

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

export type JourneyPlannerApi = {
  departures(input: DepartureInput): Promise<ExtendedDeparturesType>;
  stopPlace(input: StopPlaceInput): Promise<StopPlaceType>;
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
      const data = result.data as ExtendedDeparturesType;
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

      return {
        ...result.data.stopPlace,
        id: result.data.stopPlace?.id ?? 'unknown_id',
        name: result.data.stopPlace?.name ?? 'unknown_name',
        position: {
          lat: result.data.stopPlace?.latitude,
          lon: result.data.stopPlace?.longitude,
        },
      };
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
