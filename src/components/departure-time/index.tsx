import { Typo } from '@atb/components/typography';
import { getTimeRepresentationType } from '@atb/modules/time-representation';
import { PageText, useTranslation } from '@atb/translations';
import dictionary from '@atb/translations/dictionary';
import {
  formatSimpleTime,
  formatToClock,
  formatToClockOrRelativeMinutes,
  isInPast,
} from '@atb/utils/date';
import style from './departure-time.module.css';

type DepartureTimeProps = {
  aimedDepartureTime: string;
  expectedDepartureTime: string;
  realtime?: boolean;
  cancelled?: boolean;
  relativeTime?: boolean;
};

export function DepartureTime({
  aimedDepartureTime,
  expectedDepartureTime,
  realtime,
  cancelled = false,
  relativeTime = false,
}: DepartureTimeProps) {
  const { t } = useTranslation();

  const representationType = getTimeRepresentationType({
    aimedTime: aimedDepartureTime,
    expectedTime: expectedDepartureTime,
    missingRealTime: !realtime,
  });
  const scheduled = useTimeOrRelative(aimedDepartureTime, relativeTime);
  const expected = useTimeOrRelative(expectedDepartureTime, relativeTime);

  switch (representationType) {
    case 'significant-difference': {
      return (
        <div className={style.significantDifferenceContainer}>
          <div className={style.significantDifference}>
            <Typo.p
              className={cancelled ? style.textColor__secondary : ''}
              textType={cancelled ? 'body__primary--strike' : 'body__primary'}
              aria-label={`${t(
                PageText.Departures.details.time.expectedPrefix,
              )} ${expected}`}
            >
              {expected}
            </Typo.p>
          </div>
          <Typo.p
            textType="body__tertiary"
            color="secondary"
            aria-label={`${t(
              PageText.Departures.details.time.aimedPrefix,
            )} ${scheduled}`}
            style={{ textDecorationLine: 'line-through' }}
          >
            {scheduled}
          </Typo.p>
        </div>
      );
    }
    case 'no-realtime': {
      return (
        <Typo.p
          className={cancelled ? style.textColor__secondary : ''}
          textType={cancelled ? 'body__primary--strike' : 'body__primary'}
        >
          {scheduled}
        </Typo.p>
      );
    }
    case 'no-significant-difference': {
      return (
        <div className={style.expectedContainer}>
          <Typo.p
            className={cancelled ? style.textColor__secondary : ''}
            textType={cancelled ? 'body__primary--strike' : 'body__primary'}
          >
            {expected}
          </Typo.p>
        </div>
      );
    }
  }
}

function useTimeOrRelative(time: string, relative: boolean) {
  const { t, language } = useTranslation();

  if (!relative) {
    return formatToClock(time, language, 'floor');
  }

  return isInPast(time)
    ? formatSimpleTime(time)
    : formatToClockOrRelativeMinutes(
        time,
        language,
        t(dictionary.date.units.now),
      );
}
