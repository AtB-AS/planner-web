import useSWR from 'swr';
import { NonTransitTripData, TripQuery, TripData } from '../../types';
import { swrFetcher } from '@atb/modules/api-browser';
import useSWRInfinite from 'swr/infinite';

export type TripApiReturnType = TripData;
export type NonTransitTripApiReturnType = NonTransitTripData;

const getKey =
  (query: TripQuery) =>
  (pageIndex: number, previousPageData: TripApiReturnType) => {
    const cursorKey =
      query.searchMode === 'arriveBy' ? 'previousPageCursor' : 'nextPageCursor';

    if (previousPageData && !previousPageData[cursorKey]) return null;

    const queryString = tripQueryToQueryString(query);

    // first page, we don't have `previousPageData`
    if (pageIndex === 0) return `/api/assistant/trip?${queryString}`;

    return `/api/assistant/trip?cursor=${previousPageData[cursorKey]}&${queryString}`;
  };

export function useTripPatterns(query: TripQuery) {
  const { data, error, isLoading, isValidating, size, setSize } =
    useSWRInfinite<TripApiReturnType>(getKey(query), swrFetcher, {});

  const isLoadingInitialData = !data && isLoading;
  const isLoadingMore = isValidating && size > 1;
  return {
    trips: data,
    isLoading: isLoadingInitialData,
    isError: error,
    loadMore: () => setSize(size + 1),
    isLoadingMore,
  };
}

export function useNonTransitTrip(query: TripQuery) {
  const queryString = tripQueryToQueryString(query);
  const { data, error, isLoading } = useSWR<NonTransitTripApiReturnType>(
    `/api/assistant/non-transit-trip?${queryString}`,
    swrFetcher,
    {},
  );

  return {
    nonTransitTrips: data,
    isLoading,
    isError: error,
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
