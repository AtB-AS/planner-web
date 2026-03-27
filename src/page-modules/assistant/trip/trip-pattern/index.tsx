import { AnimatePresence, motion } from 'framer-motion';
import { Fragment, useId, useRef, useState } from 'react';
import { getFilteredLegsByWalkOrWaitTime, tripSummary } from './utils';
import { PageText, useTranslation } from '@atb/translations';
import style from './trip-pattern.module.css';
import { formatToClock, isInPast, secondsBetween } from '@atb/utils/date';
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
import { AssistantDetailsBody } from '@atb/page-modules/assistant/details-body';
import { Price } from './price';
import { useInView } from 'react-intersection-observer';
import { Tag } from '@atb/components/tag';
import useResizeObserver from '@react-hook/resize-observer';

const DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_SECONDS = 60;
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
    // Consider a leg overflowing if its right edge is beyond the container
    if (elRect.right > containerRight + 1) {
      hiddenCount++;
    }
  }
  return hiddenCount;
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

  // Use ResizeObserver to track overflow count
  const legsContainerRef = useRef<HTMLDivElement>(null);
  const [overflowCount, setOverflowCount] = useState(0);

  useResizeObserver(legsContainerRef, () => {
    setOverflowCount(countOverflowingLegs(legsContainerRef.current));
  });

  const tripIsInPast = isInPast(tripPattern.legs[0].expectedStartTime);

  const isCancelled = tripPattern.legs.some(
    (leg) => leg.fromEstimatedCall?.cancellation,
  );

  const className = andIf({
    [style.tripPattern]: true,
  });

  const staySeated = (idx: number) => {
    const leg = filteredLegs[idx];
    return leg && leg.interchangeTo?.staySeated === true;
  };

  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '100px',
    threshold: 0,
  });

  const requireTicketBooking = tripPattern.legs.some((leg: ExtendedLegType) => {
    if (!leg.bookingArrangements) return false;
    return (
      getBookingStatus(leg.bookingArrangements, leg.aimedStartTime, 7) !==
      'none'
    );
  });

  return (
    <div ref={ref} className={style.tripPatternContainer}>
      <motion.div
        id={`${id}-details-region`}
        role="region"
        onClick={() => setIsOpen(!isOpen)}
        className={className}
        data-testid={testId}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{
          delay, // staggerChildren on parent only works first render
        }}
        aria-label={tripSummary(
          tripPattern,
          t,
          language,
          tripIsInPast,
          index + 1,
          isCancelled,
        )}
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
                      {leg.mode ? (
                        <TransportIconWithDuration
                          transportMode={leg.mode}
                          transportSubmode={leg.transportSubmode}
                          label={leg.line?.publicCode ?? undefined}
                          duration={
                            leg.mode === 'foot' ? leg.duration : undefined
                          }
                          isFlexible={isLineFlexibleTransport(leg.line)}
                        />
                      ) : (
                        <div className={style.legs__leg__walkIcon}>
                          <MonoIcon icon="transportation/WalkFill" />
                        </div>
                      )}

                      <div
                        className={style.timeStartContainer}
                        data-testid={`timeStartContainer-${i}`}
                      >
                        {secondsBetween(
                          leg.aimedStartTime,
                          leg.expectedStartTime,
                        ) > DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_SECONDS ? (
                          <>
                            <Typo.span
                              textType="body__xs"
                              testID="expStartTime"
                            >
                              {formatToClock(
                                leg.expectedStartTime,
                                language,
                                'floor',
                              )}
                            </Typo.span>
                            <Typo.span
                              textType="body__xs__strike"
                              className={style.outdated}
                              testID="aimedStartTime"
                            >
                              {formatToClock(
                                leg.aimedStartTime,
                                language,
                                'floor',
                              )}
                            </Typo.span>
                          </>
                        ) : (
                          <Typo.span
                            textType={
                              isCancelled ? 'body__xs__strike' : 'body__xs'
                            }
                            testID="expStartTime"
                          >
                            {formatToClock(
                              leg.aimedStartTime,
                              language,
                              'floor',
                            )}
                          </Typo.span>
                        )}
                      </div>
                    </div>
                  )}

                </Fragment>
              ))}
            </div>

            {overflowCount > 0 && (
              <div className={style.legs__collapsedLegs}>
                <Typo.span textType="body__m__strong">
                  +{overflowCount}
                </Typo.span>
              </div>
            )}

          </div>

          <div className={style.legs__lastLeg}>
            <div className={style.legs__lastLeg__icon}>
              <MonoIcon icon="places/Destination" />
            </div>
            <Typo.span
              textType={isCancelled ? 'body__xs__strike' : 'body__xs'}
              testID="expEndTime"
            >
              {formatToClock(tripPattern.expectedEndTime, language, 'ceil')}
            </Typo.span>
          </div>
        </div>
        <footer className={style.footer} onClick={() => setIsOpen(!isOpen)}>
          <div className={style.info__container}>
            {tripIsInPast && (
              <Tag
                type="warning"
                message={t(PageText.Assistant.trip.tripPattern.passedTrip)}
                testID="tripIsInPast"
              />
            )}
            {requireTicketBooking && (
              <Tag
                type="warning"
                message={t(PageText.Assistant.trip.tripPattern.requiresBooking)}
                testID="requireTicketBooking"
              />
            )}
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
              'aria-controls': `${id}-details-region`,
              'aria-expanded': isOpen,
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
              <AssistantDetailsBody tripPattern={tripPattern} />
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
