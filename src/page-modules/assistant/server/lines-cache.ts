import TTLCache from '@isaacs/ttlcache';
import { LineData } from './journey-planner/validators';
import { LineInput } from '../types';

let linesCache: TTLCache<string, LineData> | null = null;

function getLinesCacheInstance(): TTLCache<string, LineData> {
  if (!linesCache) {
    linesCache = new TTLCache({ ttl: 20000 });
  }

  return linesCache;
}

export function getLinesIfCached(query: LineInput): LineData | undefined {
  const cacheKey = createCacheKey(query);
  if (linesCache?.has(cacheKey)) {
    return linesCache.get(cacheKey);
  }
}

export function addLinesToCache(query: LineInput, linesData: LineData) {
  getLinesCacheInstance().set(createCacheKey(query), linesData);
}

function createCacheKey(valuesToCreateCacheKey: LineInput) {
  const keys = Object.keys(valuesToCreateCacheKey).sort();
  const values = keys.map(
    (key) => valuesToCreateCacheKey[key as keyof LineInput],
  );
  const cacheKey = JSON.stringify(values);
  return 'lines-' + Buffer.from(cacheKey).toString('base64');
}
