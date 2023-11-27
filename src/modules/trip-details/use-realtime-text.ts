import { PageText, useTranslation } from '@atb/translations';
import { formatToClock, isInPast } from '@atb/utils/date';
import { getTimeRepresentationType } from '@atb/modules/time-representation';

type RealtimeData = {
  actualDepartureTime?: string;
  expectedDepartureTime: string;
  aimedDepartureTime: string;
  quayName?: string;
  realtime: boolean;
};

export default function useRealtimeText(realtimeData: RealtimeData[]) {
  const { t, language } = useTranslation();
  const lastPassedStop = realtimeData
    .filter((a) => a.actualDepartureTime)
    .pop();

  if (
    lastPassedStop &&
    lastPassedStop.actualDepartureTime &&
    lastPassedStop.quayName
  ) {
    return t(
      PageText.Departures.details.lastPassedStop(
        lastPassedStop.quayName,
        formatToClock(lastPassedStop.actualDepartureTime, language, 'nearest'),
      ),
    );
  }

  const firstStop = realtimeData[0];

  if (
    firstStop?.quayName &&
    firstStop.realtime &&
    !isInPast(firstStop.expectedDepartureTime)
  ) {
    return t(
      PageText.Departures.details.noPassedStop(
        firstStop.quayName,
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
}
