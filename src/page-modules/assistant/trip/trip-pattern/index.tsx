import { AnimatePresence, motion } from 'framer-motion';
import { ColorIcon } from '@atb/components/icon';
import { Fragment, useId, useRef, useState } from 'react';
import { getFilteredLegsByWalkOrWaitTime, tripSummary } from './utils';
import { PageText, useTranslation } from '@atb/translations';
import style from './trip-pattern.module.css';
import { isInPast, secondsBetween } from '@atb/utils/date';
import { TripPatternHeader } from './trip-pattern-header';
import { MonoIcon } from '@atb/components/icon';
import { Typo } from '@atb/components/typography';
import { TransportIconWithDuration } from '@atb/modules/transport-mode';
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
import { Button, ButtonLink } from '@atb/components/button';
import TripSection from '@atb/page-modules/assistant/details/trip-section';
import { getInterchangeDetails } from '@atb/page-modules/assistant/details/trip-section/interchange-section.tsx';
import { getLegWaitDetails } from '@atb/page-modules/assistant/details/trip-section/wait-section.tsx';
import { Price } from './price';
import { useInView } from 'react-intersection-observer';
import useResizeObserver from '@react-hook/resize-observer';
import {
  getMsgTypeForMostCriticalSituationOrNotice,
  messageTypeToColorIcon,
} from '@atb/modules/situations';
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

/**
 * Count how many leg elements overflow the container's visible width.
 * Each leg item is a direct child with data-leg-index attribute.
 */
function countOverflowingLegs(container: HTMLElement | null): number {
  if (!container) return 0;
  const containerRight = container.getBoundingClientRect().right;
  const legElements = Array.from(container.querySelectorAll('[data-leg-index]'));
  let hiddenCount = 0;
  for (const el of legElements) {
    const elRect = el.getBoundingClientRect();
    if (elRect.right > containerRight + 1) {
      hiddenCount++;
    }
  }
  return hiddenCount;
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
  const bookingMsgType = leg.bookingArrangements ? ('warning' as const) : undefined;
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
  ].reduce<StatusColorName | undefined>(toMostCriticalNotificationStatus, undefined);
}

export default function TripPattern({
  tripPattern,
  delay,
  index,
  testId,
}: TripPatternProps) {
  const { t, language } = useTranslation();

  const filteredLegs = getFilteredLegsByWalkOrWaitTime(tripPattern);

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const id = useId();

  const legsContainerRef = useRef<HTMLDivElement>(null);
  const [overflowCount, setOverflowCount] = useState(0);

  useResizeObserver(legsContainerRef, () => {
    setOverflowCount(countOverflowingLegs(legsContainerRef.current));
  });

  const tripIsInPast = isInPast(tripPattern.legs[0].expectedStartTime);

  const isCancelled = tripPattern.legs.some(
    (leg) => leg.fromEstimatedCall?.cancellation,
  );

  const staySeated = (idx: number) => {
    const leg = filteredLegs[idx];
    return leg && leg.interchangeTo?.staySeated === true;
  };

  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '100px',
    threshold: 0,
  });

  const overflowNotificationType: StatusColorName | undefined =
    overflowCount > 0
      ? filteredLegs
          .slice(-overflowCount)
          .map((leg) =>
            getMsgTypeForMostCriticalSituationOrNotice(
              leg.situations,
              getNoticesForLeg(leg),
              leg.fromEstimatedCall?.cancellation,
            ),
          )
          .reduce<StatusColorName | undefined>(
            toMostCriticalNotificationStatus,
            undefined,
          )
      : undefined;

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
          tripPattern,
          t,
          language,
          tripIsInPast,
          index + 1,
          isCancelled,
        )}. ${isOpen ? t(PageText.Assistant.trip.tripPattern.activateToCollapse) : t(PageText.Assistant.trip.tripPattern.activateToExpand)}`}
      >
        <TripPatternHeader
          tripPattern={tripPattern}
          isCancelled={isCancelled}
        />

        <div className={style.legs}>
          <div className={style.legs__legsAndLine}>
            <div
              className={style.legs__expandedLegs}
              ref={legsContainerRef}
            >
              {filteredLegs.map((leg, i) => (
                <Fragment key={`leg-${leg.expectedStartTime}-${i}`}>
                  {staySeated(i - 1) ? null : (
                    <div
                      className={style.legs__leg}
                      data-leg-index={i}
                    >
                      {leg.mode === 'foot' ? (
                        <div className={style.legs__leg__walkIcon}>
                          <MonoIcon icon="transportation/WalkFill" />
                        </div>
                      ) : (
                        <TransportIconWithDuration
                          transportMode={leg.mode}
                          transportSubmode={leg.transportSubmode}
                          label={leg.line?.publicCode ?? undefined}
                          isFlexible={isLineFlexibleTransport(leg.line)}
                          notificationType={getLegNotificationType(
                            leg,
                            filteredLegs[i - 1],
                          )}
                        />
                      )}
                    </div>
                  )}
                </Fragment>
              ))}
            </div>

            {overflowCount > 0 && (
              <div className={style.legs__collapsedLegsContainer}>
                <div className={style.legs__collapsedLegs}>
                  <Typo.span textType="body__m__strong">
                    +{overflowCount}
                  </Typo.span>
                </div>
                {overflowNotificationType && (
                  <span
                    className={style.legs__collapsedLegs__notification}
                    aria-hidden="true"
                  >
                    <ColorIcon
                      icon={messageTypeToColorIcon(overflowNotificationType)}
                      size="xSmall"
                    />
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <footer className={style.footer}>

          <div className={style.info__container}>
            <Price
              tripPattern={tripPattern}
              inView={inView}
              size="small"
              behaviour={{ ifNotFound: 'show-text' }}
            />
          </div>
          <Button
            title={
              isOpen
                ? t(PageText.Assistant.trip.tripPattern.seeLess)
                : t(PageText.Assistant.trip.tripPattern.seeMore)
            }
            buttonProps={{
              tabIndex: -1,
              'aria-hidden': true,
            }}
            className={style.seeMoreButton}
            size={'pill'}
            onClick={() => setIsOpen(!isOpen)}
            icon={{
              right: (
                <MonoIcon
                  icon="navigation/ExpandMore"
                  className={andIf({
                    [style.chevron]: true,
                    [style.chevron__rotated]: isOpen,
                  })}
                />
              ),
            }}
          />
        </footer>
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
            <div className={style.accordionBody}>
              {tripPattern.legs.map((leg, index) => (
                <TripSection
                  key={index}
                  isFirst={index === 0}
                  isLast={index === tripPattern.legs.length - 1}
                  leg={leg}
                  interchangeDetails={getInterchangeDetails(
                    tripPattern.legs,
                    leg.interchangeTo?.toServiceJourney?.id,
                    t,
                  )}
                  legWaitDetails={getLegWaitDetails(
                    leg,
                    tripPattern.legs[index + 1],
                  )}
                />
              ))}
            </div>
            <div className={style.accordionFooter}>
              <ButtonLink
                href={`/assistant/${tripPattern.compressedQuery}?filter=${router.query.filter}`}
                title={t(PageText.Assistant.trip.tripPattern.details)}
                mode="interactive_2"
                size="pill"
                radiusSize="circular"
                className={style.goToDetailsButton}
                icon={{ right: <MonoIcon icon="navigation/ArrowRight" /> }}
                testID="moreDetailsButton"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
