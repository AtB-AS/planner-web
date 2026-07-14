import style from './travel-card-header.module.css';
import { Typo } from '@atb/components/typography';
import { useTranslation, PageText } from '@atb/translations';
import { formatToClock, formatTripDuration, isInPast } from '@atb/utils/date';
import { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';
import { StatusText } from './status-text';
import ScreenReaderOnly from '@atb/components/screen-reader-only';
import { getDayPrefixedStartLabel, getTripFromToNames } from './utils';
import {
  getStatusConfig,
  getTripPatternAimedTimes,
  getTripPatternStatus,
  shouldShowAimedTime,
} from '../../utils.ts';
import { and } from '@atb/utils/css';

type Props = {
  tripPattern: ExtendedTripPatternWithDetailsType;
  size?: 'standard' | 'large';
  includeFromToInfo?: boolean;
  includeDayInfo?: boolean;
  includeDuration?: boolean;
};

export function TravelCardHeader({
  tripPattern,
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

  const { aimedStartTime, aimedEndTime } =
    getTripPatternAimedTimes(tripPattern);

  const aimedStartTimeLabel = getDayPrefixedStartLabel(
    aimedStartTime,
    formatToClock(aimedStartTime, language, 'floor'),
    includeDayInfo && hasStarted,
    language,
    t,
  );
  const aimedEndTimeLabel = formatToClock(aimedEndTime, language, 'ceil');

  const { fromName, toName } = getTripFromToNames(tripPattern, t);

  const showAimedTime = shouldShowAimedTime(tripPattern);

  const status = getTripPatternStatus(tripPattern);
  const statusConfig = getStatusConfig(status, t);
  const isCancelled = status === 'cancelled';

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
            aria-hidden="true"
          >
            {`${expectedStartTimeLabel} - ${expectedEndTimeLabel}`}
          </Typo.span>
          <ScreenReaderOnly
            text={t(
              PageText.Assistant.trip.tripPattern.expectedTime.a11yLabel(
                expectedStartTimeLabel,
                expectedEndTimeLabel,
                showAimedTime,
              ),
            )}
          />
        </div>
        {showAimedTime && (
          <>
            <Typo.span
              textType="body__s"
              className={style.header__aimedTime}
              testID="aimedTimeRange"
              aria-hidden="true"
            >
              {t(PageText.Assistant.trip.tripPattern.originalTime)}{' '}
              {aimedStartTimeLabel} - {aimedEndTimeLabel}
            </Typo.span>
            <ScreenReaderOnly
              text={t(
                PageText.Assistant.trip.tripPattern.aimedTime.a11yLabel(
                  aimedStartTimeLabel,
                  aimedEndTimeLabel,
                ),
              )}
            />
          </>
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
