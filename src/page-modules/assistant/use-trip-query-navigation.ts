import { useRouter } from 'next/router';
import { useLayoutEffect, useRef, useState } from 'react';
import { FromToTripQuery } from './types';
import { createTripQuery } from './utils';

/**
 * Updates the trip search URL without losing changes that are still loading.
 *
 * Each change builds on the latest requested search instead of the `tripQuery`
 * prop, which only updates once the server responds. Otherwise, picking "from"
 * and then "to" on a slow connection could end up with only "to" selected.
 *
 * @param tripQuery - The trip query the page currently shows
 * @returns `navigate` to change the search, `getLatestTripQuery` to read it
 * including pending changes, and `isPerformingSearchNavigation`.
 */
export function useTripQueryNavigation(tripQuery: FromToTripQuery) {
  const router = useRouter();
  const [isPerformingSearchNavigation, setIsPerformingSearchNavigation] =
    useState(false);

  const tripQueryPropRef = useRef(tripQuery);
  const latestTripQueryRef = useRef(tripQuery);
  const navigationIdRef = useRef(0);
  const isNavigatingRef = useRef(false);

  // A layout effect runs before Next.js resolves a navigation, so the prop ref
  // is up to date when the navigation's `finally` block below reads it.
  useLayoutEffect(() => {
    tripQueryPropRef.current = tripQuery;
    // Sync with navigations not started here, e.g. back/forward.
    if (!isNavigatingRef.current) {
      latestTripQueryRef.current = tripQuery;
    }
  }, [tripQuery]);

  const navigate = async (
    override: Partial<FromToTripQuery>,
    replace = false,
  ) => {
    const nextTripQuery: FromToTripQuery = {
      ...latestTripQueryRef.current,
      ...override,
    };
    latestTripQueryRef.current = nextTripQuery;
    const query = createTripQuery(nextTripQuery);

    const navigationId = ++navigationIdRef.current;
    isNavigatingRef.current = true;

    // Only show loading if we have both from and to selected.
    if (nextTripQuery.from && nextTripQuery.to) {
      setIsPerformingSearchNavigation(true);
    }

    try {
      if (replace) {
        await router.replace({ query });
      } else {
        await router.push({ query });
      }
    } finally {
      // An older, cancelled navigation must not reset the state of a newer one.
      if (navigationId === navigationIdRef.current) {
        isNavigatingRef.current = false;
        // Use the trip query the server resolved, or the current one if the
        // navigation failed.
        latestTripQueryRef.current = tripQueryPropRef.current;
        setIsPerformingSearchNavigation(false);
      }
    }
  };

  const getLatestTripQuery = () => latestTripQueryRef.current;

  return { navigate, getLatestTripQuery, isPerformingSearchNavigation };
}
