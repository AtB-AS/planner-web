import { PageText, useTranslation } from '@atb/translations';
import { formatToClock, isInPast } from '@atb/utils/date';
import { ServiceJourneyData } from '../server/journey-planner/validators';
import { getTimeRepresentationType } from '@atb/modules/time-representation';

export const useRealtimeText = (
  estimatedCalls: ServiceJourneyData['estimatedCalls'][0][],
) => {
  const { t, language } = useTranslation();
  const lastPassedStop = estimatedCalls
    .filter((a) => a.actualDepartureTime)
    .pop();

  if (
    lastPassedStop &&
    lastPassedStop.actualDepartureTime &&
    lastPassedStop.quay?.name
  ) {
    return t(
      PageText.Departures.details.lastPassedStop(
        lastPassedStop.quay.name,
        formatToClock(lastPassedStop.actualDepartureTime, language, 'nearest'),
      ),
    );
  }

  const firstStop = estimatedCalls[0];

  if (
    firstStop?.quay?.name &&
    firstStop.realtime &&
    !isInPast(firstStop.expectedDepartureTime)
  ) {
    return t(
      PageText.Departures.details.noPassedStop(
        firstStop.quay.name,
        formatToClock(firstStop.expectedDepartureTime, language, 'floor'),
      ),
    );
  }

  const timeRepType = getTimeRepresentationType({
    missingRealTime: !firstStop?.realtime,
    aimedTime: firstStop?.aimedDepartureTime,
    expectedTime: firstStop?.expectedDepartureTime,
  });
  switch (timeRepType) {
    case 'no-significant-difference':
      return t(PageText.Departures.details.onTime);
    case 'significant-difference':
      return t(PageText.Departures.details.notOnTime);
    default:
      return undefined;
  }
};
