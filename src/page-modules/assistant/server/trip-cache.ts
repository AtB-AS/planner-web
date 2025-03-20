import TTLCache from '@isaacs/ttlcache';
import { FromToTripQuery, TripsType } from '../types';

let tripCache: TTLCache<string, TripsType> | null = null;

function getTripCacheInstance(): TTLCache<string, TripsType> {
  if (!tripCache) {
    tripCache = new TTLCache({ ttl: 20000 });
  }

  return tripCache;
}

export function getAssistantTripIfCached(
  query: FromToTripQuery,
): TripsType | undefined {
  const cacheKey = createCacheKey(query);
  if (tripCache?.has(cacheKey)) {
    return tripCache.get(cacheKey);
  }
}

export function addAssistantTripToCache(
  query: FromToTripQuery,
  tripData: TripsType,
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
