import TTLCache from '@isaacs/ttlcache';
import { FromToTripQuery, TripsType } from '../types';
import { PreassignedFareProduct } from '@atb-as/config-specs';
import { getOrgData } from '@atb/modules/org-data';

let productCache: TTLCache<string, PreassignedFareProduct[]> | null = null;

function getProductCacheInstance(): TTLCache<string, PreassignedFareProduct[]> {
  if (!productCache) {
    productCache = new TTLCache({ ttl: 1800000 }); // TTL: 30 minutes
  }

  return productCache;
}

export function getProductsIfCached(): PreassignedFareProduct | undefined {
  const orgId = getOrgData().orgId;
  if (productCache?.has(orgId)) {
    return productCache.get(orgId);
  }
}

export function addProductToCache(products: PreassignedFareProduct[]) {
  const orgId = getOrgData().orgId;
  getProductCacheInstance().set(orgId, products);
}
