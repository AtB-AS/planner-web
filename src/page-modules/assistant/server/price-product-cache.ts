import { PreassignedFareProduct } from '@atb-as/config-specs';
import { getServerPreassignedFareProducts } from '@atb/modules/firebase/server-config-store.ts';

/**
 * Preassigned fare products enabled for the trip-search offer.
 *
 * Backed by the server config store (a live `onSnapshot` listener), so there is
 * no per-request Firestore round-trip and no separate TTL layer to manage — the
 * store already holds the parsed `referenceData` in memory. Kept as a named
 * function so existing call sites are unchanged.
 */
export async function getPriceProductsIfCached(): Promise<
  PreassignedFareProduct[]
> {
  const preassignedFareProducts = await getServerPreassignedFareProducts();
  return preassignedFareProducts.filter((p) => p.isEnabledForTripSearchOffer);
}
