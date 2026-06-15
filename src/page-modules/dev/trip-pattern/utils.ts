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

/**
 * Billed number of zones between two fare zones, via the active org's connection
 * graph (neighbours = 2 zones, same zone = 1). Returns null when either zone is
 * unknown, so callers can fall back to counting zones travelled.
 */
function zoneCountBetween(
  fromId: string | null,
  toId: string | null,
  t: TariffConfig,
): number | null {
  if (!fromId || !toId) return null;
  const a = t.zoneNames[fromId];
  const b = t.zoneNames[toId];
  if (!a || !b) return null;
  const count = ACTIVE_ZONE_COUNT[a]?.[b];
  return Number.isFinite(count) ? count : null;
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
  fromZone: string;
  toZone: string;
  zoneCount: number;
  validityMinutes: number;
  priceKr: number;
  activatedAtMs: number;
  expiresAtMs: number;
  boardings: { timeMs: number; label: string }[];
};

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
 * Each ticket is activated at a boarding and billed `origin → the destination of
 * the last leg it actually covers` (not the journey's final zone), so a
 * force-split trip pays only for the zones ridden on each ticket. A ticket is
 * extended to the next boarding only while a ticket spanning origin → that
 * boarding's destination would still be valid at that boarding's time
 * (`90 + 60·(zones − 1)` min); the first boarding that no longer fits starts the
 * next ticket. Returns null when the org has no tariff config or the trip has no
 * transit legs.
 */
export function computeTicketPlan(
  tripPattern: ExtendedTripPatternWithDetailsType,
): TicketPlan | null {
  const tariff = ACTIVE_TARIFF;
  // No tariff config for this org → no ticket plan (rather than wrong numbers).
  if (!tariff) return null;

  const legs = tripPattern.legs;
  // Index of each transit leg (a "boarding"); walk legs need no ticket.
  const boardingLegs = legs
    .map((leg, index) => ({ leg, index }))
    .filter(({ leg }) => leg.mode !== Mode.Foot);

  if (boardingLegs.length === 0) return null;

  // Billed zones between two fare zones via the connection graph, falling back
  // to the literal zones travelled across the covered legs if a zone id can't
  // be resolved.
  const billedZones = (
    fromId: string | null,
    toId: string | null,
    fromLegIndex: number,
    toLegIndex: number,
  ): number => {
    const connection = zoneCountBetween(fromId, toId, tariff);
    if (connection != null) return connection;
    return Math.max(
      1,
      collectFareZones(legs.slice(fromLegIndex, toLegIndex + 1)).length,
    );
  };

  const tickets: TicketSegment[] = [];
  let cursor = 0;

  while (cursor < boardingLegs.length) {
    const start = boardingLegs[cursor];
    const originZoneId = fareZoneIdOfPlace(start.leg.fromPlace);
    const activatedAtMs = new Date(start.leg.expectedStartTime).getTime();

    // Extend to cover the next boarding only while a ticket spanning origin →
    // that boarding's destination would still be valid at its boarding time.
    let last = cursor;
    while (last + 1 < boardingLegs.length) {
      const next = boardingLegs[last + 1];
      const candidateDestId = fareZoneIdOfPlace(next.leg.toPlace);
      const candidateZones = billedZones(
        originZoneId,
        candidateDestId,
        start.index,
        next.index,
      );
      const candidateExpiry =
        activatedAtMs + zoneValidityMinutes(candidateZones, tariff) * 60_000;
      if (new Date(next.leg.expectedStartTime).getTime() > candidateExpiry) {
        break;
      }
      last += 1;
    }

    // The ticket is billed origin → the last leg it actually covers.
    const lastEntry = boardingLegs[last];
    const destZoneId = fareZoneIdOfPlace(lastEntry.leg.toPlace);
    const zoneCount = billedZones(
      originZoneId,
      destZoneId,
      start.index,
      lastEntry.index,
    );
    const validityMinutes = zoneValidityMinutes(zoneCount, tariff);
    const priceKr = singleTicketPriceKr(zoneCount, tariff);
    const expiresAtMs = activatedAtMs + validityMinutes * 60_000;

    const covered = collectFareZones(
      legs.slice(start.index, lastEntry.index + 1),
    );
    const boardings = boardingLegs.slice(cursor, last + 1).map((entry) => ({
      timeMs: new Date(entry.leg.expectedStartTime).getTime(),
      label: legLabel(entry.leg),
    }));

    tickets.push({
      fromZone: originZoneId
        ? (tariff.zoneNames[originZoneId] ?? originZoneId)
        : (covered[0]?.name ?? '?'),
      toZone: destZoneId
        ? (tariff.zoneNames[destZoneId] ?? destZoneId)
        : (covered[covered.length - 1]?.name ?? '?'),
      zoneCount,
      validityMinutes,
      priceKr,
      activatedAtMs,
      expiresAtMs,
      boardings,
    });

    cursor = last + 1;
  }

  const singleTotalKr = tickets.reduce((sum, t) => sum + t.priceKr, 0);

  // The day ticket is valid in a single zone only, so it can replace the single
  // tickets just when the whole trip stays within one zone (every ticket is one
  // zone). It's the better buy once more than `maxSingleTicketsBeforeDayTicket`
  // single tickets are needed — at 3 the price ties at 150 kr, but the day
  // ticket is valid 24h instead of 3 × 90 min.
  const singleZoneTrip = tickets.every((t) => t.zoneCount === 1);
  const recommendDayTicket =
    singleZoneTrip && tickets.length > tariff.maxSingleTicketsBeforeDayTicket;

  return {
    tickets,
    singleTotalKr,
    dayTicketKr: tariff.dayTicketKr,
    recommendDayTicket,
  };
}
