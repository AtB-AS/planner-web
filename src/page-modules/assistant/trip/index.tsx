import {
  formatToSimpleDate,
  formatToWeekday,
  parseIfNeeded,
} from '@atb/utils/date';
import {
  TripData,
  type TripPattern as TripPatternType,
} from '../server/journey-planner/validators';
import style from './trip.module.css';
import { PageText, useTranslation } from '@atb/translations';
import { Typo } from '@atb/components/typography';
import { GeocoderFeature } from '@atb/page-modules/departures';
import { TransportModeFilterOption } from '@atb/components/transport-mode-filter/types';
import { nextTripPatterns } from '../client';
import { DepartureMode, NonTransitTripData } from '../types';
import {
  createTripQuery,
  filterOutDuplicates,
  getCursorByDepartureMode,
} from '../utils';
import { useEffect, useState } from 'react';
import { getInitialTransportModeFilter } from '@atb/components/transport-mode-filter/utils';
import { Button } from '@atb/components/button';
import { NonTransitTrip } from '../non-transit-pill';
import { isSameDay } from 'date-fns';
import { capitalize } from 'lodash';
import EmptySearchResults from '@atb/components/empty-search-results';
import TripPattern from './trip-pattern';

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
          <div
            key={`tripPattern-${tripPattern.expectedStartTime}-${i}`}
            className={style.tripPatternWrapper}
          >
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

function tripPatternsWithTransitionDelay(tripPatterns: TripPatternType[]) {
  return tripPatterns.map((tripPattern, i) => ({
    ...tripPattern,
    transitionDelay: i * 0.1,
  }));
}