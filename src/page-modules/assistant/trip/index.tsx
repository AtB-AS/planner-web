import {
  daysBetween,
  formatToSimpleDate,
  parseIfNeeded,
} from '@atb/utils/date';
import style from './trip.module.css';
import { PageText, useTranslation } from '@atb/translations';
import { Typo } from '@atb/components/typography';
import { useNonTransitTrip, useTripPatterns } from '../client';
import { ExtendedTripPatternType, FromToTripQuery, TripsType } from '../types';
import { Button } from '@atb/components/button';
import { NonTransitTrip } from '../non-transit-pill';
import { isSameDay } from 'date-fns';
import { capitalize } from 'lodash';
import EmptySearchResults from '@atb/components/empty-message';
import TripPattern from './trip-pattern';
import EmptySearch from '@atb/components/loading-empty-results';
import { LoadingIcon } from '@atb/components/loading';
import ScreenReaderOnly from '@atb/components/screen-reader-only';
import {
  GlobalMessageContextEnum,
  GlobalMessages,
} from '@atb/modules/global-messages';
import dictionary from '@atb/translations/dictionary.ts';

export type TripProps = {
  tripQuery: FromToTripQuery;
  fallback?: TripsType['trip'];
};

export default function Trip({ tripQuery, fallback }: TripProps) {
  const { t } = useTranslation();
  const { trips, isLoadingFirstTrip, loadMore, isLoadingMore } =
    useTripPatterns(tripQuery, fallback);
  const { nonTransitTrips } = useNonTransitTrip(tripQuery);

  const nonTransits = nonTransitTrips ? Object.entries(nonTransitTrips) : [];

  if (isLoadingFirstTrip) {
    return <EmptySearch isSearching={isLoadingFirstTrip} type="trip" />;
  }
  if (
    (!trips ||
      trips?.length === 0 ||
      trips.every((trip) => trip.tripPatterns.length === 0)) &&
    tripQuery.from &&
    tripQuery.to
  ) {
    return (
      <EmptySearchResults
        title={t(
          PageText.Assistant.trip.emptySearchResults.emptySearchResultsTitle,
        )}
        details={
          tripQuery.transportModeFilter || tripQuery.lineFilter
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

  const getPreviousDepartureTime = (
    tripIndex: number,
    patternIndex: number,
  ): string | undefined => {
    if (!trips) return undefined;
    if (tripIndex === 0 && patternIndex === 0) return undefined;

    if (patternIndex === 0) {
      // Iterate backwards to find the first trip with a non-empty tripPatterns list
      for (let i = tripIndex - 1; i >= 0; i--) {
        const previousTrip = trips[i];
        if (previousTrip.tripPatterns.length > 0) {
          return previousTrip.tripPatterns[previousTrip.tripPatterns.length - 1]
            ?.expectedStartTime;
        }
      }
      // If no previous trip with non-empty tripPatterns is found
      return;
    } else {
      // Return the expectedStartTime of the previous pattern in the current trip
      return trips[tripIndex].tripPatterns[patternIndex - 1]?.expectedStartTime;
    }
  };

  return (
    <>
      <ScreenReaderOnly
        text={t(PageText.Assistant.trip.resultsFound)}
        role="status"
      />

      <GlobalMessages context={GlobalMessageContextEnum.plannerWebTrip} />
      <div className={style.tripResults}>
        {nonTransitTrips && nonTransits.length > 0 && (
          <div className={style.nonTransitResult}>
            {Object.entries(nonTransitTrips).map(([legType, nonTransit]) => (
              <NonTransitTrip key={legType} nonTransit={nonTransit} />
            ))}
          </div>
        )}

        {trips?.map((trip, tripIndex) =>
          trip.tripPatterns.map((tripPattern: ExtendedTripPatternType, i) => (
            <div
              key={`tripPattern-${tripPattern.expectedStartTime}-${i}`}
              className={style.tripPatternWrapper}
            >
              <DayLabel
                departureTime={tripPattern.expectedStartTime}
                previousDepartureTime={getPreviousDepartureTime(tripIndex, i)}
              />
              <TripPattern
                tripPattern={tripPattern}
                delay={i * 0.1}
                index={i}
                testId={`tripPattern-${tripIndex}-${i}`}
              />
            </div>
          )),
        )}
      </div>

      {tripQuery.via ? (
        <Typo.p
          textType="body__primary--bold"
          className={style.disabledFetchTextContainer}
        >
          {t(PageText.Assistant.trip.disabledFetchMore)}
        </Typo.p>
      ) : isLoadingMore ? (
        <div className={style.fetchButton}>
          <LoadingIcon />
        </div>
      ) : (
        <Button
          className={style.fetchButton}
          onClick={() => loadMore()}
          mode="secondary"
          radiusSize="circular"
          title={t(PageText.Assistant.trip.fetchMore)}
          state={isLoadingMore ? 'loading' : undefined}
          testID="loadMoreButton"
        />
      )}
    </>
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
  const daysDifference = daysBetween(new Date(), departureDate);

  const simpleDate = formatToSimpleDate(departureDate, language);

  let dayLabel = simpleDate;
  if (daysDifference === 0) {
    dayLabel = capitalize(t(dictionary.date.relativeDayNames(daysDifference)));
  } else if (daysDifference < 3) {
    dayLabel = `${capitalize(t(dictionary.date.relativeDayNames(daysDifference)))} - ${simpleDate}`;
  }

  if (isFirst || !isSameDay(prevDate, departureDate)) {
    return (
      <Typo.p textType="heading--medium" className={style.dayLabel}>
        {dayLabel}
      </Typo.p>
    );
  }
  return null;
}
