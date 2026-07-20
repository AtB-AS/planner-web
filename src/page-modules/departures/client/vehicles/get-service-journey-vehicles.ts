import { swrFetcher } from '@atb/modules/api-browser';
import qs from 'query-string';
import useSWR from 'swr';
import type { VehicleWithPosition } from './types';

// Matches the mobile app's refetch interval for the trip-results vehicle
// snapshot.
const POLL_INTERVAL_MS = 20000;

/**
 * Polls the BFF for current vehicle positions for the given service journeys.
 * Used to decide whether to show the "follow vehicle" button on trip results;
 * the live map itself uses the WebSocket subscription.
 *
 * SWR keeps the last successful data on a failed revalidation (so the button
 * doesn't flicker away on a transient error) and pauses polling while the tab
 * is hidden.
 */
export function useServiceJourneyVehicles(
  serviceJourneyIds: string[],
  enabled: boolean,
): VehicleWithPosition[] {
  // A `null` key disables fetching; otherwise the URL doubles as the cache key,
  // so it stays stable as long as the ids do.
  const key =
    enabled && serviceJourneyIds.length > 0
      ? `/api/departures/vehicles?${qs.stringify({ serviceJourneyIds })}`
      : null;

  const { data } = useSWR<VehicleWithPosition[]>(key, swrFetcher, {
    refreshInterval: POLL_INTERVAL_MS,
  });

  return data ?? [];
}
