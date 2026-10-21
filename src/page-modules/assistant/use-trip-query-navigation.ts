import { useRouter } from 'next/router';
import { useLayoutEffect, useRef, useState } from 'react';
import { FromToTripQuery } from './types';
import { createTripQuery } from './utils';

/**
 * Updates the trip search URL without losing changes the user just made.
 *
 * This was made after users experiencing being unable to trigger search
 * even though the form showed the correct values.
 *
 * @details Every change to the search (from, to, filters, etc.) updates the URL, and
 * the page waits for the server before showing the new values. On a slow
 * connection, the user can make a second change before the first one has
 * finished loading. If the second change was based on what the page currently
 * shows, the first change would be lost. For example, picking "from" and then
 * "to" quickly could end up with only "to" selected.
 *
 *
 * @param tripQuery - The trip query the page currently shows (from the server)
 * @returns An object containing:
 * - `navigate` - Applies a change to the search and updates the URL. Pass
 *   `replace` to replace the current history entry instead of adding a new one.
 * - `getLatestTripQuery` - Returns the search including all changes made so
 *   far, even ones that are still loading.
 * - `isPerformingSearchNavigation` - Whether a search with both from and to is
 *   loading.
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
