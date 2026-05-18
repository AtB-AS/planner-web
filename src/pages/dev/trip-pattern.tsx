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
import dynamic from 'next/dynamic';
import style from './trip-pattern.module.css';

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

const DevTripPatternPage: NextPage<DevTripPatternPageProps> = (props) => {
  const { defaultGqlQuery, fragments } = props;

  const [fromFeature, setFromFeature] = useState<GeocoderFeature | undefined>(
    locationToFeature(DEFAULT_FROM),
  );
  const [toFeature, setToFeature] = useState<GeocoderFeature | undefined>(
    locationToFeature(DEFAULT_TO),
  );
  const [queryText, setQueryText] = useState(defaultGqlQuery);
  const [result, setResult] = useState<{
    raw: unknown;
    tripPatterns?: ExtendedTripPatternWithDetailsType[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageCursor, setNextPageCursor] = useState<string | null>(null);
  const [runCount, setRunCount] = useState(0);
  const [schema, setSchema] = useState<GraphQLSchema | undefined>(undefined);

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
      const response = await fetch('/api/dev/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: {} }),
      });
      const data = await response.json();
      setResult(data);
      const cursor = (data.raw as any)?.data?.trip?.nextPageCursor ?? null;
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
  };

  const handleLoadMore = async () => {
    if (!nextPageCursor) return;
    // Remove any existing pageCursor, then inject the new one
    const withoutCursor = queryText.replace(/\s*pageCursor:\s*"[^"]*"\n?/, '');
    const cursorQuery = withoutCursor.replace(
      /trip\s*\(/,
      `trip(\n    pageCursor: "${nextPageCursor}"`,
    );
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
                  {result.tripPatterns.map((tripPattern, i) => (
                    <TripPattern
                      key={`${runCount}-${i}-${tripPattern.compressedQuery}`}
                      tripPattern={tripPattern}
                      delay={i * 0.05}
                      index={i}
                    />
                  ))}
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
