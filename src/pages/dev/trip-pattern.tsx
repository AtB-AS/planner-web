import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';
import type { GetServerSideProps, NextPage } from 'next';
import { setCookie } from 'cookies-next';
import { useState, useEffect } from 'react';
import { DEV_MODE_COOKIE_NAME } from '@atb/modules/cookies/constants';
import { TripsWithDetailsDocument } from '@atb/page-modules/assistant/journey-gql/trip-with-details.generated';
import { print, getIntrospectionQuery, buildClientSchema } from 'graphql';
import type { GraphQLSchema } from 'graphql';
import TripPattern from '@atb/page-modules/assistant/trip/trip-pattern';
import type { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';
import type { GeocoderFeature } from '@atb/modules/geocoder';
import Search from '@atb/components/search';
import { TransportModeFilter } from '@atb/modules/transport-mode';
import { getTransportModeFilter } from '@atb/modules/firebase/transport-mode-filter';
import type { TransportModeFilterOptionType } from '@atb-as/config-specs';
import useSWRImmutable from 'swr/immutable';
import { uniq } from 'lodash';
import dynamic from 'next/dynamic';
import style from './trip-pattern.module.css';
import { currentOrg, getOrgData } from '@atb/modules/org-data';

const GraphQLEditor = dynamic(() => import('@atb/components/graphql-editor'), {
  ssr: false,
});

const JsonEditor = dynamic(() => import('@atb/components/json-editor'), {
  ssr: false,
});

type DevTripPatternPageProps = WithGlobalData<{
  defaultGqlQuery: string;
  fragments: string;
}>;

type VariablesLocation = {
  place: string;
  coordinates: { latitude: number; longitude: number };
  name: string;
};

function featureToLocation(feature: GeocoderFeature): VariablesLocation {
  return {
    place: feature.id,
    coordinates: {
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
    },
    name: feature.name,
  };
}

function locationToFeature(loc: VariablesLocation): GeocoderFeature {
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
function buildModesGraphQL(
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
function patchQueryModes(query: string, modesBlock: string | null): string {
  const withoutModes = query.replace(MODES_PATTERN, '');
  if (!modesBlock) return withoutModes;
  return withoutModes.replace(/trip\s*\(/, `trip(\n${modesBlock}`);
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

function parseLocationsFromQuery(query: string): {
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

function patchQueryLocation(
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
function injectPageCursor(query: string, cursor: string): string {
  const withoutCursor = query.replace(/\s*pageCursor:\s*"[^"]*"\n?/, '');
  return withoutCursor.replace(
    /trip\s*\(/,
    `trip(\n    pageCursor: "${cursor}"`,
  );
}

// Mirrors the assistant's initial search behaviour: keep following
// `nextPageCursor` until we have collected enough trip patterns, or we have
// made too many attempts. See page-modules/assistant/client/journey-planner.
const WANTED_TRIP_PATTERNS = 8;
const MAX_SEARCH_ATTEMPTS = 5;

const DEFAULT_FROM: VariablesLocation = {
  place: 'NSR:StopPlace:41613',
  coordinates: { latitude: 63.431034, longitude: 10.392007 },
  name: 'Prinsens gate',
};

const DEFAULT_TO: VariablesLocation = {
  place: 'NSR:StopPlace:42625',
  coordinates: { latitude: 63.435085, longitude: 10.457026 },
  name: 'Strindheim',
};

function buildDefaultInlinedQuery(fragments: string): string {
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

/**
 * Collects the unique fare zones (ids containing "ATB:FareZone") the trip
 * passes through, in the order they are first encountered, from the quays of
 * each leg's from/to place. Deduped by zone id.
 */
function getTripPatternZones(
  tripPattern: ExtendedTripPatternWithDetailsType,
): { id: string; name?: string }[] {
  const zones: { id: string; name?: string }[] = [];
  const seen = new Set<string>();

  for (const leg of tripPattern.legs) {
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

const DevTripPatternPage: NextPage<DevTripPatternPageProps> = (props) => {
  const { defaultGqlQuery, fragments } = props;

  const [fromFeature, setFromFeature] = useState<GeocoderFeature | undefined>(
    locationToFeature(DEFAULT_FROM),
  );
  const [toFeature, setToFeature] = useState<GeocoderFeature | undefined>(
    locationToFeature(DEFAULT_TO),
  );
  const [queryText, setQueryText] = useState(defaultGqlQuery);
  const [transportModeFilterState, setTransportModeFilterState] = useState<
    string[] | null
  >(null);
  // Bumped on "Restore defaults" to remount the filter so its checkboxes reset.
  const [filterResetNonce, setFilterResetNonce] = useState(0);
  const [result, setResult] = useState<{
    raw: unknown;
    tripPatterns?: ExtendedTripPatternWithDetailsType[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageCursor, setNextPageCursor] = useState<string | null>(null);
  const [runCount, setRunCount] = useState(0);
  const [schema, setSchema] = useState<GraphQLSchema | undefined>(undefined);

  // Loaded the same way as the assistant layout so the available transport
  // modes match the real travel search filters.
  const { data: transportModeFilterData } = useSWRImmutable(
    'transportModeFilter',
    getTransportModeFilter,
  );

  // Fetch introspection schema for autocomplete
  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const response = await fetch('/api/dev/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: getIntrospectionQuery(),
            variables: {},
          }),
        });
        const json = await response.json();
        const introspectionResult = json.raw?.data ?? json.data;
        if (introspectionResult) {
          setSchema(buildClientSchema(introspectionResult));
        }
      } catch {
        // Schema fetch failed — editor works without autocomplete
      }
    };
    fetchSchema();
  }, []);

  const runQuery = async (query: string) => {
    setLoading(true);
    try {
      let accumulated: ExtendedTripPatternWithDetailsType[] = [];
      let latestRaw: unknown = null;
      let cursor: string | null = null;
      let attempts = 0;

      // Follow `nextPageCursor` automatically, like the assistant's initial
      // search, until we have enough trip patterns or run out of attempts.
      while (attempts < MAX_SEARCH_ATTEMPTS) {
        const currentQuery = cursor ? injectPageCursor(query, cursor) : query;
        const response = await fetch('/api/dev/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: currentQuery, variables: {} }),
        });
        const data: {
          raw?: { data?: { trip?: { nextPageCursor?: string | null } } };
          tripPatterns?: ExtendedTripPatternWithDetailsType[];
        } = await response.json();
        latestRaw = data.raw;
        accumulated = [...accumulated, ...(data.tripPatterns ?? [])];
        cursor = data.raw?.data?.trip?.nextPageCursor ?? null;
        attempts++;

        if (!cursor || accumulated.length >= WANTED_TRIP_PATTERNS) break;
      }

      setResult({ raw: latestRaw, tripPatterns: accumulated });
      setNextPageCursor(cursor);
      setRunCount((c) => c + 1);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const onFromSelected = (feature: GeocoderFeature) => {
    setFromFeature(feature);
    const loc = featureToLocation(feature);
    setQueryText((prev) => patchQueryLocation(prev, 'from', loc));
  };

  const onToSelected = (feature: GeocoderFeature) => {
    setToFeature(feature);
    const loc = featureToLocation(feature);
    setQueryText((prev) => patchQueryLocation(prev, 'to', loc));
  };

  const onTransportModeFilterChanged = (filterState: string[] | null) => {
    setTransportModeFilterState(filterState);
    const modesBlock = transportModeFilterData
      ? buildModesGraphQL(transportModeFilterData, filterState)
      : null;
    setQueryText((prev) => patchQueryModes(prev, modesBlock));
  };

  const onQueryTextChange = (text: string) => {
    setQueryText(text);
    const { from, to } = parseLocationsFromQuery(text);
    setFromFeature(from);
    setToFeature(to);
  };

  const toggleDevMode = () => {
    setCookie(DEV_MODE_COOKIE_NAME, 'false', { path: '/' });
    window.location.reload();
  };

  const handleRun = () => runQuery(queryText);

  const handleRestoreDefaults = () => {
    const defaultQuery = buildDefaultInlinedQuery(fragments);
    setQueryText(defaultQuery);
    setFromFeature(locationToFeature(DEFAULT_FROM));
    setToFeature(locationToFeature(DEFAULT_TO));
    setTransportModeFilterState(null);
    setFilterResetNonce((n) => n + 1);
  };

  const handleLoadMore = async () => {
    if (!nextPageCursor) return;
    const cursorQuery = injectPageCursor(queryText, nextPageCursor);
    setQueryText(cursorQuery);
    setLoadingMore(true);
    try {
      const response = await fetch('/api/dev/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: cursorQuery, variables: {} }),
      });
      const data = await response.json();
      const cursor = (data.raw as any)?.data?.trip?.nextPageCursor ?? null;
      setNextPageCursor(cursor);
      setResult((prev) => ({
        raw: data.raw,
        tripPatterns: [
          ...(prev?.tripPatterns ?? []),
          ...(data.tripPatterns ?? []),
        ],
      }));
    } catch {
      // ignore
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <DefaultLayout {...props} title="Dev: Trip Pattern">
      <div className={style.container}>
        <div className={style.statusBar}>
          <span className={style.statusLabel}>Dev mode:</span>
          <span className={style.statusEnabled}>ENABLED</span>
          <button
            className={`${style.button} ${style.buttonSecondary}`}
            onClick={toggleDevMode}
          >
            Disable
          </button>
        </div>

        <div className={style.section}>
          <span className={style.label}>Locations</span>
          <div className={style.searchRow}>
            <Search
              label="From"
              placeholder="Search origin..."
              onChange={onFromSelected}
              selectedItem={fromFeature}
              autocompleteFocusPoint={toFeature}
            />
            <Search
              label="To"
              placeholder="Search destination..."
              onChange={onToSelected}
              selectedItem={toFeature}
              autocompleteFocusPoint={fromFeature}
            />
          </div>
        </div>

        {transportModeFilterData && (
          <details className={style.section}>
            <summary className={style.label}>Transport modes</summary>
            <div className={style.transportModeFilter}>
              <TransportModeFilter
                key={filterResetNonce}
                filterState={transportModeFilterState}
                data={transportModeFilterData}
                onChange={onTransportModeFilterChanged}
              />
            </div>
          </details>
        )}

        <details className={style.section} open>
          <summary className={style.label}>Query</summary>
          <GraphQLEditor
            value={queryText}
            onChange={onQueryTextChange}
            schema={schema}
          />
        </details>

        <div className={style.controls}>
          <button
            className={`${style.button} ${style.buttonPrimary}`}
            onClick={handleRun}
            disabled={loading}
          >
            {loading ? 'Running…' : 'Run'}
          </button>
          <button
            className={`${style.button} ${style.buttonSecondary}`}
            onClick={handleRestoreDefaults}
          >
            Restore defaults
          </button>
        </div>

        {result && (
          <>
            {result.tripPatterns && result.tripPatterns.length > 0 && (
              <div className={style.section}>
                <span className={style.label}>Trip patterns</span>
                <div className={style.tripPatterns}>
                  {result.tripPatterns.map((tripPattern, i) => {
                    const zones = getTripPatternZones(tripPattern);
                    return (
                      <div
                        key={`${runCount}-${i}-${tripPattern.compressedQuery}`}
                      >
                        <TripPattern
                          tripPattern={tripPattern}
                          delay={i * 0.05}
                          index={i}
                        />
                        {zones.length > 0 && (
                          <div className={style.zonesPassed}>
                            <span>Zones passed:</span>
                            {zones.map((zone) => (
                              <span key={zone.id}>
                                {zone.name
                                  ? `${zone.name} (${zone.id})`
                                  : zone.id}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {nextPageCursor && (
                  <button
                    className={`${style.button} ${style.buttonPrimary}`}
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    style={{ alignSelf: 'center', marginTop: '0.5rem' }}
                  >
                    {loadingMore ? 'Loading…' : 'Load more departures'}
                  </button>
                )}
              </div>
            )}

            <details className={style.rawResponse} open>
              <summary>Raw response</summary>
              <div style={{ position: 'relative' }}>
                <button
                  className={`${style.button} ${style.buttonSecondary}`}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    zIndex: 1,
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.75rem',
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      JSON.stringify(result.raw, null, 2),
                    );
                  }}
                >
                  Copy
                </button>
                <JsonEditor
                  value={JSON.stringify(result.raw, null, 2)}
                  readOnly
                />
              </div>
            </details>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default DevTripPatternPage;

export const getServerSideProps: GetServerSideProps = withGlobalData(
  async function (ctx) {
    if (ctx.req.cookies[DEV_MODE_COOKIE_NAME] !== 'true') {
      return { notFound: true };
    }

    // Extract fragments from the generated query
    const fullQuery = print(TripsWithDetailsDocument);
    const fragmentStart = fullQuery.indexOf('fragment ');
    const fragments = fragmentStart >= 0 ? fullQuery.slice(fragmentStart) : '';

    return {
      props: {
        defaultGqlQuery: buildDefaultInlinedQuery(fragments),
        fragments,
      },
    };
  },
);
