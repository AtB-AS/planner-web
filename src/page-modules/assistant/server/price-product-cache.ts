import TTLCache from '@isaacs/ttlcache';
import { PreassignedFareProduct } from '@atb-as/config-specs';
import { getOrgData } from '@atb/modules/org-data';
import { getPreassignedFareProducts } from '@atb/modules/firebase';

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

export async function getPriceProductsIfCached(): Promise<
  PreassignedFareProduct[]
> {
  const orgId = getOrgData().orgId;
  const cacheInstance = getPriceProductCacheInstance();

  if (!cacheInstance.has(orgId)) {
    const preassignedFareProducts = await getPreassignedFareProducts().then(
      (val) => val.filter((p) => p.isEnabledForTripSearchOffer),
    );
    cacheInstance.set(orgId, preassignedFareProducts);
  }

  return cacheInstance.get(orgId) ?? [];
}
