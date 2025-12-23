import { NewTransportModeGroup } from '@atb/modules/transport-mode';
import {
  TransportMode,
  TransportModes,
  TransportSubmode,
} from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';
import { enumFromString } from '@atb/utils/enum-from-string.ts';
import { isDefined } from '@atb/utils/presence.ts';

/**
 * Maps from TransportModeType in config-specs (used in the UI)
 * to JourneyPlanner v3 TransportModes (used in the GraphQL call)
 *
 * These are almost the same, except for the "unknown" value
 */
export function mapToJourneyPlannerTransportModes(
  groups?: NewTransportModeGroup[],
): TransportModes[] {
  return (
    groups?.map((transportModeGroup) => ({
      transportMode: enumFromString(
        TransportMode,
        transportModeGroup.transportMode,
      ),
      transportSubModes:
        transportModeGroup.transportSubModes
          ?.map((subMode) => enumFromString(TransportSubmode, subMode))
          .filter(isDefined) ?? [],
    })) ?? []
  );
}
