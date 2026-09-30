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
 * - Parse failures keep the last-good value instead of clobbering config to empty.
 * - Readiness is only signalled by a *server-backed* snapshot (not a cached one),
 *   with a bounded timeout so startup/getters never hang if a doc is slow/offline.
 * - A terminal listener error re-subscribes with backoff (the SDK does not resume
 *   a listener after its error callback fires).
 * - Readiness is tracked per document, so a slow doc can't block unrelated getters.
 *
 * Populated at startup by `src/instrumentation.ts`. Server-only (holds
 * process-wide listener state); do not import from client components or via the
 * `@atb/modules/firebase` barrel.
 */

type TransportModeFilter = ReturnType<
  typeof TravelSearchFilters.parse
>['transportModes'];

// Max time a getter / startup warmup waits for a doc's first server snapshot
// before proceeding with whatever value we have (fail-open, degraded).
const READY_TIMEOUT_MS = 5000;
// Delay before re-subscribing after a terminal listener error.
const RESUBSCRIBE_DELAY_MS = 5000;

// Parsed values, refreshed by the listener callbacks. Seeded empty; each parse
// function only overwrites its value on a *successful* parse (else keeps last-good).
let transportModeFilter: TransportModeFilter = [];
let preassignedFareProducts: PreassignedFareProduct[] = [];
let fareZones: FareZone[] = [];
let mapboxSpriteUrl: string | undefined = undefined;

function parseTransportModeFilter(data: DocumentData | undefined) {
  if (!data) return; // missing/offline event — keep last-good
  const validated = TravelSearchFilters.safeParse(data);
  if (validated.success) {
    transportModeFilter = validated.data.transportModes;
  } else {
    console.error(
      'server-config-store: invalid travelSearchFilters; keeping previous value',
      validated.error,
    );
  }
}

// `referenceData` carries both preassigned fare products and fare zones, so a
// single listener feeds both getters (no duplicate read of the same doc).
function parseReferenceData(data: DocumentData | undefined) {
  if (!data) return; // missing/offline event — keep last-good

  try {
    const parsed = JSON.parse(data.preassignedFareProducts_v2)
      .map((product: unknown) => {
        const result = PreassignedFareProductSchema.safeParse(product);
        return result.success ? result.data : undefined;
      })
      .filter(isDefined);
    preassignedFareProducts = parsed;
  } catch (error) {
    console.error(
      'server-config-store: invalid preassignedFareProducts_v2; keeping previous value',
      error,
    );
  }

  try {
    const potential = JSON.parse(data.fareZones);
    const result: FareZone[] = [];
    for (const fareZone of potential) {
      const validated = fareZoneSchema.safeParse(fareZone);
      if (validated.success) result.push(validated.data);
    }
    fareZones = result;
  } catch (error) {
    console.error(
      'server-config-store: invalid fareZones; keeping previous value',
      error,
    );
  }
}

function parseUrls(data: DocumentData | undefined) {
  if (!data) return; // missing/offline event — keep last-good
  const parsed = AppVersionedConfigurableLinkSchema.array().safeParse(
    data.mapboxSpriteUrls,
  );
  if (!parsed.success) {
    console.error(
      'server-config-store: invalid urls.mapboxSpriteUrls; keeping previous value',
      parsed.error,
    );
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

// Per-document readiness, resolved on the first server-backed snapshot.
const ready = new Map<
  string,
  { promise: Promise<void>; resolve: () => void }
>();
const unsubscribers = new Map<string, () => void>();
let started = false;

function getReady(id: string) {
  let entry = ready.get(id);
  if (!entry) {
    let resolve!: () => void;
    const promise = new Promise<void>((r) => (resolve = r));
    entry = { promise, resolve };
    ready.set(id, entry);
  }
  return entry;
}

function subscribe(
  id: string,
  handle: (data: DocumentData | undefined) => void,
) {
  const firestore = getFirestore(app);
  const unsubscribe = onSnapshot(
    doc(firestore, 'configuration', id),
    (snapshot) => {
      handle(snapshot.exists() ? snapshot.data() : undefined);
      // Only treat a server-confirmed snapshot as "ready" — a cached event at
      // startup (e.g. offline) could otherwise publish stale/empty config.
      if (!snapshot.metadata.fromCache) getReady(id).resolve();
    },
    (error) => {
      console.error(
        `server-config-store: listener error for configuration/${id}; re-subscribing`,
        error,
      );
      // The listener is terminal after this callback — re-establish it. Unblock
      // readiness so getters/startup fall back to last-good rather than hang.
      getReady(id).resolve();
      setTimeout(() => subscribe(id, handle), RESUBSCRIBE_DELAY_MS);
    },
  );
  unsubscribers.set(id, unsubscribe);
}

function ensureStarted() {
  if (started) return;
  started = true;
  for (const [id, handle] of Object.entries(WATCHED)) {
    getReady(id); // create the readiness promise up front
    subscribe(id, handle);
  }
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/** Wait for one doc's first server snapshot, bounded by READY_TIMEOUT_MS. */
async function awaitDoc(id: string) {
  ensureStarted();
  await Promise.race([getReady(id).promise, delay(READY_TIMEOUT_MS)]);
}

/**
 * Start listeners and wait (bounded) for the first server snapshot of every doc.
 * Called at startup from instrumentation to pre-warm. Never rejects and never
 * hangs past READY_TIMEOUT_MS.
 */
export function subscribeToServerConfig(): Promise<void> {
  ensureStarted();
  return Promise.all(Object.keys(WATCHED).map((id) => awaitDoc(id))).then(
    () => undefined,
  );
}

export async function getServerTransportModeFilter(): Promise<TransportModeFilter> {
  await awaitDoc('travelSearchFilters');
  return transportModeFilter;
}

export async function getServerPreassignedFareProducts(): Promise<
  PreassignedFareProduct[]
> {
  await awaitDoc('referenceData');
  return preassignedFareProducts;
}

export async function getServerFareZones(): Promise<FareZone[]> {
  await awaitDoc('referenceData');
  return fareZones;
}

export async function getServerMapboxSpriteUrl(): Promise<string | undefined> {
  await awaitDoc('urls');
  return mapboxSpriteUrl;
}

/** Tear down all listeners. Mainly for tests / graceful shutdown. */
export function unsubscribeFromServerConfig() {
  unsubscribers.forEach((unsubscribe) => unsubscribe());
  unsubscribers.clear();
  ready.clear();
  started = false;
  transportModeFilter = [];
  preassignedFareProducts = [];
  fareZones = [];
  mapboxSpriteUrl = undefined;
}
