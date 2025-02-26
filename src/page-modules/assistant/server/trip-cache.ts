import TTLCache from '@isaacs/ttlcache';
import { FromToTripQuery, TripData } from '../types';
import { TripsWithDetailsData } from '@atb/page-modules/assistant/server/journey-planner/validators.ts';

let tripCache: TTLCache<string, TripsWithDetailsData> | null = null;

function getTripCacheInstance(): TTLCache<string, TripsWithDetailsData> {
  if (!tripCache) {
    tripCache = new TTLCache({ ttl: 20000 });
  }

  return tripCache;
}

export function getAssistantTripIfCached(
  query: FromToTripQuery,
): TripsWithDetailsData | undefined {
  const cacheKey = createCacheKey(query);
  if (tripCache?.has(cacheKey)) {
    return tripCache.get(cacheKey);
  }
}

export function addAssistantTripToCache(
  query: FromToTripQuery,
  tripData: TripsWithDetailsData,
) {
  getTripCacheInstance().set(createCacheKey(query), tripData);
}

function createCacheKey(valuesToCreateCacheKey: FromToTripQuery) {
  const keys = Object.keys(valuesToCreateCacheKey).sort();
  const values = keys.map(
    (key) => valuesToCreateCacheKey[key as keyof FromToTripQuery],
  );
  const cacheKey = JSON.stringify(values);

  return 'assistant-trip-' + Buffer.from(cacheKey).toString('base64');
}
