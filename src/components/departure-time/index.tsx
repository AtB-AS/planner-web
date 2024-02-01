import {
  Typo,
  BaseTypographyProps,
  screenReaderPause,
} from '@atb/components/typography';
import { getTimeRepresentationType } from '@atb/modules/time-representation';
import { ComponentText, useTranslation } from '@atb/translations';
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
    cancelled: cancelled,
  });
  const scheduled = useTimeOrRelative(aimedDepartureTime, relativeTime);
  const expected = useTimeOrRelative(expectedDepartureTime, relativeTime);

  switch (representationType) {
    case 'no-realtime-or-cancelled': {
      return (
        <TimeContainer
          time={scheduled}
          cancelled={cancelled}
          prefix="aimedPrefix"
        />
      );
    }
    case 'significant-difference': {
      // TimeContainer isn't needed for cancelled since
      // all cancelled departures are without realtime.
      // But using to make it consistent.
      return (
        <div className={style.significantDifferenceContainer}>
          <div className={style.significantDifference}>
            <TimeContainer
              time={expected}
              cancelled={cancelled}
              prefix="expectedPrefix"
            />
          </div>

          <Typo.p
            textType="body__tertiary--strike"
            color="secondary"
            aria-label={`${t(
              ComponentText.DepartureTime.time.aimedPrefix,
            )} ${scheduled}`}
          >
            {scheduled}
          </Typo.p>
        </div>
      );
    }
    case 'no-significant-difference': {
      return (
        <div className={style.expectedContainer}>
          <TimeContainer
            time={expected}
            cancelled={cancelled}
            prefix={realtime ? 'expectedPrefix' : 'aimedPrefix'}
          />
        </div>
      );
    }
  }
}

function TimeContainer({
  time,
  cancelled,
  prefix,
  ...props
}: {
  cancelled: boolean;
  time: string;
  prefix: keyof typeof ComponentText.DepartureTime.time;
} & Omit<BaseTypographyProps<'p'>, 'textType'>) {
  const { t } = useTranslation();

  return (
    <Typo.p
      className={cancelled ? style.textColor__secondary : ''}
      textType={cancelled ? 'body__primary--strike' : 'body__primary'}
      aria-label={
        cancelled
          ? `${screenReaderPause} ${t(ComponentText.DepartureTime.cancelled)}`
          : `${t(ComponentText.DepartureTime.time[prefix])} ${time}`
      }
      {...props}
    >
      {time}
    </Typo.p>
  );
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
