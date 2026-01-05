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
import { ColorIcon } from '../icon';
import { and } from '@atb/utils/css';

type DepartureTimeProps = {
  aimedDepartureTime: string;
  expectedDepartureTime: string;
  realtime?: boolean;
  cancelled?: boolean;
  relativeTime?: boolean;
  withRealtimeIndicator?: boolean;
};

export function DepartureTime({
  aimedDepartureTime,
  expectedDepartureTime,
  realtime,
  cancelled = false,
  relativeTime = false,
  withRealtimeIndicator = false,
}: DepartureTimeProps) {
  const { t } = useTranslation();

  const representationType = getTimeRepresentationType({
    aimedTime: aimedDepartureTime,
    expectedTime: expectedDepartureTime,
    missingRealTime: !realtime,
    cancelled: cancelled,
  });
  const scheduled = useTimeOrRelative(
    aimedDepartureTime,
    representationType !== 'significant-difference' ? relativeTime : false,
  );
  const expected = useTimeOrRelative(expectedDepartureTime, relativeTime);
  const showRealtimeIndicator = Boolean(withRealtimeIndicator && realtime);

  switch (representationType) {
    case 'no-realtime-or-cancelled': {
      return (
        <TimeContainer
          time={scheduled}
          cancelled={cancelled}
          prefix="aimedPrefix"
          realtimeIndicator={showRealtimeIndicator}
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
              realtimeIndicator={showRealtimeIndicator}
            />
          </div>

          <Typo.p
            textType="body__xs__strike"
            color="secondary"
            aria-label={`${t(
              ComponentText.DepartureTime.time.aimedPrefix,
            )} ${scheduled}`}
            testID="routeDepartureTime"
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
            realtimeIndicator={showRealtimeIndicator}
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
  realtimeIndicator,
  ...props
}: {
  cancelled: boolean;
  time: string;
  realtimeIndicator: boolean;
  prefix: keyof typeof ComponentText.DepartureTime.time;
} & Omit<BaseTypographyProps<'p'>, 'textType'>) {
  const { t } = useTranslation();

  // Label notes if it is realtime or not, so shouldn't show realtime indicator
  // for scren readers.
  return (
    <Typo.p
      className={and(
        cancelled ? style.textColor__secondary : '',
        style.timeContainer,
      )}
      textType={cancelled ? 'body__m__strike' : 'body__m'}
      aria-label={
        cancelled
          ? `${screenReaderPause} ${t(ComponentText.DepartureTime.cancelled)}`
          : `${t(ComponentText.DepartureTime.time[prefix])} ${time}`
      }
      testID="departureTime"
      {...props}
    >
      {realtimeIndicator && (
        <ColorIcon
          icon="status/Realtime"
          data-testid="rt-indicator"
          size="xSmall"
          role="none"
          alt=""
        />
      )}
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
