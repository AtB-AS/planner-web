import { GraphQlRequester } from '@atb/modules/api-server';
import { Notice as GraphQlNotice } from '@atb/modules/graphql-types';
import { LineData } from './validators';
import type { LineInput } from '../../types';
import { filterNotices } from '@atb/modules/situations-and-notices';
import { NoticeFragment } from '@atb/page-modules/assistant/journey-gql/trip-with-details.generated';
import { mapToMapLegs, MapLegType } from '@atb/components/map';
import {
  LineFragment,
  LinesDocument,
  LinesQuery,
  LinesQueryVariables,
} from '@atb/page-modules/assistant/journey-gql/lines.generated';
import { Mode } from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';

export type JourneyPlannerApi = {
  lines(input: LineInput): Promise<LineData>;
};

export function createJourneyApi(
  client: GraphQlRequester<'graphql-journeyPlanner3'>,
): JourneyPlannerApi {
  const api: JourneyPlannerApi = {
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
  };

  return api;
}

type ExtendableLeg = {
  mode: Mode;
  transportSubmode?: Parameters<typeof mapToMapLegs>[2];
  pointsOnLink?: Parameters<typeof mapToMapLegs>[0] | null;
  fromPlace?: Parameters<typeof mapToMapLegs>[3];
  toPlace?: Parameters<typeof mapToMapLegs>[4];
  line?: {
    notices?: GraphQlNotice[] | null;
    flexibleLineType?: string | null;
  } | null;
  serviceJourney?: {
    notices?: GraphQlNotice[] | null;
    journeyPattern?: { notices?: GraphQlNotice[] | null } | null;
  } | null;
  fromEstimatedCall?: { notices?: GraphQlNotice[] | null } | null;
  toEstimatedCall?: { notices?: GraphQlNotice[] | null } | null;
};

/**
 * Extends a GraphQL leg with the convenience properties used by the client:
 * mapLegs for map rendering, filtered notices, and the refreshedAt timestamp
 * used to determine staleness when refreshing a trip.
 */
export function extendLeg<T extends ExtendableLeg>(
  leg: T,
  refreshedAt: string,
): T & {
  mapLegs: MapLegType[];
  notices: NoticeFragment[];
  refreshedAt: string;
} {
  return {
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
    refreshedAt,
  };
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
