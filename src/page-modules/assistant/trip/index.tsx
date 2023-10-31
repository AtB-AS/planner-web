import { formatLocaleTime, secondsToDuration } from '@atb/utils/date';
import {
  TripData,
  type TripPattern,
} from '@atb/page-modules/assistant/server/journey-planner/validators';
import style from './trip.module.css';
import { PageText, useTranslation } from '@atb/translations';
import { Typo } from '@atb/components/typography';
import { motion } from 'framer-motion';
import { MonoIcon } from '@atb/components/icon';
import { TransportIconWithLabel } from '@atb/components/transport-mode/transport-icon';
import { GeocoderFeature } from '@atb/page-modules/departures';
import { TransportModeFilterOption } from '@atb/components/transport-mode-filter/types';
import { nextTripPatterns } from '@atb/page-modules/assistant/client';
import { createTripQuery } from '@atb/page-modules/assistant';
import { useEffect, useState } from 'react';
import { getInitialTransportModeFilter } from '@atb/components/transport-mode-filter/utils';
import { Button } from '@atb/components/button';

export type TripProps = {
  initialFromFeature: GeocoderFeature;
  initialToFeature: GeocoderFeature;
  initialTransportModesFilter: TransportModeFilterOption[] | null;
  trip: TripData;
  departureType: 'arrival' | 'departure';
};

function tripPatternsWithTransitionDelay(tripPatterns: TripPattern[]) {
  return tripPatterns.map((tripPattern, i) => ({
    ...tripPattern,
    transitionDelay: i * 0.1,
  }));
}

export default function Trip({
  initialFromFeature,
  initialToFeature,
  initialTransportModesFilter,
  trip,
  departureType,
}: TripProps) {
  const { t } = useTranslation();
  const [tripPatterns, setTripPatterns] = useState(
    tripPatternsWithTransitionDelay(trip.tripPatterns),
  );
  const [nextPageCursor, setNextPageCursor] = useState(trip.nextPageCursor);
  const [previousPageCursor, setPreviousPageCursor] = useState(
    trip.previousPageCursor,
  );
  const [isFetchingTripPatterns, setIsFetchingTripPatterns] = useState(false);

  useEffect(() => {
    setTripPatterns(tripPatternsWithTransitionDelay(trip.tripPatterns));
    setNextPageCursor(trip.nextPageCursor);
    setPreviousPageCursor(trip.previousPageCursor);
  }, [trip]);

  const fetchNextTripPatterns = async () => {
    setIsFetchingTripPatterns(true);
    const tripQuery = createTripQuery(
      initialFromFeature,
      initialToFeature,
      getInitialTransportModeFilter(initialTransportModesFilter) || undefined,
    );
    const cursor =
      departureType === 'arrival' ? previousPageCursor : nextPageCursor;
    const trip = await nextTripPatterns(tripQuery, cursor);
    setTripPatterns([
      ...tripPatterns,
      ...tripPatternsWithTransitionDelay(trip.tripPatterns),
    ]);
    departureType === 'arrival'
      ? setPreviousPageCursor(trip.previousPageCursor)
      : setNextPageCursor(trip.nextPageCursor);

    setIsFetchingTripPatterns(false);
  };
  return (
    <>
      {tripPatterns.map((tripPattern, i) => (
        <TripPattern
          key={`tripPattern-${tripPattern.expectedStartTime}-${i}`}
          tripPattern={tripPattern}
          delay={tripPattern.transitionDelay}
        />
      ))}
      <Button
        className={style.fetchButton}
        onClick={fetchNextTripPatterns}
        title={t(PageText.Assistant.trip.fetchMore)}
        state={isFetchingTripPatterns ? 'loading' : undefined}
      />
    </>
  );
}

type TripPatternProps = {
  tripPattern: TripPattern;
  delay: number;
};

function TripPattern({ tripPattern, delay }: TripPatternProps) {
  const { t, language } = useTranslation();

  const duration = secondsToDuration(tripPattern.duration, language);
  const fromPlace = tripPattern.legs[0]?.fromPlace.name ?? '';

  return (
    <motion.a
      href="/assistant" // TODO: Use correct href.
      className={style.tripPattern}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{
        delay, // staggerChildren on parent only works first render
      }}
    >
      <header className={style.header}>
        <Typo.span textType="body__secondary--bold">
          {t(PageText.Assistant.trip.tripPattern.busFrom)} {fromPlace}
        </Typo.span>
        <Typo.span
          textType="body__secondary"
          className={style.header__duration}
        >
          {duration}
        </Typo.span>
      </header>

      <div className={style.legs}>
        {tripPattern.legs.map((leg, i) => (
          <div
            key={`leg-${leg.expectedStartTime}-${i}`}
            className={style.legs__leg}
          >
            <div className={style.legs__leg__icon}>
              {leg.mode ? (
                <TransportIconWithLabel
                  mode={{ mode: leg.mode }}
                  label={leg.line?.publicCode}
                />
              ) : (
                <div className={style.legs__leg__walkIcon}>
                  <MonoIcon icon="transportation/Walk" />
                </div>
              )}
            </div>

            <Typo.span textType="body__tertiary">
              {formatLocaleTime(leg.aimedStartTime, language)}
            </Typo.span>
          </div>
        ))}

        <div className={style.legs__lastLeg}>
          <div className={style.legs__lastLeg__line}></div>
          <div className={style.legs__lastLeg__destination}>
            <div className={style.legs__lastLeg__destination__icon}>
              <MonoIcon icon="places/Destination" />
            </div>
            <Typo.span textType="body__tertiary">
              {formatLocaleTime(tripPattern.expectedEndTime, language)}
            </Typo.span>
          </div>
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
