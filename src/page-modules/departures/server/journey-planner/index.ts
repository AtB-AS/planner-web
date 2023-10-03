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
  DepartureData,
  NearestStopPlacesData,
  StopPlaceInfo,
  departureDataSchema,
  nearestStopPlaces,
  stopPlaceSchema,
} from './validators';

export type DepartureInput = {
  id: string;
};
export type { DepartureData };

export type StopPlaceInput = {
  id: string;
};
export type { StopPlaceInfo };

export type NearestStopPlacesInput = {
  lat: number;
  lon: number;
};

export type JourneyPlannerApi = {
  departures(input: DepartureInput): Promise<DepartureData>;
  stopPlace(input: StopPlaceInput): Promise<StopPlaceInfo>;
  nearestStopPlaces(
    input: NearestStopPlacesInput,
  ): Promise<NearestStopPlacesData>;
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
          startTime: new Date(),
          numberOfDepartures: 10,
        },
      });

      if (result.error) {
        throw result.error;
      }

      const data: RecursivePartial<DepartureData> = {
        stopPlace: {
          id: result.data.stopPlace?.id,
          name: result.data.stopPlace?.name,

          position: {
            lat: result.data.stopPlace?.latitude,
            lon: result.data.stopPlace?.longitude,
          },
        },
        quays: result.data.stopPlace?.quays?.map((q) => ({
          name: q.name,
          id: q.id,
          publicCode: q.publicCode,
          departures: q.estimatedCalls.map((e) => ({
            id: e.serviceJourney.id,
            name: e.destinationDisplay?.frontText,
          })),
        })),
      };

      const validated = departureDataSchema.safeParse(data);
      if (!validated.success) {
        throw validated.error;
      }

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

      if (result.error) {
        throw result.error;
      }

      const data: RecursivePartial<StopPlaceInfo> = {
        id: result.data.stopPlace?.id,
        name: result.data.stopPlace?.name,

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

      if (result.error) {
        throw result.error;
      }

      const data: RecursivePartial<NearestStopPlacesData> =
        result.data.nearest?.edges?.reduce(function (acc, edge) {
          if (!edge.node?.place || !('id' in edge.node?.place)) {
            return acc;
          }

          return acc.concat({
            id: edge.node?.place.id,
            name: edge.node?.place.name,
            position: {
              lat: edge.node?.place.latitude,
              lon: edge.node?.place.longitude,
            },
          });
        }, [] as RecursivePartial<NearestStopPlacesData>) ?? [];

      const validated = nearestStopPlaces.safeParse(data);

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
