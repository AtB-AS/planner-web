import {
  NonTransitTripData,
  TripQuery,
  FromToTripQuery,
  TripsType,
} from '../../types';
import { swrFetcher } from '@atb/modules/api-browser';
import useSWRInfinite from 'swr/infinite';
import { createTripQuery, tripQueryToQueryString } from '../../utils';
import { useEffect, useRef, useState } from 'react';
import { fromLocalTimeToCET } from '@atb/utils/date';
import { LineData } from '../../server/journey-planner/validators';
import useSWRImmutable from 'swr/immutable';

const MAX_NUMBER_OF_INITIAL_SEARCH_ATTEMPTS = 5;
const MAX_LOAD_MORE_ATTEMPTS = 3;
const INITIAL_NUMBER_OF_WANTED_TRIP_PATTERNS = 8;

export type TripApiReturnType = TripsType['trip'];
export type NonTransitTripApiReturnType = NonTransitTripData;
export type LinesApiReturnType = LineData;

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

export function useTripPatterns(
  tripQuery: FromToTripQuery,
  fallback?: TripApiReturnType,
) {
  const query = createTripQuery(
    tripQuery.searchTime.mode === 'now'
      ? tripQuery
      : {
          ...tripQuery,
          searchTime: {
            ...tripQuery.searchTime,
            dateTime: fromLocalTimeToCET(tripQuery.searchTime.dateTime),
          },
        },
  );
  const { data, error, isLoading, isValidating, size, setSize } =
    useSWRInfinite<TripApiReturnType>(
      createKeyGetterOfQuery(query),
      swrFetcher,
      {
        fallbackData: fallback ? [fallback] : undefined,
        persistSize: false,
        revalidateFirstPage: false,
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
      },
    );

  const numberOfTripPatterns = getTripPatternCount(data);

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

  const { loadMore, isLoadingMore } = useLoadMore(
    numberOfTripPatterns,
    size,
    setSize,
    isValidating,
  );

  const isLoadingFirstTrip =
    isLoading ||
    (isValidating && !data?.some((page) => page.tripPatterns.length > 0));

  return {
    trips: data,
    isLoadingFirstTrip,
    isError: Boolean(error),
    loadMore,
    isLoadingMore,
    size,
    setSize,
  };
  9;
}

function getTripPatternCount(data: TripApiReturnType[] | undefined) {
  return data?.reduce((acc, curr) => acc + curr.tripPatterns.length, 0) ?? 0;
}

export function useNonTransitTrip(tripQuery: FromToTripQuery) {
  const query = createTripQuery(tripQuery);
  const queryString = tripQueryToQueryString(query);
  const { data, error, isLoading } =
    useSWRImmutable<NonTransitTripApiReturnType>(
      `/api/assistant/non-transit-trip?${queryString}`,
      swrFetcher,
    );

  return {
    nonTransitTrips: data,
    isLoading,
    isError: Boolean(error),
  };
}

/**
 * A hook that manages loading more trip patterns with automatic retry
 * capabilities.
 *
 * This hook handles the logic for incrementally loading more trip patterns by
 * increasing the 'size' parameter. It includes built-in retry logic that will
 * automatically attempt to load more patterns up to a maximum number of times
 * when no new patterns are found.
 *
 * @param numberOfTripPatterns - The current number of trip patterns loaded
 * @param size - The current page size 
 * @param setSize - Function to update the page size
 * @param isValidating - Boolean indicating if data is currently being fetched
 *
 * @returns An object containing:
 *   - loadMore: Function to trigger loading more trip patterns
 *   - isLoadingMore: Boolean state indicating if more patterns are currently
 *     being loaded
 */
function useLoadMore(
  numberOfTripPatterns: number,
  size: number,
  setSize: (size: number) => void,
  isValidating: boolean,
) {
  // Track previous values with refs to detect changes
  const previousSize = useRef(size);
  const previousNumberOfTripPatterns = useRef(numberOfTripPatterns);
  const hasBeenClicked = useRef(false);
  const loadMoreAttempts = useRef(0);

  // State to track loading status (this is what gets returned to the component)
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    // If no load more has been clicked, just update references
    if (!hasBeenClicked.current) {
      previousNumberOfTripPatterns.current = numberOfTripPatterns;
      previousSize.current = size;
      return;
    }

    // Don't continue if data is still being fetched
    if (isValidating) {
      return;
    }

    // Case 1: New trip patterns found - success scenario
    if (numberOfTripPatterns > previousNumberOfTripPatterns.current) {
      // Update references and reset state
      previousNumberOfTripPatterns.current = numberOfTripPatterns;
      previousSize.current = size;
      loadMoreAttempts.current = 0;
      hasBeenClicked.current = false;
      setIsLoadingMore(false);
      return;
    }

    // Always update trip patterns reference
    previousNumberOfTripPatterns.current = numberOfTripPatterns;

    // Case 2: Size increased but no new patterns - potential retry scenario
    if (size > previousSize.current) {
      previousSize.current = size;

      // If we haven't received new data but are under the attempt limit, try again
      if (loadMoreAttempts.current < MAX_LOAD_MORE_ATTEMPTS) {
        loadMoreAttempts.current++;
        setSize(size + 1);
      } else {
        // We've reached the maximum attempts, stop loading more
        setIsLoadingMore(false);
      }
      return;
    }
  }, [numberOfTripPatterns, size, setSize, isValidating, setIsLoadingMore]);

  const loadMore = () => {
    hasBeenClicked.current = true;
    loadMoreAttempts.current = 0;
    setIsLoadingMore(true);
    setSize(size + 1);
  };

  return {
    loadMore,
    isLoadingMore,
  };
}
