import {
  doc,
  getFirestore,
  onSnapshot,
  type DocumentData,
} from 'firebase/firestore';
import {
  AppVersionedConfigurableLinkSchema,
  PreassignedFareProduct as PreassignedFareProductSchema,
  type PreassignedFareProduct,
  TravelSearchFilters,
} from '@atb-as/config-specs';
import { isDefined } from '@atb/utils/presence';
import { type FareZone, fareZoneSchema } from './types';
import app from './firebase';

/**
 * Server-side store for near-static Firestore config docs.
 *
 * Each server process opens one real-time `onSnapshot` listener per config doc
 * and parses the payload *once per change* inside the callback. Reads are then a
 * synchronous return of an already-parsed value — no per-request network and no
 * per-request Zod. Config changes propagate within seconds.
 *
 * This also lets us serve config to the browser via our own API routes
 * (`/api/config/*`) instead of every client hitting Firestore directly. That
 * turns "one Firestore read per web session" into "one listener per pod",
 * cutting Firestore read ops dramatically.
 *
 * Uses the Web SDK (same public config as the browser) so it works everywhere
 * the app runs — GKE, local dev, and Vercel previews — with no extra credentials.
 *
 * Populated at startup by `src/instrumentation.ts` so the first request is
 * already warm. Server-only (holds process-wide listener state); do not import
 * from client components or via the `@atb/modules/firebase` barrel.
 */

type TransportModeFilter = ReturnType<
  typeof TravelSearchFilters.parse
>['transportModes'];

// Parsed values, refreshed by the listener callbacks.
let transportModeFilter: TransportModeFilter = [];
let preassignedFareProducts: PreassignedFareProduct[] = [];
let fareZones: FareZone[] = [];
let mapboxSpriteUrl: string | undefined = undefined;

const unsubscribers: Array<() => void> = [];
let readyPromise: Promise<void> | null = null;

function parseTransportModeFilter(data: DocumentData | undefined) {
  if (!data) {
    transportModeFilter = [];
    return;
  }
  const validated = TravelSearchFilters.safeParse(data);
  transportModeFilter = validated.success ? validated.data.transportModes : [];
}

// `referenceData` carries both preassigned fare products and fare zones, so a
// single listener feeds both getters (no duplicate read of the same doc).
function parseReferenceData(data: DocumentData | undefined) {
  if (!data) {
    preassignedFareProducts = [];
    fareZones = [];
    return;
  }

  try {
    preassignedFareProducts = JSON.parse(data.preassignedFareProducts_v2)
      .map((product: unknown) => {
        const parsed = PreassignedFareProductSchema.safeParse(product);
        return parsed.success ? parsed.data : undefined;
      })
      .filter(isDefined);
  } catch {
    preassignedFareProducts = [];
  }

  try {
    const potential = JSON.parse(data.fareZones);
    const result: FareZone[] = [];
    for (const fareZone of potential) {
      const validated = fareZoneSchema.safeParse(fareZone);
      if (validated.success) result.push(validated.data);
    }
    fareZones = result;
  } catch {
    fareZones = [];
  }
}

function parseUrls(data: DocumentData | undefined) {
  if (!data) {
    mapboxSpriteUrl = undefined;
    return;
  }
  const parsed = AppVersionedConfigurableLinkSchema.array().safeParse(
    data.mapboxSpriteUrls,
  );
  if (!parsed.success) {
    mapboxSpriteUrl = undefined;
    return;
  }
  // Web has no app version — prefer the entry with no upper bound (the
  // "current" one), else fall back to the last entry.
  const current =
    parsed.data.find((v) => !v.appVersionMax) ?? parsed.data.at(-1);
  mapboxSpriteUrl = current?.configurableLink?.[0]?.value;
}

// doc id -> handler that parses its snapshot into the module state above.
const WATCHED: Record<string, (data: DocumentData | undefined) => void> = {
  travelSearchFilters: parseTransportModeFilter,
  referenceData: parseReferenceData,
  urls: parseUrls,
};

/**
 * Subscribe to all watched config docs. Idempotent — returns the same promise on
 * repeated calls. Resolves once every doc has produced its first snapshot.
 */
export function subscribeToServerConfig(): Promise<void> {
  if (readyPromise) return readyPromise;

  const firestore = getFirestore(app);

  const firstSnapshots = Object.entries(WATCHED).map(
    ([id, handle]) =>
      new Promise<void>((resolve) => {
        let settled = false;
        const settle = () => {
          if (!settled) {
            settled = true;
            resolve();
          }
        };

        const unsubscribe = onSnapshot(
          doc(firestore, 'configuration', id),
          (snapshot) => {
            handle(snapshot.exists() ? snapshot.data() : undefined);
            settle();
          },
          (error) => {
            console.error(
              `server-config-store: listener error for configuration/${id}`,
              error,
            );
            // Resolve anyway so startup isn't blocked; readers keep the last
            // known value and the SDK auto-reconnects on transient errors.
            settle();
          },
        );

        unsubscribers.push(unsubscribe);
      }),
  );

  readyPromise = Promise.all(firstSnapshots).then(() => undefined);
  return readyPromise;
}

export async function getServerTransportModeFilter(): Promise<TransportModeFilter> {
  await subscribeToServerConfig();
  return transportModeFilter;
}

export async function getServerPreassignedFareProducts(): Promise<
  PreassignedFareProduct[]
> {
  await subscribeToServerConfig();
  return preassignedFareProducts;
}

export async function getServerFareZones(): Promise<FareZone[]> {
  await subscribeToServerConfig();
  return fareZones;
}

export async function getServerMapboxSpriteUrl(): Promise<string | undefined> {
  await subscribeToServerConfig();
  return mapboxSpriteUrl;
}

/** Tear down all listeners. Mainly for tests / graceful shutdown. */
export function unsubscribeFromServerConfig() {
  while (unsubscribers.length) {
    unsubscribers.pop()?.();
  }
  transportModeFilter = [];
  preassignedFareProducts = [];
  fareZones = [];
  mapboxSpriteUrl = undefined;
  readyPromise = null;
}
