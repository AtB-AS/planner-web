import type { GeocoderFeature } from '@atb/modules/geocoder';
import type { TransportModeFilterOptionType } from '@atb-as/config-specs';
import { uniq } from 'lodash';
import type { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';
import type { LegWithDetailsFragment } from '@atb/page-modules/assistant/journey-gql/trip-with-details.generated';
import { Mode } from '@atb/modules/graphql-types';
import { currentOrg } from '@atb/modules/org-data';
import { TARIFF_CONFIGS, type TariffConfig } from './tariff';

export type VariablesLocation = {
  place: string;
  coordinates: { latitude: number; longitude: number };
  name: string;
};

export function featureToLocation(feature: GeocoderFeature): VariablesLocation {
  return {
    place: feature.id,
    coordinates: {
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
    },
    name: feature.name,
  };
}

export function locationToFeature(loc: VariablesLocation): GeocoderFeature {
  return {
    id: loc.place,
    name: loc.name,
    locality: null,
    category: [],
    layer: 'venue',
    geometry: {
      coordinates: [loc.coordinates.longitude, loc.coordinates.latitude],
    },
  };
}

function locationToGraphQL(loc: VariablesLocation): string {
  return `{
      place: "${loc.place}"
      coordinates: {
        latitude: ${loc.coordinates.latitude}
        longitude: ${loc.coordinates.longitude}
      }
      name: "${loc.name}"
    }`;
}

const FROM_PATTERN = /from:\s*\{[\s\S]*?coordinates:\s*\{[\s\S]*?\}[\s\S]*?\}/;
const TO_PATTERN = /to:\s*\{[\s\S]*?coordinates:\s*\{[\s\S]*?\}[\s\S]*?\}/;
// Matches the `modes: { ... }` block injected by the transport mode filter.
// The `transportModes` list is always rendered inline (single line), so the
// first newline-indented `}` is the closing brace of the modes block.
const MODES_PATTERN = /\n\s*modes:\s*\{[\s\S]*?\n\s*\}/;

/**
 * Builds the inline GraphQL `modes: { ... }` block from the selected transport
 * mode filter options, mirroring how the assistant maps the filter to the
 * JourneyPlanner `Modes` input (see server/journey-planner/mappers.ts).
 *
 * Returns `null` when no filter should be applied (nothing selected yet, or
 * every option selected — both mean "all modes", same as the assistant).
 */
export function buildModesGraphQL(
  options: TransportModeFilterOptionType[],
  filterState: string[] | null,
): string | null {
  // `null` means no filter; all options selected is equivalent to no filter.
  if (!filterState) return null;
  if (filterState.length === options.length) return null;

  const selectedModes = options
    .filter((option) => filterState.includes(option.id))
    .flatMap((option) => option.modes);

  const transportModes = uniq(
    selectedModes.map((mode) => {
      const subModes =
        mode.transportSubModes && mode.transportSubModes.length > 0
          ? `, transportSubModes: [${mode.transportSubModes.join(', ')}]`
          : '';
      return `{ transportMode: ${mode.transportMode}${subModes} }`;
    }),
  );

  return `    modes: {
      accessMode: foot
      egressMode: foot
      transportModes: [${transportModes.join(', ')}]
    }`;
}

/**
 * Removes any existing `modes` block from the query and, when a block is
 * provided, injects it as the first argument of the `trip(...)` call.
 */
export function patchQueryModes(
  query: string,
  modesBlock: string | null,
): string {
  const withoutModes = query.replace(MODES_PATTERN, '');
  if (!modesBlock) return withoutModes;
  return withoutModes.replace(/trip\s*\(/, `trip(\n${modesBlock}`);
}

// Matches the single-line `whiteListed: { authorities: [...] }` block injected
// by the authority toggle, so it can be removed/replaced idempotently.
const WHITELISTED_AUTHORITIES_PATTERN =
  /\n\s*whiteListed:\s*\{\s*authorities:[^}]*\}/;

/**
 * Removes any injected authority whitelist and, when an authority id is given,
 * injects `whiteListed: { authorities: [...] }` as the first argument of
 * `trip(...)`. This filters server-side: the JourneyPlanner only returns trips
 * operated by the whitelisted authority — i.e. the ones the sales endpoint can
 * price.
 */
export function patchQueryAuthorities(
  query: string,
  authorityId: string | null,
): string {
  const without = query.replace(WHITELISTED_AUTHORITIES_PATTERN, '');
  if (!authorityId) return without;
  return without.replace(
    /trip\s*\(/,
    `trip(\n    whiteListed: { authorities: ["${authorityId}"] }`,
  );
}

function parseLocationFromMatch(match: string): VariablesLocation | undefined {
  try {
    const place = match.match(/place:\s*"([^"]+)"/)?.[1] ?? '';
    const lat = match.match(/latitude:\s*([\d.-]+)/)?.[1];
    const lon = match.match(/longitude:\s*([\d.-]+)/)?.[1];
    const name = match.match(/name:\s*"([^"]+)"/)?.[1];
    if (name) {
      return {
        place,
        coordinates: {
          latitude: lat ? parseFloat(lat) : 0,
          longitude: lon ? parseFloat(lon) : 0,
        },
        name,
      };
    }
  } catch {
    // ignore
  }
  return undefined;
}

export function parseLocationsFromQuery(query: string): {
  from: GeocoderFeature | undefined;
  to: GeocoderFeature | undefined;
} {
  const fromMatch = query.match(FROM_PATTERN)?.[0];
  const toMatch = query.match(TO_PATTERN)?.[0];
  return {
    from: fromMatch
      ? (() => {
          const l = parseLocationFromMatch(fromMatch);
          return l ? locationToFeature(l) : undefined;
        })()
      : undefined,
    to: toMatch
      ? (() => {
          const l = parseLocationFromMatch(toMatch);
          return l ? locationToFeature(l) : undefined;
        })()
      : undefined,
  };
}

export function patchQueryLocation(
  query: string,
  field: 'from' | 'to',
  loc: VariablesLocation,
): string {
  const pattern = field === 'from' ? FROM_PATTERN : TO_PATTERN;
  const replacement = `${field}: ${locationToGraphQL(loc)}`;
  return query.replace(pattern, replacement);
}

/**
 * Removes any existing `pageCursor` from the query and injects the given one as
 * the first argument of the `trip(...)` call.
 */
export function injectPageCursor(query: string, cursor: string): string {
  const withoutCursor = query.replace(/\s*pageCursor:\s*"[^"]*"\n?/, '');
  return withoutCursor.replace(
    /trip\s*\(/,
    `trip(\n    pageCursor: "${cursor}"`,
  );
}

// Mirrors the assistant's initial search behaviour: keep following
// `nextPageCursor` until we have collected enough trip patterns, or we have
// made too many attempts. See page-modules/assistant/client/journey-planner.
export const WANTED_TRIP_PATTERNS = 8;
export const MAX_SEARCH_ATTEMPTS = 5;

export const DEFAULT_FROM: VariablesLocation = {
  place: 'NSR:StopPlace:41613',
  coordinates: { latitude: 63.431034, longitude: 10.392007 },
  name: 'Prinsens gate',
};

export const DEFAULT_TO: VariablesLocation = {
  place: 'NSR:StopPlace:42625',
  coordinates: { latitude: 63.435085, longitude: 10.457026 },
  name: 'Strindheim',
};

export function buildDefaultInlinedQuery(fragments: string): string {
  return `{
  trip(
    from: ${locationToGraphQL(DEFAULT_FROM)}
    to: ${locationToGraphQL(DEFAULT_TO)}
    arriveBy: false
    numTripPatterns: 3
    waitReluctance: 1
    walkReluctance: 4
    transferPenalty: 10
    searchWindow: 120
    includeRealtimeCancellations: true
    includePlannedCancellations: true
  ) {
    nextPageCursor
    previousPageCursor
    metadata {
      searchWindowUsed
    }
    tripPatterns {
      ...tripPatternWithDetails
    }
  }
}

${fragments}`;
}

export type FareZone = { id: string; name?: string };
// The base leg shape — all the fields the zone/ticket helpers read live here.
// (Array methods like .slice()/.map() on the extended trip legs resolve to this
// base type, so typing against it keeps the helpers assignable from both.)
type TripLeg = LegWithDetailsFragment;

function collectFareZones(legs: TripLeg[]): FareZone[] {
  const zones: FareZone[] = [];
  const seen = new Set<string>();

  for (const leg of legs) {
    for (const place of [leg.fromPlace, leg.toPlace]) {
      for (const zone of place?.quay?.tariffZones ?? []) {
        if (
          zone?.id &&
          zone.id.includes(`${currentOrg.toUpperCase()}:FareZone`) &&
          !seen.has(zone.id)
        ) {
          seen.add(zone.id);
          zones.push({ id: zone.id, name: zone.name ?? undefined });
        }
      }
    }
  }

  return zones;
}

/**
 * Collects the unique fare zones (ids containing "<ORG>:FareZone") the trip
 * passes through, in the order they are first encountered, from the quays of
 * each leg's from/to place. Deduped by zone id.
 */
export function getTripPatternZones(
  tripPattern: ExtendedTripPatternWithDetailsType,
): FareZone[] {
  return collectFareZones(tripPattern.legs);
}

// Tariff rules for the running org (currentOrg is fixed per process). When the
// org has no tariff config, the calculator produces no ticket plan.
const ACTIVE_TARIFF: TariffConfig | null = TARIFF_CONFIGS[currentOrg] ?? null;

// All-pairs billed zone count for the active org = shortest connection hops + 1.
const ACTIVE_ZONE_COUNT: Record<string, Record<string, number>> = (() => {
  if (!ACTIVE_TARIFF) return {};
  const conns = ACTIVE_TARIFF.connections;
  const names = Object.keys(conns);
  const matrix: Record<string, Record<string, number>> = {};
  for (const start of names) {
    const dist: Record<string, number> = { [start]: 0 };
    const queue = [start];
    while (queue.length) {
      const u = queue.shift() as string;
      for (const v of conns[u]) {
        if (!(v in dist)) {
          dist[v] = dist[u] + 1;
          queue.push(v);
        }
      }
    }
    matrix[start] = {};
    for (const n of names) matrix[start][n] = (dist[n] ?? Infinity) + 1;
  }
  return matrix;
})();

function zoneValidityMinutes(zoneCount: number, t: TariffConfig): number {
  return (
    t.baseValidityMin + t.extraZoneValidityMin * Math.max(0, zoneCount - 1)
  );
}

function singleTicketPriceKr(zoneCount: number, t: TariffConfig): number {
  return t.singleTicketBaseKr + t.extraZoneKr * Math.max(0, zoneCount - 1);
}

type PlaceWithZones = {
  quay?: { tariffZones?: { id: string; name?: string }[] } | null;
};

function fareZoneIdOfPlace(place: PlaceWithZones | undefined): string | null {
  return (
    place?.quay?.tariffZones?.find((z) =>
      z?.id?.includes(`${currentOrg.toUpperCase()}:FareZone`),
    )?.id ?? null
  );
}

// Sorted unique zone names for the active org — drives the dev "owned tickets"
// editor. Empty when the org has no tariff config.
export const ACTIVE_ZONE_NAMES: string[] = ACTIVE_TARIFF
  ? Object.keys(ACTIVE_TARIFF.connections).sort()
  : [];

/**
 * Billed number of zones between two zone *names* via the active org's
 * connection graph (neighbours = 2 zones, same zone = 1). Null when either name
 * is unknown.
 */
function zoneCountBetweenNames(a: string, b: string): number | null {
  const count = ACTIVE_ZONE_COUNT[a]?.[b];
  return Number.isFinite(count) ? count : null;
}

/**
 * Ordered list of the org's fare-zone *names* the legs traverse, deduped (first
 * occurrence wins), e.g. [A, C6, D]. This is the real route, used to bill the
 * un-owned remainder of a journey.
 */
function traversedZoneNames(legs: TripLeg[], t: TariffConfig): string[] {
  const names: string[] = [];
  const seen = new Set<string>();
  for (const leg of legs) {
    for (const place of [leg.fromPlace, leg.toPlace]) {
      const id = fareZoneIdOfPlace(place);
      if (!id) continue;
      const name = t.zoneNames[id] ?? id;
      if (!seen.has(name)) {
        seen.add(name);
        names.push(name);
      }
    }
  }
  return names;
}

const osloTimeFormatter = new Intl.DateTimeFormat('no-NO', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Oslo',
});

export function formatOsloTime(epochMs: number): string {
  return osloTimeFormatter.format(epochMs);
}

function legLabel(leg: TripLeg): string {
  return leg.line?.publicCode ?? leg.line?.name ?? leg.mode;
}

export type TicketSegment = {
  // For a bought ticket: the un-owned span it pays for (e.g. C6→D). For a
  // covered segment: the boarding's own from/to zones.
  fromZone: string;
  toZone: string;
  zoneCount: number;
  validityMinutes: number;
  priceKr: number;
  activatedAtMs: number;
  expiresAtMs: number;
  boardings: { timeMs: number; label: string }[];
  // True when an owned, still-valid ticket already covers the whole span, so
  // nothing is bought for it.
  fullyCovered: boolean;
  // Zone names within this span an owned ticket covers (dropped from the billed
  // count). Empty when the traveller owns nothing along it.
  coveredZones: string[];
};

/**
 * A ticket the traveller already holds. `kind` is for labelling only — the
 * calculation uses `zones` (the zone names it's valid in) and `remainingMinutes`
 * (validity left at the trip's start; undefined = valid for the whole trip).
 */
export type OwnedTicket = {
  kind: 'day' | 'single' | 'period';
  zones: string[];
  remainingMinutes?: number;
};

/**
 * Zone names covered by owned tickets still valid at `timeMs`, where each
 * ticket's validity is measured from the trip's first boarding.
 */
function ownedValidNamesAt(
  timeMs: number,
  firstBoardingMs: number,
  owned: OwnedTicket[],
): Set<string> {
  const set = new Set<string>();
  for (const ticket of owned) {
    const expiry =
      ticket.remainingMinutes == null
        ? Infinity
        : firstBoardingMs + ticket.remainingMinutes * 60_000;
    if (timeMs <= expiry) {
      for (const zone of ticket.zones) set.add(zone);
    }
  }
  return set;
}

export type TicketPlan = {
  tickets: TicketSegment[];
  singleTotalKr: number;
  dayTicketKr: number;
  // True when buying single tickets is no longer worth it (more than two are
  // needed, or they cost more than a day ticket) and a 24-hour ticket is the
  // better suggestion.
  recommendDayTicket: boolean;
};

/**
 * Greedily splits a trip into the single tickets a traveller must buy, applying
 * AtB's rules: a ticket only needs to be valid at boarding, and the billed zone
 * count between two zones comes from the connection graph (pass-through zones
 * aren't charged — neighbours are 2 zones).
 *
 * When the traveller already holds tickets (`options.ownedTickets`), each
 * span's billed zones are computed on the **un-owned remainder of the real
 * route**: collect the traversed zone names, drop the zones an owned, still-
 * valid ticket covers, then bill `zoneCountBetween(firstRemaining,
 * lastRemaining)`. A span whose remainder is empty is fully covered and bought
 * nothing — it's recorded as a covered segment. With no owned tickets the
 * remainder is the whole route, so this reduces to billing origin → the
 * destination of the last leg the ticket covers.
 *
 * Each ticket is activated at a boarding and extended to the next boarding only
 * while it would still be valid at that boarding's time (`90 + 60·(zones − 1)`
 * min) and that boarding isn't itself fully covered by an owned ticket. Returns
 * null when the org has no tariff config or the trip has no transit legs.
 */
export function computeTicketPlan(
  tripPattern: ExtendedTripPatternWithDetailsType,
  options: { ownedTickets?: OwnedTicket[] } = {},
): TicketPlan | null {
  const tariff = ACTIVE_TARIFF;
  // No tariff config for this org → no ticket plan (rather than wrong numbers).
  if (!tariff) return null;

  const owned = options.ownedTickets ?? [];
  const legs = tripPattern.legs;
  // Index of each transit leg (a "boarding"); walk legs need no ticket.
  const boardingLegs = legs
    .map((leg, index) => ({ leg, index }))
    .filter(({ leg }) => leg.mode !== Mode.Foot);

  if (boardingLegs.length === 0) return null;

  const firstBoardingMs = new Date(
    boardingLegs[0].leg.expectedStartTime,
  ).getTime();

  // Bill legs[fromLegIndex..toLegIndex] for a ticket activated at `atMs`, after
  // dropping zones an owned, still-valid ticket covers. Returns the billed zone
  // count (0 = fully covered), the un-owned span endpoints, and the owned zones
  // it absorbed.
  const billSpan = (
    fromLegIndex: number,
    toLegIndex: number,
    atMs: number,
  ): {
    zoneCount: number;
    fromZone: string;
    toZone: string;
    coveredZones: string[];
  } => {
    const chain = traversedZoneNames(
      legs.slice(fromLegIndex, toLegIndex + 1),
      tariff,
    );
    const ownedZones = ownedValidNamesAt(atMs, firstBoardingMs, owned);
    const remaining = chain.filter((zone) => !ownedZones.has(zone));
    const coveredZones = chain.filter((zone) => ownedZones.has(zone));

    if (remaining.length === 0) {
      return {
        zoneCount: 0,
        fromZone: chain[0] ?? '?',
        toZone: chain[chain.length - 1] ?? '?',
        coveredZones,
      };
    }

    const first = remaining[0];
    const last = remaining[remaining.length - 1];
    // Fall back to the count of distinct un-owned zones if the graph can't
    // resolve a span between the endpoints.
    const span = zoneCountBetweenNames(first, last);
    return {
      zoneCount: span ?? remaining.length,
      fromZone: first,
      toZone: last,
      coveredZones,
    };
  };

  const tickets: TicketSegment[] = [];
  let cursor = 0;

  while (cursor < boardingLegs.length) {
    const start = boardingLegs[cursor];
    const activatedAtMs = new Date(start.leg.expectedStartTime).getTime();

    // A boarding whose own span is fully owned needs no ticket — record it as a
    // covered segment and move on.
    const startSelf = billSpan(start.index, start.index, activatedAtMs);
    if (startSelf.zoneCount === 0) {
      tickets.push({
        fromZone: startSelf.fromZone,
        toZone: startSelf.toZone,
        zoneCount: 0,
        validityMinutes: 0,
        priceKr: 0,
        activatedAtMs,
        expiresAtMs: activatedAtMs,
        boardings: [{ timeMs: activatedAtMs, label: legLabel(start.leg) }],
        fullyCovered: true,
        coveredZones: startSelf.coveredZones,
      });
      cursor += 1;
      continue;
    }

    // Extend one new ticket to cover later boardings while it stays valid and
    // those boardings aren't independently covered by an owned ticket.
    let last = cursor;
    while (last + 1 < boardingLegs.length) {
      const next = boardingLegs[last + 1];
      const nextTimeMs = new Date(next.leg.expectedStartTime).getTime();
      const nextSelf = billSpan(next.index, next.index, nextTimeMs);
      if (nextSelf.zoneCount === 0) break; // covered separately
      const candidate = billSpan(start.index, next.index, activatedAtMs);
      const candidateExpiry =
        activatedAtMs +
        zoneValidityMinutes(candidate.zoneCount, tariff) * 60_000;
      if (nextTimeMs > candidateExpiry) break;
      last += 1;
    }

    const lastEntry = boardingLegs[last];
    const final = billSpan(start.index, lastEntry.index, activatedAtMs);
    const validityMinutes = zoneValidityMinutes(final.zoneCount, tariff);
    const priceKr = singleTicketPriceKr(final.zoneCount, tariff);

    tickets.push({
      fromZone: final.fromZone,
      toZone: final.toZone,
      zoneCount: final.zoneCount,
      validityMinutes,
      priceKr,
      activatedAtMs,
      expiresAtMs: activatedAtMs + validityMinutes * 60_000,
      boardings: boardingLegs.slice(cursor, last + 1).map((entry) => ({
        timeMs: new Date(entry.leg.expectedStartTime).getTime(),
        label: legLabel(entry.leg),
      })),
      fullyCovered: false,
      coveredZones: final.coveredZones,
    });

    cursor = last + 1;
  }

  // Only bought tickets count toward the total and the day-ticket suggestion.
  const bought = tickets.filter((ticket) => !ticket.fullyCovered);
  const singleTotalKr = bought.reduce((sum, ticket) => sum + ticket.priceKr, 0);

  // The day ticket is valid in a single zone only, so it can replace the single
  // tickets just when every bought ticket stays within one zone. It's the
  // better buy once more than `maxSingleTicketsBeforeDayTicket` are needed — at
  // 3 the price ties at 150 kr, but the day ticket is valid 24h instead of
  // 3 × 90 min.
  const singleZoneTrip =
    bought.length > 0 && bought.every((ticket) => ticket.zoneCount === 1);
  const recommendDayTicket =
    singleZoneTrip && bought.length > tariff.maxSingleTicketsBeforeDayTicket;

  return {
    tickets,
    singleTotalKr,
    dayTicketKr: tariff.dayTicketKr,
    recommendDayTicket,
  };
}
