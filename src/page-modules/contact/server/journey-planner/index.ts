import { GraphQlRequester } from '@atb/modules/api-server';
import {
  LinesDocument,
  LinesQuery,
  LinesQueryVariables,
} from './journey-gql/lines.generated';
import { getOrgData } from '@atb/modules/org-data';
import { Line, linesSchema } from './validators';
import { isTransportModeType } from '@atb/modules/transport-mode';

export type JourneyPlannerApi = {
  lines(): Promise<Line[]>;
};

export function createJourneyApi(
  client: GraphQlRequester<'graphql-journeyPlanner3'>,
): JourneyPlannerApi {
  const api: JourneyPlannerApi = {
    async lines() {
      const { authorityId } = getOrgData();
      const result = await client.query<LinesQuery, LinesQueryVariables>({
        query: LinesDocument,
        variables: {
          authority: authorityId,
        },
      });

      if (result.error || result.errors) throw result.error || result.errors;

      const data: RecursivePartial<Line[]> = result.data.lines.map((line) => ({
        id: line.id,
        name: line.name ?? '',
        transportMode: isTransportModeType(line.transportMode)
          ? line.transportMode
          : null,
        quays: line.quays.map((quay) => ({
          id: quay.id,
          name: quay.name,
        })),
      }));

      const validated = linesSchema.safeParse(data);
      if (!validated.success) throw validated.error;

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
