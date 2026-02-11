import {
  TransportMode,
  TransportModes,
  TransportSubmode,
} from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';
import { enumFromString } from '@atb/utils/enum-from-string.ts';
import { isDefined } from '@atb/utils/presence.ts';
import { getTransportModeFilter } from '@atb/modules/firebase/transport-mode-filter.ts';
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
  const transportModeFilters = await getTransportModeFilter();
  if (!transportModeFilters) return [];

  const filters = transportModeFilters.filter(
    (option) => !filterOptions || filterOptions.includes(option.id),
  );

  const transportModes =
    filters
      .flatMap((option) => option.modes)
      .map((transportModeGroup) => ({
        transportMode: enumFromString(
          TransportMode,
          transportModeGroup.transportMode,
        ),
        transportSubModes: transportModeGroup.transportSubModes
          ?.map((subMode) => enumFromString(TransportSubmode, subMode))
          .filter(isDefined),
      })) ?? [];

  return uniq(transportModes);
}
