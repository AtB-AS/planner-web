import { GraphQlRequester } from '@atb/modules/api-server';
import {
  StopPlaceQuayDeparturesDocument,
  StopPlaceQuayDeparturesQuery,
  StopPlaceQuayDeparturesQueryVariables,
} from './journey-gql/departures.generated';

export type DepartureQuery = {
  id: string;
};
export type DeparturesData = StopPlaceQuayDeparturesQuery;

export type JourneyPlannerApi = {
  departures(input: DepartureQuery): Promise<DeparturesData>;
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
        console.log('ERRRROROROORORO2');

        throw result.error;
      }

      return result.data;
    },
  };

  return api;
}
