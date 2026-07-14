import { AnimatePresence, motion } from 'framer-motion';
import { useId, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { PageText, useTranslation } from '@atb/translations';
import style from './trip-pattern-collapse.module.css';
import { MonoIcon } from '@atb/components/icon';
import { useRouter } from 'next/router';
import { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';
import { useRefreshedTripPattern } from '@atb/page-modules/assistant/client';
import { ButtonLink } from '@atb/components/button';
import TripSection from '@atb/page-modules/assistant/details/trip-section';
import { getInterchangeDetails } from '@atb/page-modules/assistant/details/trip-section/interchange-section.tsx';
import { getLegWaitDetails } from '@atb/page-modules/assistant/details/trip-section/wait-section.tsx';
import { TripSummaryPanel } from '@atb/page-modules/assistant/trip-summary-panel';
import TravelCard from '@atb/page-modules/assistant/trip/travel-card';
import { tripSummary } from '../utils.ts';

const ANIMATION_DURATION = 0.2;

type Props = {
  tripPattern: ExtendedTripPatternWithDetailsType;
  delay: number;
  index: number;
  testId?: string;
};

export default function TripPatternCollapse({
  tripPattern,
  delay,
  index,
  testId,
}: Props) {
  const { t, language } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const id = useId();

  const { ref, inView } = useInView({ rootMargin: '100px' });

  const { refreshedTripPattern } = useRefreshedTripPattern(tripPattern, inView);
  const displayTripPattern = refreshedTripPattern ?? tripPattern;

  const filter = Array.isArray(router.query.filter)
    ? router.query.filter.join(',')
    : router.query.filter;
  const detailsHref = `/assistant/${displayTripPattern.compressedQuery}${filter ? `?filter=${filter}` : ''}`;

  return (
    <div ref={ref} className={style.collapseContainer}>
      <motion.div
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
        aria-controls={`${id}-details-region`}
        className={style.travelCard}
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
          index + 1,
        )}. ${isOpen ? t(PageText.Assistant.trip.tripPattern.activateToCollapse) : t(PageText.Assistant.trip.tripPattern.activateToExpand)}`}
      >
        <TravelCard
          tripPattern={displayTripPattern}
          onClick={() => setIsOpen((prev) => !prev)}
          isOpen={isOpen}
        />
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`${id}-details-region`}
            className={style.expanded}
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
                <TripSummaryPanel
                  tripPattern={displayTripPattern}
                  variant="compact"
                  detailsHref={detailsHref}
                />
                <ButtonLink
                  href={detailsHref}
                  title={t(PageText.Assistant.trip.tripPattern.details)}
                  mode="interactive_2"
                  size="small"
                  radiusSize="circular"
                  display="block"
                  className={style.goToDetailsButton}
                  icon={{
                    right: <MonoIcon icon="navigation/ChevronRight" />,
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
