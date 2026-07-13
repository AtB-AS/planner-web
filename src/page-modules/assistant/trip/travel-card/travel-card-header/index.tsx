import style from './travel-card-header.module.css';
import { Typo } from '@atb/components/typography';
import { useTranslation, PageText, TranslateFunction } from '@atb/translations';
import {
  formatToClock,
  formatTripDuration,
  isInPast,
  secondsBetween,
} from '@atb/utils/date';
import { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';
import { StatusText, StatusType } from './status-text';
import { getBookingStatus } from '@atb/modules/flexible';
import { getDayPrefixedStartLabel, getTripFromToNames } from './utils';
import { and } from '@atb/utils/css';

const DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_SECONDS = 60;

type Props = {
  tripPattern: ExtendedTripPatternWithDetailsType;
  isCancelled?: boolean;
  size?: 'standard' | 'large';
  includeFromToInfo?: boolean;
  includeDayInfo?: boolean;
  includeDuration?: boolean;
};

type StatusConfig = {
  statusType: StatusType;
  text: string;
};

export function TravelCardHeader({
  tripPattern,
  isCancelled = false,
  size = 'standard',
  includeFromToInfo = false,
  includeDayInfo = false,
  includeDuration = true,
}: Props) {
  const { t, language } = useTranslation();

  const { duration } = formatTripDuration(
    tripPattern.expectedStartTime,
    tripPattern.expectedEndTime,
    language,
  );

  const hasStarted = isInPast(tripPattern.expectedStartTime);

  const expectedStartTimeLabel = getDayPrefixedStartLabel(
    tripPattern.expectedStartTime,
    formatToClock(tripPattern.expectedStartTime, language, 'floor'),
    includeDayInfo,
    language,
    t,
  );
  const expectedEndTimeLabel = formatToClock(
    tripPattern.expectedEndTime,
    language,
    'ceil',
  );

  const aimedStartTime =
    tripPattern.aimedStartTime ?? tripPattern.legs[0]?.aimedStartTime;
  const aimedEndTime =
    tripPattern.aimedEndTime ??
    tripPattern.legs[tripPattern.legs.length - 1]?.aimedEndTime;

  const aimedStartTimeLabel = getDayPrefixedStartLabel(
    aimedStartTime,
    formatToClock(aimedStartTime, language, 'floor'),
    includeDayInfo && hasStarted,
    language,
    t,
  );
  const aimedEndTimeLabel = formatToClock(aimedEndTime, language, 'ceil');

  const { fromName, toName } = getTripFromToNames(tripPattern, t);

  const startTimeDiffers =
    Math.abs(secondsBetween(aimedStartTime, tripPattern.expectedStartTime)) >
    DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_SECONDS;
  const endTimeDiffers =
    Math.abs(secondsBetween(aimedEndTime, tripPattern.expectedEndTime)) >
    DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_SECONDS;
  const showAimedTime = startTimeDiffers || endTimeDiffers;

  const statusConfig = getStatusConfig(tripPattern, isCancelled, t);

  return (
    <header
      className={and(
        style.header,
        includeFromToInfo && style.header__withFromToRow,
      )}
    >
      <div className={style.header__timesArea}>
        {statusConfig && (
          <StatusText
            statusType={statusConfig.statusType}
            text={statusConfig.text}
          />
        )}
        <div className={style.header__timesRow}>
          <Typo.span
            textType={
              size === 'large'
                ? 'heading__l'
                : isCancelled
                  ? 'body__m__strike'
                  : 'body__m__strong'
            }
            className={and(
              size === 'large' &&
                isCancelled &&
                style.header__timesText__cancelled,
            )}
            testID="expectedTimeRange"
          >
            {`${expectedStartTimeLabel} - ${expectedEndTimeLabel}`}
          </Typo.span>
        </div>
        {showAimedTime && (
          <Typo.span
            textType="body__s"
            className={style.header__aimedTime}
            testID="aimedTimeRange"
          >
            {t(PageText.Assistant.trip.tripPattern.originalTime)}{' '}
            {aimedStartTimeLabel} - {aimedEndTimeLabel}
          </Typo.span>
        )}
      </div>
      {includeDuration && (
        <div className={style.header__duration}>
          <Typo.span
            textType="body__s"
            className={style.header__durationText}
            testID="resultDuration"
          >
            {duration}
          </Typo.span>
        </div>
      )}
      {includeFromToInfo && (
        <Typo.h2
          textType="body__m"
          className={style.header__fromToRow}
          testID="fromToRow"
        >
          {fromName && toName
            ? t(
                PageText.Assistant.details.header.titleFromTo({
                  fromName,
                  toName,
                }),
              )
            : t(PageText.Assistant.details.header.title)}
        </Typo.h2>
      )}
    </header>
  );
}

function getStatusConfig(
  tripPattern: ExtendedTripPatternWithDetailsType,
  isCancelled: boolean,
  t: ReturnType<typeof useTranslation>['t'],
): StatusConfig | undefined {
  if (isCancelled) {
    return {
      statusType: 'error',
      text: t(PageText.Assistant.trip.tripPattern.statusText.cancelled),
    };
  }

  if (tripPattern.status === 'impossible') {
    return {
      statusType: 'error',
      text: t(PageText.Assistant.trip.tripPattern.statusText.impossible),
    };
  }

  const endIsInPast = isInPast(tripPattern.expectedEndTime);
  const startIsInPast = isInPast(tripPattern.expectedStartTime);

  if (endIsInPast) {
    return {
      statusType: 'error',
      text: t(PageText.Assistant.trip.tripPattern.statusText.ended),
    };
  }

  if (startIsInPast) {
    return {
      statusType: 'info',
      text: t(PageText.Assistant.trip.tripPattern.statusText.started),
    };
  }

  const bookingLegs = tripPattern.legs.filter((leg) => leg.bookingArrangements);
  if (bookingLegs.length > 0) {
    const anyDeadlineExceeded = bookingLegs.some(
      (leg) =>
        getBookingStatus(leg.bookingArrangements!, leg.aimedStartTime) ===
        'late',
    );
    if (anyDeadlineExceeded) {
      return {
        statusType: 'interactive',
        text: t(
          PageText.Assistant.trip.tripPattern.statusText
            .bookingDeadlineExceeded,
        ),
      };
    }
    return {
      statusType: 'info',
      text: t(PageText.Assistant.trip.tripPattern.statusText.requiresBooking),
    };
  }

  if (tripPattern.status === 'stale') {
    return {
      statusType: 'info',
      text: t(PageText.Assistant.trip.tripPattern.statusText.stale),
    };
  }

  return undefined;
}
