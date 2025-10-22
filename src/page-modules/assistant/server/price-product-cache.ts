import TTLCache from '@isaacs/ttlcache';
import { FromToTripQuery, TripsType } from '../types';
import { PreassignedFareProduct } from '@atb-as/config-specs';
import { getOrgData } from '@atb/modules/org-data';

let priceProductCache: TTLCache<string, PreassignedFareProduct[]> | null = null;

function getPriceProductCacheInstance(): TTLCache<
  string,
  PreassignedFareProduct[]
> {
  if (!priceProductCache) {
    priceProductCache = new TTLCache({ ttl: 1800000 }); // TTL: 30 minutes
  }

  return priceProductCache;
}

export function getPriceProductsIfCached():
  | PreassignedFareProduct[]
  | undefined {
  const orgId = getOrgData().orgId;
  if (priceProductCache?.has(orgId)) {
    return priceProductCache.get(orgId);
  }
}

export function addPriceProductToCache(products: PreassignedFareProduct[]) {
  const orgId = getOrgData().orgId;
  getPriceProductCacheInstance().set(orgId, products);
}
