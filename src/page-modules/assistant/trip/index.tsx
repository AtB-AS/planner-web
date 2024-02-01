import {
  formatToSimpleDate,
  formatToWeekday,
  parseIfNeeded,
} from '@atb/utils/date';
import style from './trip.module.css';
import { PageText, useTranslation } from '@atb/translations';
import { Typo } from '@atb/components/typography';
import { useNonTransitTrip, useTripPatterns } from '../client';
import { FromToTripQuery, TripData } from '../types';
import { Button } from '@atb/components/button';
import { NonTransitTrip } from '../non-transit-pill';
import { isSameDay } from 'date-fns';
import { capitalize } from 'lodash';
import EmptySearchResults from '@atb/components/empty-message';
import TripPattern from './trip-pattern';
import EmptySearch from '@atb/components/loading-empty-results';
import { LoadingIcon } from '@atb/components/loading';

export type TripProps = {
  tripQuery: FromToTripQuery;
  fallback?: TripData;
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

  if ((!trips || trips?.length === 0) && tripQuery.from && tripQuery.to) {
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

  const getPreviousDepartureTime = (
    tripIndex: number,
    patternIndex: number,
  ): string | undefined => {
    if (!trips) return undefined;
    if (tripIndex === 0 && patternIndex === 0) return undefined;
    if (patternIndex === 0) {
      return trips[tripIndex - 1]?.tripPatterns[
        trips[tripIndex - 1]?.tripPatterns.length - 1
      ]?.expectedStartTime;
    }
    return trips[tripIndex].tripPatterns[patternIndex - 1]?.expectedStartTime;
  };

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

        {trips?.map((trip, tripIndex) =>
          trip.tripPatterns.map((tripPattern, i) => (
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
              />
            </div>
          )),
        )}
      </div>

      {isLoadingMore ? (
        <div className={style.fetchButton}>
          <LoadingIcon />
        </div>
      ) : (
        <Button
          className={style.fetchButton}
          onClick={() => loadMore()}
          title={t(PageText.Assistant.trip.fetchMore)}
          state={isLoadingMore ? 'loading' : undefined}
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
