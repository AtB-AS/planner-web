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
