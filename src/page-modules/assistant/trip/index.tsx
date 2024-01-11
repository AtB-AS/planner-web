import {
  formatToSimpleDate,
  formatToWeekday,
  parseIfNeeded,
} from '@atb/utils/date';
import { type TripPattern as TripPatternType } from '../server/journey-planner/validators';
import style from './trip.module.css';
import { PageText, useTranslation } from '@atb/translations';
import { Typo } from '@atb/components/typography';
import { getNonTransitTrip, getTripPatterns } from '../client';
import {
  FromToTripQuery,
  NonTransitTripData,
  TripPatternWithTransitionDelay,
} from '../types';
import {
  createTripQuery,
  filterOutDuplicates,
  getCursorBySearchMode,
} from '../utils';
import { useEffect, useState } from 'react';
import { Button } from '@atb/components/button';
import { NonTransitTrip } from '../non-transit-pill';
import { isSameDay } from 'date-fns';
import { capitalize } from 'lodash';
import EmptySearchResults from '@atb/components/empty-message';
import TripPattern from './trip-pattern';
import { getInitialTransportModeFilter } from '@atb/modules/transport-mode';
import EmptySearch from '@atb/components/loading-empty-results';

export type TripProps = {
  tripQuery: FromToTripQuery;
};

export default function Trip({ tripQuery }: TripProps) {
  const { t } = useTranslation();
  const {
    tripPatterns,
    fetchNextTripPatterns,
    isFetchingTripPatterns,
    isFetchingNextTripPatterns,
    nonTransitTrips,
  } = useTripPatterns(tripQuery);

  const nonTransits = nonTransitTrips ? Object.entries(nonTransitTrips) : [];

  if (isFetchingTripPatterns) {
    return (
      <EmptySearch
        isSearching={isFetchingTripPatterns}
        type="trip"
      ></EmptySearch>
    );
  }

  if (tripPatterns.length === 0 && tripQuery.from && tripQuery.to) {
    return (
      <EmptySearchResults
        title={t(
          PageText.Assistant.trip.emptySearchResults.emptySearchResultsTitle,
        )}
        details={
          tripQuery.transportModeFilter
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
        {nonTransitTrips && nonTransits.length > 0 && (
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
        onClick={() => fetchNextTripPatterns()}
        title={t(PageText.Assistant.trip.fetchMore)}
        state={isFetchingNextTripPatterns ? 'loading' : undefined}
      />
    </>
  );
}

function useTripPatterns(query: FromToTripQuery) {
  const [tripPatterns, setTripPatterns] = useState<
    (TripPatternType & { transitionDelay: number })[]
  >([]);
  const [nonTransitTrips, setNonTransitTrips] = useState<
    NonTransitTripData | undefined
  >(undefined);
  const [cursor, setCursor] = useState<string>();
  const [isFetchingTripPatterns, setIsFetchingTripPatterns] = useState(false);
  const [isFetchingNextTripPatterns, setIsFetchingNextTripPatterns] =
    useState(false);

  useEffect(() => {
    if (!query.from || !query.to) return;
    const fetch = async () => {
      setIsFetchingTripPatterns(true);
      const tripQuery = createTripQuery(
        query,
        getInitialTransportModeFilter(null),
      );
      const trip = await getTripPatterns(tripQuery);
      const newTripPatternsWithTransitionDelay =
        tripPatternsWithTransitionDelay(trip.tripPatterns);

      setTripPatterns(newTripPatternsWithTransitionDelay);
      setCursor(getCursorBySearchMode(trip, query.searchTime.mode));
      setIsFetchingTripPatterns(false);
    };
    fetch();
  }, [query]);

  useEffect(() => {
    if (!query.from || !query.to) return;
    const fetch = async () => {
      const tripQuery = createTripQuery(
        query,
        getInitialTransportModeFilter(null),
      );
      const nonTransit = await getNonTransitTrip(tripQuery);
      setNonTransitTrips(nonTransit);
    };
    fetch();
  }, [query]);

  const fetchNextTripPatterns = async () => {
    setIsFetchingNextTripPatterns(true);
    const tripQuery = createTripQuery(
      { ...query, cursor: cursor || null },
      getInitialTransportModeFilter(query.transportModeFilter),
    );
    const trip = await getTripPatterns(tripQuery);
    const filteredTripPatterns = tripPatterns
      ? filterOutDuplicates(trip.tripPatterns, tripPatterns)
      : trip.tripPatterns;
    const newTripPatternsWithTransitionDelay =
      tripPatternsWithTransitionDelay(filteredTripPatterns);

    setTripPatterns((prevTripPatterns) =>
      prevTripPatterns
        ? [...prevTripPatterns, ...newTripPatternsWithTransitionDelay]
        : newTripPatternsWithTransitionDelay,
    );

    setCursor(getCursorBySearchMode(trip, query.searchTime.mode));
    setIsFetchingNextTripPatterns(false);
  };

  return {
    tripPatterns,
    isFetchingTripPatterns,
    fetchNextTripPatterns,
    isFetchingNextTripPatterns,
    nonTransitTrips,
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

function tripPatternsWithTransitionDelay(
  tripPatterns: TripPatternType[],
): TripPatternWithTransitionDelay[] {
  return tripPatterns.map((tripPattern, i) => ({
    ...tripPattern,
    transitionDelay: i * 0.1,
  }));
}
