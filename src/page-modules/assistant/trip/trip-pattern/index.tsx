import { AnimatePresence, motion } from 'framer-motion';
import { useId, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { getFilteredLegsByWalkOrWaitTime, tripSummary } from './utils';
import { PageText, useTranslation } from '@atb/translations';
import style from './trip-pattern.module.css';
import { isInPast, secondsBetween } from '@atb/utils/date';
import { TripPatternHeader } from './trip-pattern-header';
import { TintedMonoIcon } from '@atb/components/icon';
import { Typo } from '@atb/components/typography';
import {
  TransportIconWithDuration,
  TransportNotificationBadge,
} from '@atb/modules/transport-mode';
import { andIf } from '@atb/utils/css';
import { useRouter } from 'next/router';
import {
  getBookingStatus,
  isLineFlexibleTransport,
} from '@atb/modules/flexible';
import {
  ExtendedLegType,
  ExtendedTripPatternWithDetailsType,
} from '@atb/page-modules/assistant';
import { useRefreshedTripPattern } from '@atb/page-modules/assistant/client';
import { Button, ButtonLink } from '@atb/components/button';
import TripSection from '@atb/page-modules/assistant/details/trip-section';
import { getInterchangeDetails } from '@atb/page-modules/assistant/details/trip-section/interchange-section.tsx';
import { getLegWaitDetails } from '@atb/page-modules/assistant/details/trip-section/wait-section.tsx';
import { TripSummaryPanel } from '@atb/page-modules/assistant/trip-summary-panel';
import useResizeObserver from '@react-hook/resize-observer';
import { getMsgTypeForMostCriticalSituationOrNotice } from '@atb/modules/situations';
import { getNoticesForLeg } from '@atb/page-modules/assistant/utils';
import { StatusColorName } from '@atb/modules/theme';
import { TransportSubmode } from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';

const SHORT_TRANSFER_SECONDS = 180;
const MIN_SIGNIFICANT_WAIT_SECONDS = 30;
const ANIMATION_DURATION = 0.2;

type TripPatternProps = {
  tripPattern: ExtendedTripPatternWithDetailsType;
  delay: number;
  index: number;
  testId?: string;
};

type VisibleLegsState = { visibleCount: number; hasOverflow: boolean };

function computeVisibleLegs(container: HTMLElement | null): VisibleLegsState {
  if (!container) return { visibleCount: Infinity, hasOverflow: false };

  const legElements = Array.from(
    container.querySelectorAll('[data-leg-index]'),
  );
  const total = legElements.length;
  const containerRight = container.getBoundingClientRect().right;

  const allFit = legElements.every(
    (el) => el.getBoundingClientRect().right <= containerRight + 1,
  );
  if (allFit) return { visibleCount: total, hasOverflow: false };

  const pill = container.querySelector('[data-overflow-pill]');
  const pillWidth = pill ? pill.getBoundingClientRect().width : 0;
  const gap = parseFloat(getComputedStyle(container).columnGap) || 0;
  const limit = containerRight - pillWidth - gap;

  let visibleCount = 0;
  for (const el of legElements) {
    if (el.getBoundingClientRect().right <= limit + 1) {
      visibleCount++;
    } else {
      break;
    }
  }
  return { visibleCount, hasOverflow: true };
}

function toMostCriticalNotificationStatus(
  a: StatusColorName | undefined,
  b: StatusColorName | undefined,
): StatusColorName | undefined {
  const priority: Record<StatusColorName, number> = {
    error: 3,
    warning: 2,
    info: 1,
    valid: 0,
  };
  if (!a) return b;
  if (!b) return a;
  return (priority[a] ?? 0) >= (priority[b] ?? 0) ? a : b;
}

function getLegNotificationType(
  leg: ExtendedLegType,
  previousLeg: ExtendedLegType | undefined,
): StatusColorName | undefined {
  const situationsMsgType = getMsgTypeForMostCriticalSituationOrNotice(
    leg.situations,
    getNoticesForLeg(leg),
    leg.fromEstimatedCall?.cancellation,
  );
  const railReplacementMsgType =
    leg.transportSubmode === TransportSubmode.RailReplacementBus
      ? ('warning' as const)
      : undefined;
  const bookingMsgType = leg.bookingArrangements
    ? ('warning' as const)
    : undefined;
  const shortTransferMsgType: StatusColorName | undefined = (() => {
    if (!previousLeg) return undefined;
    const waitSeconds = secondsBetween(
      previousLeg.expectedEndTime,
      leg.expectedStartTime,
    );
    return waitSeconds > MIN_SIGNIFICANT_WAIT_SECONDS &&
      waitSeconds <= SHORT_TRANSFER_SECONDS
      ? 'info'
      : undefined;
  })();

  return [
    situationsMsgType,
    railReplacementMsgType,
    bookingMsgType,
    shortTransferMsgType,
  ].reduce<StatusColorName | undefined>(
    toMostCriticalNotificationStatus,
    undefined,
  );
}

export default function TripPattern({
  tripPattern,
  delay,
  index,
  testId,
}: TripPatternProps) {
  const { t, language } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const id = useId();

  const { ref, inView } = useInView({ rootMargin: '100px' });

  const measureRef = useRef<HTMLDivElement>(null);
  const [{ visibleCount, hasOverflow }, setVisibleLegs] =
    useState<VisibleLegsState>({ visibleCount: Infinity, hasOverflow: false });

  useResizeObserver(measureRef, () => {
    setVisibleLegs(computeVisibleLegs(measureRef.current));
  });

  const tripIsInPast = isInPast(tripPattern.legs[0].expectedStartTime);

  const isCancelled = tripPattern.legs.some(
    (leg) => leg.fromEstimatedCall?.cancellation,
  );

  const { refreshedTripPattern } = useRefreshedTripPattern(tripPattern, inView);
  const displayTripPattern = refreshedTripPattern ?? tripPattern;

  const filteredLegs = getFilteredLegsByWalkOrWaitTime(displayTripPattern);

  const staySeated = (idx: number) => {
    const leg = filteredLegs[idx];
    return leg && leg.interchangeTo?.staySeated === true;
  };

  const renderedLegs = filteredLegs
    .map((leg, originalIndex) => ({ leg, originalIndex }))
    .filter(({ originalIndex }) => !staySeated(originalIndex - 1));

  const visibleLegs = hasOverflow
    ? renderedLegs.slice(0, visibleCount)
    : renderedLegs;
  const hiddenLegs = hasOverflow ? renderedLegs.slice(visibleCount) : [];
  const overflowCount = hiddenLegs.length;

  const overflowNotificationType = hiddenLegs
    .map(({ leg }) =>
      getMsgTypeForMostCriticalSituationOrNotice(
        leg.situations,
        getNoticesForLeg(leg),
        leg.fromEstimatedCall?.cancellation,
      ),
    )
    .reduce<
      StatusColorName | undefined
    >(toMostCriticalNotificationStatus, undefined);

  const renderLeg = ({
    leg,
    originalIndex,
  }: {
    leg: ExtendedLegType;
    originalIndex: number;
  }) => (
    <div
      className={style.legs__leg}
      data-leg-index={originalIndex}
      key={`leg-${leg.expectedStartTime}-${originalIndex}`}
    >
      <TransportIconWithDuration
        transportMode={leg.mode}
        transportSubmode={leg.transportSubmode}
        label={
          leg.mode === 'foot' ? undefined : (leg.line?.publicCode ?? undefined)
        }
        duration={leg.mode === 'foot' ? leg.duration : undefined}
        isFlexible={isLineFlexibleTransport(leg.line)}
        notificationType={getLegNotificationType(
          leg,
          filteredLegs[originalIndex - 1],
        )}
      />
    </div>
  );

  const overflowPill = (forMeasurement: boolean) => (
    <div className={style.legs__collapsedLegsContainer}>
      <div
        className={style.legs__collapsedLegs}
        data-overflow-pill={forMeasurement ? '' : undefined}
      >
        <Typo.span textType="body__m__strong">+{overflowCount}</Typo.span>
      </div>
      {!forMeasurement && overflowNotificationType && (
        <TransportNotificationBadge
          notificationType={overflowNotificationType}
        />
      )}
    </div>
  );

  return (
    <div ref={ref} className={style.tripPatternContainer}>
      <motion.div
        id={`${id}-details-region`}
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        aria-expanded={isOpen}
        className={style.tripPattern}
        data-testid={testId}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{
          delay,
        }}
        aria-label={`${tripSummary(
          displayTripPattern,
          t,
          language,
          tripIsInPast,
          index + 1,
          isCancelled,
        )}. ${isOpen ? t(PageText.Assistant.trip.tripPattern.activateToCollapse) : t(PageText.Assistant.trip.tripPattern.activateToExpand)}`}
      >
        <TripPatternHeader
          tripPattern={displayTripPattern}
          isCancelled={isCancelled}
        />

        <div className={style.legs}>
          <div className={style.legs__legsAndLine}>
            <div className={style.legs__visibleRow}>
              {visibleLegs.map(renderLeg)}
              {overflowCount > 0 && overflowPill(false)}
            </div>
            <div
              className={style.legs__measureRow}
              ref={measureRef}
              aria-hidden="true"
            >
              {renderedLegs.map(renderLeg)}
              {overflowPill(true)}
            </div>
          </div>
          <Button
            title={
              isOpen
                ? t(PageText.Assistant.trip.tripPattern.seeLess)
                : t(PageText.Assistant.trip.tripPattern.seeMore)
            }
            mode="transparent"
            buttonProps={{
              tabIndex: -1,
              'aria-hidden': true,
            }}
            className={style.seeMoreButton}
            size={'pill'}
            onClick={() => setIsOpen(!isOpen)}
            icon={{
              right: (
                <TintedMonoIcon
                  icon="navigation/ExpandMore"
                  className={andIf({
                    [style.chevron]: true,
                    [style.chevron__rotated]: isOpen,
                  })}
                />
              ),
            }}
          />
        </div>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={style.details}
            initial={{ height: 0 }}
            animate={{
              height: 'auto',
              transition: { duration: ANIMATION_DURATION },
            }}
            exit={{ height: 0, transition: { duration: ANIMATION_DURATION } }}
          >
            <div className={style.detailsGrid}>
              <div className={style.accordionBody}>
                {displayTripPattern.legs.map((leg, index) => (
                  <TripSection
                    key={index}
                    isFirst={index === 0}
                    isLast={index === displayTripPattern.legs.length - 1}
                    leg={leg}
                    interchangeDetails={getInterchangeDetails(
                      displayTripPattern.legs,
                      leg.interchangeTo?.toServiceJourney?.id,
                      t,
                    )}
                    legWaitDetails={getLegWaitDetails(
                      leg,
                      displayTripPattern.legs[index + 1],
                    )}
                  />
                ))}
              </div>
              <div className={style.detailsAside}>
                <TripSummaryPanel tripPattern={displayTripPattern} />
                <ButtonLink
                  href={`/assistant/${displayTripPattern.compressedQuery}?filter=${router.query.filter}`}
                  title={t(PageText.Assistant.trip.tripPattern.details)}
                  mode="interactive_2"
                  size="small"
                  radiusSize="circular"
                  display="block"
                  className={style.goToDetailsButton}
                  icon={{
                    right: <TintedMonoIcon icon="navigation/ArrowRight" />,
                  }}
                  testID="moreDetailsButton"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
