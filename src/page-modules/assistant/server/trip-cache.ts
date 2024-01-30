import TTLCache from '@isaacs/ttlcache';
import { FromToTripQuery, TripData } from '../types';
import { createTripQuery, tripQueryToQueryString } from '../utils';

let tripCache: TTLCache<string, TripData> | null = null;

function getTripCacheInstance(): TTLCache<string, TripData> {
  if (!tripCache) {
    tripCache = new TTLCache({ ttl: 120000 });
  }

  return tripCache;
}

export function getAssistantTripIfCached(
  query: FromToTripQuery,
): TripData | undefined {
  const queryString = tripQueryToQueryString(createTripQuery(query));
  if (tripCache?.has(`/api/assistant/trip?${queryString}`)) {
    return tripCache.get(`/api/assistant/trip?${queryString}`);
  }
}

export function addAssistantTripToCache(
  query: FromToTripQuery,
  tripData: TripData,
) {
  const queryString = tripQueryToQueryString(createTripQuery(query));
  getTripCacheInstance().set(`/api/assistant/trip?${queryString}`, tripData);
}
