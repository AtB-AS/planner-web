import { AnimatePresence, motion } from 'framer-motion';
import { useId, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { getFilteredLegsByWalkOrWaitTime, tripSummary } from './utils';
import { PageText, useTranslation } from '@atb/translations';
import style from './trip-pattern.module.css';
import {
  isInPast,
  secondsBetween,
  secondsToMinutes,
} from '@atb/utils/date';
import { TripPatternHeader } from './trip-pattern-header';
import { TintedMonoIcon } from '@atb/components/icon';
import { Typo } from '@atb/components/typography';
import {
  TransportIconWithDuration,
  TransportNotificationBadge,
} from '@atb/modules/transport-mode';
import { andIf } from '@atb/utils/css';
import { useRouter } from 'next/router';
import { isLineFlexibleTransport } from '@atb/modules/flexible';
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
import {
  getMostCriticalStatusColor,
  getMsgTypeForMostCriticalSituationOrNotice,
} from '@atb/modules/notifications';
import { getNoticesForLeg } from '@atb/page-modules/assistant/utils';
import { StatusColorName } from '@atb/modules/theme';
import { TransportSubmode } from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';
import { useIsomorphicLayoutEffect } from '@atb/utils/use-isomorphic-layout-effect';
import { useOverflowingChildren } from '@atb/utils/use-overflowing-children';

const SHORT_TRANSFER_SECONDS = 180;
const MIN_SIGNIFICANT_WAIT_SECONDS = 30;
const ANIMATION_DURATION = 0.2;

type TripPatternProps = {
  tripPattern: ExtendedTripPatternWithDetailsType;
  delay: number;
  index: number;
  testId?: string;
};

function getLegOverflowNotificationType(
  leg: ExtendedLegType,
): StatusColorName | undefined {
  return getMsgTypeForMostCriticalSituationOrNotice(
    leg.situations,
    getNoticesForLeg(leg),
    leg.fromEstimatedCall?.cancellation,
  );
}

function getLegNotificationType(
  leg: ExtendedLegType,
  previousLeg: ExtendedLegType | undefined,
): StatusColorName | undefined {
  const situationsMsgType = getLegOverflowNotificationType(leg);
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

  return getMostCriticalStatusColor([
    situationsMsgType,
    railReplacementMsgType,
    bookingMsgType,
    shortTransferMsgType,
  ]);
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

  const probeRef = useRef<HTMLDivElement>(null);
  const [reservePx, setReservePx] = useState(0);
  const [pillLeft, setPillLeft] = useState<number | null>(null);
  const [fontsTick, setFontsTick] = useState(0);

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

  const legNotificationTypes = renderedLegs.map(({ leg, originalIndex }) =>
    getLegNotificationType(leg, filteredLegs[originalIndex - 1]),
  );

  const anyOverflowBadge = legNotificationTypes.some(Boolean);

  const fingerprint = renderedLegs
    .map(({ leg }, i) => {
      const label =
        leg.mode === 'foot'
          ? `f${leg.duration ? secondsToMinutes(leg.duration) : ''}`
          : (leg.line?.publicCode ?? '');
      return `${leg.mode}:${label}:${legNotificationTypes[i] ? 'n' : ''}`;
    })
    .join('|');

  const depKey = `${fingerprint}|${fontsTick}`;

  const { rootRef, visibleCount, ready } = useOverflowingChildren({
    reservePx,
    depKey,
  });

  const hasOverflow = ready && visibleCount < renderedLegs.length;
  const overflowCount = hasOverflow ? renderedLegs.length - visibleCount : 0;

  const overflowNotificationType = getMostCriticalStatusColor(
    hasOverflow ? legNotificationTypes.slice(visibleCount) : [],
  );

  useIsomorphicLayoutEffect(() => {
    const probe = probeRef.current;
    const row = rootRef.current;
    if (!probe || !row) return;
    const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
    setReservePx(probe.offsetWidth + gap);
  }, [depKey, rootRef]);

  useIsomorphicLayoutEffect(() => {
    const row = rootRef.current;
    if (!row || !hasOverflow) {
      setPillLeft(null);
      return;
    }
    const boundaryIndex = visibleCount - 1;
    if (boundaryIndex < 0) {
      setPillLeft(0);
      return;
    }
    const boundary = row.querySelector<HTMLElement>(
      `[data-leg-index="${boundaryIndex}"]`,
    );
    if (!boundary) return;
    const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
    setPillLeft(
      boundary.getBoundingClientRect().right -
        row.getBoundingClientRect().left +
        gap,
    );
  }, [hasOverflow, visibleCount, reservePx, depKey, rootRef]);

  useIsomorphicLayoutEffect(() => {
    if (typeof document === 'undefined' || !('fonts' in document)) return;
    let cancelled = false;
    const bump = () => {
      if (!cancelled) setFontsTick((tick) => tick + 1);
    };
    document.fonts.ready.then(bump);
    document.fonts.addEventListener?.('loadingdone', bump);
    return () => {
      cancelled = true;
      document.fonts.removeEventListener?.('loadingdone', bump);
    };
  }, []);

  const renderLeg = (
    { leg }: { leg: ExtendedLegType; originalIndex: number },
    i: number,
  ) => (
    <div
      className={style.legs__leg}
      data-leg-index={i}
      data-overflowing={hasOverflow && i >= visibleCount ? 'true' : undefined}
      key={leg.id ?? i}
    >
      <TransportIconWithDuration
        transportMode={leg.mode}
        transportSubmode={leg.transportSubmode}
        label={
          leg.mode === 'foot' ? undefined : (leg.line?.publicCode ?? undefined)
        }
        duration={leg.mode === 'foot' ? leg.duration : undefined}
        isFlexible={isLineFlexibleTransport(leg.line)}
        notificationType={legNotificationTypes[i]}
      />
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
            <div className={style.legs__row} ref={rootRef}>
              {renderedLegs.map(renderLeg)}
            </div>
            {hasOverflow && (
              <div
                className={style.legs__collapsedLegsContainer}
                style={{
                  left: pillLeft ?? 0,
                  visibility: pillLeft == null ? 'hidden' : undefined,
                }}
              >
                <div className={style.legs__collapsedLegs}>
                  <Typo.span textType="body__m__strong">
                    +{overflowCount}
                  </Typo.span>
                </div>
                {overflowNotificationType && (
                  <TransportNotificationBadge
                    notificationType={overflowNotificationType}
                  />
                )}
              </div>
            )}
            <div
              className={style.legs__pillProbe}
              aria-hidden="true"
              ref={probeRef}
            >
              <div className={style.legs__collapsedLegs}>
                <Typo.span textType="body__m__strong">
                  +{renderedLegs.length}
                </Typo.span>
              </div>
              {anyOverflowBadge && (
                <TransportNotificationBadge notificationType="warning" />
              )}
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
