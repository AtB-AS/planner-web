import {
  formatLocaleTime,
  formatToSimpleDate,
  formatToWeekday,
  isInPast,
  parseIfNeeded,
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
  filterOutDuplicates,
  getCursorByDepartureMode,
} from '@atb/page-modules/assistant';
import { useEffect, useState } from 'react';
import { getInitialTransportModeFilter } from '@atb/components/transport-mode-filter/utils';
import { Button } from '@atb/components/button';
import { NonTransitTrip } from '../non-transit-pill';
import { isSameDay } from 'date-fns';
import { capitalize } from 'lodash';
import { TripPatternHeader } from '@atb/page-modules/assistant/trip/trip-pattern-header';
import { tripSummary } from '@atb/page-modules/assistant/trip/utils';
import EmptySearchResults from '@atb/components/empty-search-results';

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

  if (tripPatterns.length === 0) {
    return (
      <EmptySearchResults
        title={t(
          PageText.Assistant.trip.emptySearchResults.emptySearchResultsTitle,
        )}
        details={
          initialTransportModesFilter
            ? t(
                PageText.Assistant.trip.emptySearchResults
                  .emptySearchResultsDetailsWithFilters,
              )
            : t(
                PageText.Assistant.trip.emptySearchResults
                  .emptySearchResultsDetails,
              )
        }
      />
    );
  }

  return (
    <>
      <div className={style.tripResults}>
        {nonTransits.length > 0 && (
          <div className={style.nonTransitResult}>
            {Object.entries(nonTransitTrips).map(([legType, nonTransit]) => (
              <NonTransitTrip key={legType} nonTransit={nonTransit} />
            ))}
          </div>
        )}

        {tripPatterns.map((tripPattern, i) => (
          <div key={`tripPattern-${tripPattern.expectedStartTime}-${i}`}>
            <DayLabel
              departureTime={tripPattern.expectedStartTime}
              previousDepartureTime={tripPatterns[i - 1]?.expectedStartTime}
            />
            <TripPattern
              tripPattern={tripPattern}
              delay={tripPattern.transitionDelay}
              index={i}
            />
          </div>
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
      departureMode,
      undefined,
      getInitialTransportModeFilter(filter),
      cursor || undefined,
    );
    const trip = await nextTripPatterns(tripQuery);
    const newTripPatternsWithTransitionDelay = tripPatternsWithTransitionDelay(
      filterOutDuplicates(trip.tripPatterns, tripPatterns),
    );

    setTripPatterns((prevTripPatterns) => [
      ...prevTripPatterns,
      ...newTripPatternsWithTransitionDelay,
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
  index: number;
};

function TripPattern({ tripPattern, delay, index }: TripPatternProps) {
  const { t, language } = useTranslation();

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
      aria-label={tripSummary(
        tripPattern,
        t,
        language,
        isInPast(tripPattern.legs[0].expectedStartTime),
        index + 1,
      )}
    >
      <TripPatternHeader tripPattern={tripPattern} />

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
  const { language } = useTranslation();
  const isFirst = !previousDepartureTime;
  const departureDate = parseIfNeeded(departureTime);
  const prevDate = !previousDepartureTime
    ? new Date()
    : parseIfNeeded(previousDepartureTime);

  const weekDay = capitalize(formatToWeekday(departureDate, language, 'eeee'));
  const simpleDate = formatToSimpleDate(departureDate, language);

  if (isFirst || !isSameDay(prevDate, departureDate)) {
    return (
      <Typo.p textType="heading--medium" className={style.dayLabel}>
        {`${weekDay} ${simpleDate}`}
      </Typo.p>
    );
  }
  return null;
}

function tripPatternsWithTransitionDelay(tripPatterns: TripPattern[]) {
  return tripPatterns.map((tripPattern, i) => ({
    ...tripPattern,
    transitionDelay: i * 0.1,
  }));
}
