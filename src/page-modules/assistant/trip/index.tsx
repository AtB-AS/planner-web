import {
  daysBetween,
  formatLocaleTime,
  formatToSimpleDate,
  parseIfNeeded,
  secondsToDuration,
} from '@atb/utils/date';
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
import {
  DepartureMode,
  NonTransitTripData,
  createTripQuery,
} from '@atb/page-modules/assistant';
import { useEffect, useState } from 'react';
import { getInitialTransportModeFilter } from '@atb/components/transport-mode-filter/utils';
import { Button } from '@atb/components/button';
import { NonTransitTrip } from '../non-transit-pill';
import { isSameDay } from 'date-fns';

export type TripProps = {
  initialFromFeature: GeocoderFeature;
  initialToFeature: GeocoderFeature;
  initialTransportModesFilter: TransportModeFilterOption[] | null;
  trip: TripData;
  departureMode: DepartureMode;
  nonTransitTrips: NonTransitTripData;
};

export default function Trip({
  initialFromFeature,
  initialToFeature,
  initialTransportModesFilter,
  trip,
  departureMode,
  nonTransitTrips,
}: TripProps) {
  const { t } = useTranslation();
  const { tripPatterns, fetchNextTripPatterns, isFetchingTripPatterns } =
    useTripPatterns(trip, departureMode);

  const nonTransits = Object.entries(nonTransitTrips);
  return (
    <>
      <div className={style.tripResults}>
        {nonTransits.length > 0 && (
          <div className={style.nonTransitResult}>
            {Object.entries(nonTransitTrips).map(([legType, trip]) => (
              <NonTransitTrip
                key={legType}
                tripPattern={trip.tripPatterns[0]}
                nonTransitType={legType as keyof NonTransitTripData}
              />
            ))}
          </div>
        )}
        {tripPatterns.map((tripPattern, i) => (
          <>
            <DayLabel
              departureTime={tripPattern.expectedStartTime}
              previousDepartureTime={tripPatterns[i - 1]?.expectedStartTime}
            />
            <TripPattern
              key={`tripPattern-${tripPattern.expectedStartTime}-${i}`}
              tripPattern={tripPattern}
              delay={tripPattern.transitionDelay}
            />
          </>
        ))}
      </div>

      <Button
        className={style.fetchButton}
        onClick={() =>
          fetchNextTripPatterns(
            initialFromFeature,
            initialToFeature,
            initialTransportModesFilter || undefined,
          )
        }
        title={t(PageText.Assistant.trip.fetchMore)}
        state={isFetchingTripPatterns ? 'loading' : undefined}
      />
    </>
  );
}

function useTripPatterns(initialTrip: TripData, departureMode: DepartureMode) {
  const [tripPatterns, setTripPatterns] = useState(
    tripPatternsWithTransitionDelay(initialTrip.tripPatterns),
  );
  const [cursor, setCursor] = useState(
    getCursorByDepartureMode(initialTrip, departureMode),
  );
  const [isFetchingTripPatterns, setIsFetchingTripPatterns] = useState(false);

  useEffect(() => {
    setTripPatterns(tripPatternsWithTransitionDelay(initialTrip.tripPatterns));
    setCursor(getCursorByDepartureMode(initialTrip, departureMode));
  }, [initialTrip, departureMode]);

  const fetchNextTripPatterns = async (
    from: GeocoderFeature,
    to: GeocoderFeature,
    filter?: TransportModeFilterOption[],
  ) => {
    setIsFetchingTripPatterns(true);
    const tripQuery = createTripQuery(
      from,
      to,
      getInitialTransportModeFilter(filter),
    );
    const trip = await nextTripPatterns(tripQuery, cursor || ''); // @TODO: handle null cursors

    setTripPatterns((prevTripPatterns) => [
      ...prevTripPatterns,
      ...tripPatternsWithTransitionDelay(trip.tripPatterns),
    ]);

    setCursor(getCursorByDepartureMode(trip, departureMode));
    setIsFetchingTripPatterns(false);
  };

  return {
    tripPatterns,
    isFetchingTripPatterns,
    fetchNextTripPatterns,
  };
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

type DayLabelProps = {
  departureTime: string;
  previousDepartureTime?: string;
};
function DayLabel({ departureTime, previousDepartureTime }: DayLabelProps) {
  const { t, language } = useTranslation();
  const isFirst = !previousDepartureTime;
  const departureDate = parseIfNeeded(departureTime);
  const prevDate = !previousDepartureTime
    ? new Date()
    : parseIfNeeded(previousDepartureTime);

  const dateString = formatToSimpleDate(departureDate, language);
  const numberOfDays = daysBetween(new Date(), departureDate);

  let dateLabel = dateString;

  if (numberOfDays === 0) {
    dateLabel = t(PageText.Assistant.trip.dayLabel.today());
  }
  if (numberOfDays == 1) {
    dateLabel = t(PageText.Assistant.trip.dayLabel.tomorrow(dateString));
  }
  if (numberOfDays == 2) {
    dateLabel = t(
      PageText.Assistant.trip.dayLabel.dayAfterTomorrow(dateString),
    );
  }

  if (isFirst || !isSameDay(prevDate, departureDate)) {
    return <p className={style.dayLabel}>{dateLabel}</p>;
  }
  return null;
}

function tripPatternsWithTransitionDelay(tripPatterns: TripPattern[]) {
  return tripPatterns.map((tripPattern, i) => ({
    ...tripPattern,
    transitionDelay: i * 0.1,
  }));
}

function getCursorByDepartureMode(
  trip: TripData,
  departureMode: DepartureMode,
) {
  if (departureMode === DepartureMode.ArriveBy) {
    return trip.previousPageCursor;
  } else {
    return trip.nextPageCursor;
  }
}
