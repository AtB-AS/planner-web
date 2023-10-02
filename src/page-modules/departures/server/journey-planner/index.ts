import { GraphQlRequester } from '@atb/modules/api-server';
import {
  StopPlaceQuayDeparturesDocument,
  StopPlaceQuayDeparturesQuery,
  StopPlaceQuayDeparturesQueryVariables,
} from './journey-gql/departures.generated';
import {
  DepartureData,
  StopPlaceInfo,
  departureDataSchema,
  stopPlaceSchema,
} from './validators';
import {
  GetStopPlaceDocument,
  GetStopPlaceQuery,
  GetStopPlaceQueryVariables,
} from './journey-gql/stop-place.generated';

export type DepartureQuery = {
  id: string;
};
export type { DepartureData };

export type StopPlaceQuery = {
  id: string;
};
export type { StopPlaceInfo };

export type JourneyPlannerApi = {
  departures(input: DepartureQuery): Promise<DepartureData>;
  stopPlace(input: StopPlaceQuery): Promise<StopPlaceInfo>;
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
      };

      const validated = stopPlaceSchema.safeParse(data);
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
