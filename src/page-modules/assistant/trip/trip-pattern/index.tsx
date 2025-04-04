import { useClientWidth } from '@atb/utils/use-client-width';
import { motion } from 'framer-motion';
import { Fragment, useEffect, useState } from 'react';
import { getFilteredLegsByWalkOrWaitTime, tripSummary } from './utils';
import { PageText, useTranslation } from '@atb/translations';
import style from './trip-pattern.module.css';
import { formatToClock, isInPast, secondsBetween } from '@atb/utils/date';
import { TripPatternHeader } from './trip-pattern-header';
import { MonoIcon } from '@atb/components/icon';
import { Typo } from '@atb/components/typography';
import { TransportIconWithLabel } from '@atb/modules/transport-mode';
import { andIf } from '@atb/utils/css';
import { useRouter } from 'next/router';
import { isLineFlexibleTransport } from '@atb/modules/flexible';
import { ExtendedTripPatternType } from '@atb/page-modules/assistant';

const LAST_LEG_PADDING = 20;
const DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_SECONDS = 60;

type TripPatternProps = {
  tripPattern: ExtendedTripPatternType;
  delay: number;
  index: number;
  testId?: string;
};

export default function TripPattern({
  tripPattern,
  delay,
  index,
  testId,
}: TripPatternProps) {
  const { t, language } = useTranslation();

  const filteredLegs = getFilteredLegsByWalkOrWaitTime(tripPattern);
  const router = useRouter();

  const [numberOfExpandedLegs, setNumberOfExpandedLegs] = useState(
    filteredLegs.length,
  );

  const expandedLegs = filteredLegs.slice(0, numberOfExpandedLegs);
  const collapsedLegs = filteredLegs.slice(
    numberOfExpandedLegs,
    filteredLegs.length,
  );

  const [legsParentWidth, legsParentRef] = useClientWidth<HTMLDivElement>();
  const [legsContentWidth, legsContentRef] = useClientWidth<HTMLDivElement>();

  // Dynamically collapse legs to fit horizontally
  useEffect(() => {
    if (legsParentWidth && legsContentWidth) {
      if (legsContentWidth >= legsParentWidth - LAST_LEG_PADDING) {
        setNumberOfExpandedLegs((val) => Math.max(val - 1, 1));
      }
      // TODO: Increase expanded legs if there is space?
    }
  }, [legsParentWidth, legsContentWidth]);

  const tripIsInPast = isInPast(tripPattern.legs[0].expectedStartTime);

  const maxOpacity = tripIsInPast ? 0.7 : 1;

  const isCancelled = tripPattern.legs.some(
    (leg) => leg.fromEstimatedCall?.cancellation,
  );

  const className = andIf({
    [style.tripPattern]: true,
    [style['tripPattern--old']]: tripIsInPast,
  });

  const staySeated = (idx: number) => {
    const leg = expandedLegs[idx];
    return leg && leg.interchangeTo?.staySeated === true;
  };

  const isNotLastLeg = (i: number) => {
    return i < expandedLegs.length - 1 || collapsedLegs.length > 0;
  };

  return (
    <motion.a
      href={`/assistant/${tripPattern.compressedQuery}?filter=${router.query.filter}`}
      className={className}
      data-testid={testId}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: maxOpacity, x: 0 }}
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
      <TripPatternHeader tripPattern={tripPattern} isCancelled={isCancelled} />

      <div className={style.legs}>
        <div className={style.legs__expandedLegsContainer} ref={legsParentRef}>
          <div className={style.legs__expandedLegs} ref={legsContentRef}>
            {expandedLegs.map((leg, i) => (
              <Fragment key={`leg-${leg.expectedStartTime}-${i}`}>
                {staySeated(i - 1) ? null : (
                  <div className={style.legs__leg}>
                    {leg.mode ? (
                      <TransportIconWithLabel
                        mode={{
                          transportMode: leg.mode,
                          transportSubModes: leg.transportSubmode
                            ? [leg.transportSubmode]
                            : undefined,
                        }}
                        label={leg.line?.publicCode ?? undefined}
                        duration={
                          leg.mode === 'foot' ? leg.duration : undefined
                        }
                        isFlexible={isLineFlexibleTransport(leg.line)}
                      />
                    ) : (
                      <div className={style.legs__leg__walkIcon}>
                        <MonoIcon icon="transportation/Walk" />
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
                          <Typo.span textType="body__tertiary">
                            {formatToClock(
                              leg.expectedStartTime,
                              language,
                              'floor',
                            )}
                          </Typo.span>
                          <Typo.span
                            textType="body__tertiary--strike"
                            className={style.outdatet}
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
                            isCancelled
                              ? 'body__tertiary--strike'
                              : 'body__tertiary'
                          }
                        >
                          {formatToClock(leg.aimedStartTime, language, 'floor')}
                        </Typo.span>
                      )}
                    </div>
                  </div>
                )}

                {isNotLastLeg(i) && !staySeated(i) && (
                  <div className={style.legs__legLineContainer}>
                    <div className={style.legs__legLine} />
                    <div className={style.legs__legLine} />
                  </div>
                )}
              </Fragment>
            ))}

            {collapsedLegs.length > 0 && (
              <div className={style.legs__collapsedLegs}>
                <Typo.span textType="body__primary--bold">
                  +{collapsedLegs.length}
                </Typo.span>
              </div>
            )}
          </div>

          <div className={style.legs__lastLegLineContainer}>
            <div className={style.legs__lastLegLine} />
          </div>
        </div>

        <div className={style.legs__lastLeg}>
          <div className={style.legs__lastLeg__icon}>
            <MonoIcon icon="places/Destination" />
          </div>
          <Typo.span
            textType={isCancelled ? 'body__tertiary--strike' : 'body__tertiary'}
          >
            {formatToClock(tripPattern.expectedEndTime, language, 'ceil')}
          </Typo.span>
        </div>
      </div>

      <footer className={style.footer}>
        <Typo.span textType="body__primary" className={style.footer__details}>
          {t(PageText.Assistant.trip.tripPattern.details)}
          <MonoIcon icon="navigation/ArrowRight" />
        </Typo.span>
      </footer>
    </motion.a>
  );
}
