import { nextDisplayedDeparture } from '@atb/page-modules/assistant/trip/utils';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useId, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { PageText, useTranslation } from '@atb/translations';
import style from './trip-pattern-collapse.module.css';
import { MonoIcon } from '@atb/components/icon';
import { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';
import { useRefreshedTripPattern } from '@atb/page-modules/assistant/client';
import { Button } from '@atb/components/button';
import TripSection from '@atb/page-modules/assistant/details/trip-section';
import { getLegWaitDetails } from '@atb/page-modules/assistant/details/trip-section/wait-section.tsx';
import { useLiveVehicleServiceJourneyIds } from '@atb/page-modules/assistant/details/use-live-vehicle-ids';
import { TripSummaryPanel } from '@atb/page-modules/assistant/trip-summary-panel';
import TravelCard from '@atb/page-modules/assistant/trip/travel-card';
import { tripSummary } from '../utils.ts';
import { useOpenTrip } from '@atb/page-modules/trip/use-open-trip';

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
  const id = useId();
  const shouldReduceMotion = useReducedMotion();
  const animationDuration = shouldReduceMotion ? 0 : ANIMATION_DURATION;

  const { ref, inView } = useInView({ rootMargin: '100px' });

  const { refreshedTripPattern } = useRefreshedTripPattern(tripPattern, inView);
  const displayTripPattern = refreshedTripPattern ?? tripPattern;

  const liveVehicleServiceJourneyIds = useLiveVehicleServiceJourneyIds(
    displayTripPattern.legs,
    isOpen,
  );

  const { openTrip, isLoading: isOpeningTrip } = useOpenTrip();
  const openDetails = () => openTrip(displayTripPattern);

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
        initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -10 }}
        transition={{
          delay,
        }}
        aria-label={tripSummary(displayTripPattern, t, language, index + 1)}
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
              transition: { duration: animationDuration },
            }}
            exit={{ height: 0, transition: { duration: animationDuration } }}
          >
            <div className={style.detailsGrid}>
              <div className={style.accordionBody}>
                {displayTripPattern.legs.map((leg, index) => (
                  <TripSection
                    key={index}
                    isFirst={index === 0}
                    isLast={index === displayTripPattern.legs.length - 1}
                    leg={leg}
                    hasLiveVehicle={
                      !!leg.serviceJourney?.id &&
                      liveVehicleServiceJourneyIds.has(leg.serviceJourney.id)
                    }
                    legWaitDetails={getLegWaitDetails(
                      displayTripPattern.legs,
                      index,
                    )}
                    nextLegStartTime={nextDisplayedDeparture(
                      displayTripPattern.legs,
                      index,
                    )}
                  />
                ))}
              </div>
              <div className={style.detailsAside}>
                <TripSummaryPanel
                  tripPattern={displayTripPattern}
                  variant="compact"
                  onDetailsClick={openDetails}
                />
                <Button
                  onClick={openDetails}
                  state={isOpeningTrip ? 'loading' : 'none'}
                  title={t(PageText.Assistant.trip.tripPattern.details)}
                  mode="secondary"
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
