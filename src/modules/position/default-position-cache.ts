import TTLCache from '@isaacs/ttlcache';
import { PositionType } from './types.ts';

const CACHE_TIME = 1800000; // 30 minutes
const CACHE_KEY = 'assistant-default-position';
let defaultPositionCache: TTLCache<string, PositionType> | null = null;

function getDefaultPositionCacheInstance(): TTLCache<string, PositionType> {
  if (!defaultPositionCache) {
    defaultPositionCache = new TTLCache({ ttl: CACHE_TIME, max: 1 });
  }

  return defaultPositionCache;
}

export function getDefaultPositionIfCached(): PositionType | undefined {
  if (defaultPositionCache?.has(CACHE_KEY)) {
    return defaultPositionCache.get(CACHE_KEY);
  }
}

export function addDefaultPositionToCache(position: PositionType) {
  getDefaultPositionCacheInstance().set(CACHE_KEY, position);
}
