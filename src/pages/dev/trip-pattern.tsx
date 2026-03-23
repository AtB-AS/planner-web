import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';
import type { GetServerSideProps, NextPage } from 'next';
import { setCookie } from 'cookies-next';
import { useState } from 'react';
import { DEV_MODE_COOKIE_NAME } from '@atb/modules/cookies/constants';
import { TripsWithDetailsDocument } from '@atb/page-modules/assistant/journey-gql/trip-with-details.generated';
import { print } from 'graphql';
import TripPattern from '@atb/page-modules/assistant/trip/trip-pattern';
import type { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';
import type { GeocoderFeature } from '@atb/modules/geocoder';
import Search from '@atb/components/search';
import style from './trip-pattern.module.css';

type DevTripPatternPageProps = WithGlobalData<{
  defaultGqlQuery: string;
  defaultGqlVariables: string;
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

function parseFeaturesFromVariablesText(text: string): {
  from: GeocoderFeature | undefined;
  to: GeocoderFeature | undefined;
} {
  try {
    const vars = JSON.parse(text);
    return {
      from: vars.from?.place ? locationToFeature(vars.from) : undefined,
      to: vars.to?.place ? locationToFeature(vars.to) : undefined,
    };
  } catch {
    return { from: undefined, to: undefined };
  }
}

function patchVariablesText(
  text: string,
  patch: { from?: VariablesLocation; to?: VariablesLocation },
): string {
  try {
    const vars = JSON.parse(text);
    return JSON.stringify({ ...vars, ...patch }, null, 2);
  } catch {
    return text;
  }
}

const DevTripPatternPage: NextPage<DevTripPatternPageProps> = (props) => {
  const { defaultGqlQuery, defaultGqlVariables } = props;

  const initialFeatures = parseFeaturesFromVariablesText(defaultGqlVariables);
  const [fromFeature, setFromFeature] = useState<GeocoderFeature | undefined>(
    initialFeatures.from,
  );
  const [toFeature, setToFeature] = useState<GeocoderFeature | undefined>(
    initialFeatures.to,
  );
  const [queryText, setQueryText] = useState(defaultGqlQuery);
  const [variablesText, setVariablesText] = useState(defaultGqlVariables);
  const [result, setResult] = useState<{
    raw: unknown;
    tripPatterns?: ExtendedTripPatternWithDetailsType[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [variablesError, setVariablesError] = useState<string | null>(null);

  const onFromSelected = (feature: GeocoderFeature) => {
    setFromFeature(feature);
    setVariablesText((prev) =>
      patchVariablesText(prev, { from: featureToLocation(feature) }),
    );
  };

  const onToSelected = (feature: GeocoderFeature) => {
    setToFeature(feature);
    setVariablesText((prev) =>
      patchVariablesText(prev, { to: featureToLocation(feature) }),
    );
  };

  const onVariablesTextChange = (text: string) => {
    setVariablesText(text);
    const { from, to } = parseFeaturesFromVariablesText(text);
    if (from) setFromFeature(from);
    if (to) setToFeature(to);
  };

  const toggleDevMode = () => {
    setCookie(DEV_MODE_COOKIE_NAME, 'false', { path: '/' });
    window.location.reload();
  };

  const handleRun = async () => {
    let variables: unknown;
    try {
      variables = JSON.parse(variablesText);
    } catch {
      setVariablesError('Invalid JSON in variables');
      return;
    }
    setVariablesError(null);
    setLoading(true);
    try {
      const response = await fetch('/api/dev/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText, variables }),
      });
      const data = await response.json();
      setResult(data);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreDefaults = () => {
    setQueryText(defaultGqlQuery);
    setVariablesText(defaultGqlVariables);
    setVariablesError(null);
    const features = parseFeaturesFromVariablesText(defaultGqlVariables);
    setFromFeature(features.from);
    setToFeature(features.to);
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

        <div className={style.section}>
          <label className={style.label}>Query</label>
          <textarea
            className={style.textarea}
            rows={20}
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            spellCheck={false}
          />
        </div>

        <div className={style.section}>
          <label className={style.label}>Variables (JSON)</label>
          <textarea
            className={style.textarea}
            rows={12}
            value={variablesText}
            onChange={(e) => onVariablesTextChange(e.target.value)}
            spellCheck={false}
          />
          {variablesError && (
            <span className={style.errorText}>{variablesError}</span>
          )}
        </div>

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
                      key={i}
                      tripPattern={tripPattern}
                      delay={i * 0.05}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            )}

            <details className={style.rawResponse}>
              <summary>Raw response</summary>
              <pre className={style.pre}>
                {JSON.stringify(result.raw, null, 2)}
              </pre>
            </details>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default DevTripPatternPage;

const DEFAULT_GQL_VARIABLES = {
  from: {
    place: 'NSR:StopPlace:41613',
    coordinates: { latitude: 63.4366, longitude: 10.3953 },
    name: 'Trondheim S',
  },
  to: {
    place: 'NSR:StopPlace:41742',
    coordinates: { latitude: 63.4295, longitude: 10.3928 },
    name: 'Nedre Elvehavn',
  },
  arriveBy: false,
  numTripPatterns: 3,
  waitReluctance: 1,
  walkReluctance: 4,
  transferPenalty: 10,
};

export const getServerSideProps: GetServerSideProps = withGlobalData(
  async function (ctx) {
    if (ctx.req.cookies[DEV_MODE_COOKIE_NAME] !== 'true') {
      return { notFound: true };
    }

    return {
      props: {
        defaultGqlQuery: print(TripsWithDetailsDocument),
        defaultGqlVariables: JSON.stringify(DEFAULT_GQL_VARIABLES, null, 2),
      },
    };
  },
);
