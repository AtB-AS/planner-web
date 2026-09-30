import {
  TransportMode,
  TransportModes,
  TransportSubmode,
} from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';
import { enumFromString } from '@atb/utils/enum-from-string.ts';
import { isDefined } from '@atb/utils/presence.ts';
import { getServerTransportModeFilter } from '@atb/modules/firebase/server-config-store.ts';
import { uniq } from 'lodash';

/**
 * Maps from TransportModeType in config-specs (used in the UI)
 * to JourneyPlanner v3 TransportModes (used in the GraphQL call)
 *
 * These are almost the same, except for the "unknown" value
 */
export async function mapToJourneyPlannerTransportModes(
  filterOptions?: string[] | null,
): Promise<TransportModes[]> {
  const transportModeFilters = await getServerTransportModeFilter();
  if (!transportModeFilters) return [];

  const filters = transportModeFilters.filter(
    (option) => !filterOptions || filterOptions.includes(option.id),
  );

  const transportModes =
    filters
      .flatMap((option) => option.modes)
      .map((modeGroup) => ({
        transportMode: enumFromString(TransportMode, modeGroup.transportMode),
        transportSubModes: modeGroup.transportSubModes
          ?.map((subMode) => enumFromString(TransportSubmode, subMode))
          .filter(isDefined),
      })) ?? [];

  return uniq(transportModes);
}
