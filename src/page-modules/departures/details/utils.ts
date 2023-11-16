import { ServiceJourneyData } from '../server/journey-planner/validators';
import { EstimatedCallMetadata, EstimatedCallWithMetadata } from '../types';

export function addMetadataToEstimatedCalls(
  estimatedCalls: ServiceJourneyData['estimatedCalls'][0][],
  fromQuayId?: string,
  toQuayId?: string,
): EstimatedCallWithMetadata[] {
  let currentGroup: EstimatedCallMetadata['group'] = 'passed';

  return estimatedCalls.reduce<EstimatedCallWithMetadata[]>(
    (calls, currentCall, index) => {
      const previousCall = calls[calls.length - 1];
      if (currentCall.quay?.id === fromQuayId) {
        if (previousCall) previousCall.metadata.isEndOfGroup = true;
        currentGroup = 'trip';
      }

      const metadata: EstimatedCallMetadata = {
        group: currentGroup,
        isStartOfServiceJourney: index === 0,
        isStartOfGroup: currentGroup !== previousCall?.metadata.group,
        isEndOfServiceJourney: index === estimatedCalls.length - 1,
        isEndOfGroup: index === estimatedCalls.length - 1,
      };

      if (currentCall.quay?.id === toQuayId) {
        metadata.isEndOfGroup = true;
        currentGroup = 'after';
      }

      return [...calls, { ...currentCall, metadata }];
    },
    [],
  );
}

/**
 * Get the situations to show for an estimated call. Based on the following
 * rules:
 * - We don't show situations on passed calls or calls which are after the trip
 * - We don't show situations which are already shown at the top, above the
 *   service journey
 * - If the trip have an end quay we only show situations on the end quay of the
 *   trip, or else we show situations on all intermediate quays on the trip
 */
export function getSituationsToShowForCall(
  { situations, metadata: { group, isEndOfGroup } }: EstimatedCallWithMetadata,
  alreadyShownSituationNumbers: string[],
  toQuayId?: string,
) {
  if (group === 'passed' || group === 'after') return [];
  if (toQuayId && !isEndOfGroup) return [];
  return situations.filter(
    (s) =>
      !s.situationNumber ||
      !alreadyShownSituationNumbers.includes(s.situationNumber),
  );
}
