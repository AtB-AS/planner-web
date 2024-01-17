import useSWR from 'swr';
import {
  NonTransitTripData,
  TripQuery,
  TripData,
  FromToTripQuery,
} from '../../types';
import { swrFetcher } from '@atb/modules/api-browser';
import useSWRInfinite from 'swr/infinite';
import { createTripQuery } from '../../utils';
import { getInitialTransportModeFilter } from '@atb/modules/transport-mode';
import { useEffect, useState } from 'react';

const MAX_NUMBER_OF_INITIAL_SEARCH_ATTEMPTS = 3;
const INITIAL_NUMBER_OF_WANTED_TRIP_PATTERNS = 6;

export type TripApiReturnType = TripData;
export type NonTransitTripApiReturnType = NonTransitTripData;

function createKeyGetterOfQuery(query: TripQuery) {
  return (pageIndex: number, previousPageData: TripApiReturnType) => {
    const cursorKey =
      query.searchMode === 'arriveBy' ? 'previousPageCursor' : 'nextPageCursor';

    if (previousPageData && !previousPageData[cursorKey]) return null;

    const queryString = tripQueryToQueryString(query);

    // first page, we don't have `previousPageData`
    if (pageIndex === 0) return `/api/assistant/trip?${queryString}`;

    return `/api/assistant/trip?cursor=${previousPageData[cursorKey]}&${queryString}`;
  };
}

export function useTripPatterns(tripQuery: FromToTripQuery) {
  const [numberOfTripPatterns, setNumberOfTripPatterns] = useState(0);
  const query = createTripQuery(
    tripQuery,
    getInitialTransportModeFilter(tripQuery.transportModeFilter),
  );
  const { data, error, isLoading, isValidating, size, setSize } =
    useSWRInfinite<TripApiReturnType>(
      createKeyGetterOfQuery(query),
      swrFetcher,
      {},
    );

  useEffect(() => {
    if (data) {
      setNumberOfTripPatterns(
        data.reduce((acc, curr) => acc + curr.tripPatterns.length, 0),
      );
    }
  }, [data]);

  useEffect(() => {
    if (isLoading || isValidating) {
      return;
    }
    if (size >= MAX_NUMBER_OF_INITIAL_SEARCH_ATTEMPTS) {
      return;
    }
    if (numberOfTripPatterns >= INITIAL_NUMBER_OF_WANTED_TRIP_PATTERNS) {
      return;
    }
    setSize(size + 1);
  }, [numberOfTripPatterns, size, setSize, isLoading, isValidating]);

  const isLoadingFirstTrip = !data && isLoading;
  const isLoadingMore = isValidating && size > 1;

  return {
    trips: data,
    isLoadingFirstTrip,
    isError: Boolean(error),
    loadMore: () => setSize(size + 1),
    isLoadingMore,
    size,
    setSize,
  };
}

export function useNonTransitTrip(tripQuery: FromToTripQuery) {
  const query = createTripQuery(
    tripQuery,
    getInitialTransportModeFilter(tripQuery.transportModeFilter),
  );
  const queryString = tripQueryToQueryString(query);
  const { data, error, isLoading } = useSWR<NonTransitTripApiReturnType>(
    `/api/assistant/non-transit-trip?${queryString}`,
    swrFetcher,
    {},
  );

  return {
    nonTransitTrips: data,
    isLoading,
    isError: Boolean(error),
  };
}

function tripQueryToQueryString(input: TripQuery): string {
  return Object.keys(input)
    .map(
      (key) =>
        encodeURIComponent(key) +
        '=' +
        encodeURIComponent(String(input[key as keyof TripQuery])),
    )
    .join('&');
}
