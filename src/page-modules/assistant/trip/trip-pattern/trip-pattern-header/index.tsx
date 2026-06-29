import style from './trip-pattern-header.module.css';
import { Typo } from '@atb/components/typography';
import { useTranslation, PageText, TranslateFunction } from '@atb/translations';
import {
  formatToClock,
  formatTripDuration,
  isInPast,
  secondsBetween,
} from '@atb/utils/date';
import { Assistant } from '@atb/translations/pages';
import { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';
import { QuayFragment } from '@atb/page-modules/assistant/journey-gql/trip-with-details.generated.ts';
import { StatusText, StatusType } from './status-text';
import { getBookingStatus } from '@atb/modules/flexible';

const DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_SECONDS = 60;

type TripPatternHeaderProps = {
  tripPattern: ExtendedTripPatternWithDetailsType;
  isCancelled?: boolean;
};

type StatusConfig = {
  statusType: StatusType;
  text: string;
};

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

export function TripPatternHeader({
  tripPattern,
  isCancelled = false,
}: TripPatternHeaderProps) {
  const { t, language } = useTranslation();

  const { duration } = formatTripDuration(
    tripPattern.expectedStartTime,
    tripPattern.expectedEndTime,
    language,
  );

  const expectedStartTimeLabel = formatToClock(
    tripPattern.expectedStartTime,
    language,
    'floor',
  );
  const expectedEndTimeLabel = formatToClock(
    tripPattern.expectedEndTime,
    language,
    'ceil',
  );

  const aimedStartTime = tripPattern.legs[0]?.aimedStartTime;
  const aimedEndTime =
    tripPattern.legs[tripPattern.legs.length - 1]?.aimedEndTime;

  const aimedStartTimeLabel = formatToClock(aimedStartTime, language, 'floor');
  const aimedEndTimeLabel = formatToClock(aimedEndTime, language, 'ceil');

  const startTimeDiffers =
    secondsBetween(aimedStartTime, tripPattern.expectedStartTime) >
    DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_SECONDS;
  const endTimeDiffers =
    secondsBetween(aimedEndTime, tripPattern.expectedEndTime) >
    DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_SECONDS;
  const showAimedTime = startTimeDiffers || endTimeDiffers;

  const statusConfig = getStatusConfig(tripPattern, isCancelled, t);

  return (
    <header className={style.header}>
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
              isCancelled ? 'body__m__strong__strike' : 'body__m__strong'
            }
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
      <div className={style.header__metaArea}>
        <Typo.span
          textType="body__s"
          className={style.header__duration}
          testID="resultDuration"
        >
          {duration}
        </Typo.span>
      </div>
    </header>
  );
}

export function getQuayOrPlaceName(
  t: TranslateFunction,
  quay?: QuayFragment,
  name?: string,
): string | undefined {
  if (!quay) return name;
  if (!quay.publicCode) return quay.name;
  const prefix = t(Assistant.trip.tripPattern.quayPublicCodePrefix);
  return `${quay.name}${prefix ? prefix : ' '}${quay.publicCode}`;
}
