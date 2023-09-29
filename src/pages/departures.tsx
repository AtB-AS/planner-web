import { Map, Position } from '@atb/components/map';
import Search from '@atb/components/search';
import DefaultLayout from '@atb/layouts/default';
import type { WithGlobalData } from '@atb/layouts/global-data';
import { withGlobalData } from '@atb/layouts/global-data';
import type {
  DeparturesData,
  GeocoderFeature,
} from '@atb/page-modules/departures';
import { useAutocomplete } from '@atb/page-modules/departures/client';
import { withDepartureClient } from '@atb/page-modules/departures/server';
import { CommonText, useTranslation } from '@atb/translations';
import type { NextPage } from 'next';
import { useState } from 'react';

type DeparturesContentProps = {
  autocompleteFeatures: GeocoderFeature[];
  departures?: DeparturesData;
};

function DeparturesContent({
  autocompleteFeatures,
  departures,
}: DeparturesContentProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const result = useAutocomplete(query);
  const [selectedPosition, setSelectedPosition] = useState<
    Position | undefined
  >();

  return (
    <>
      <div>
        <h1>{t(CommonText.Titles.siteTitle)}</h1>

        <Search label="Fra" onChange={console.log} />

        <input type="text" onChange={(e) => setQuery(e.currentTarget.value)} />

        {autocompleteFeatures.map((f, i) => (
          <div key={i}>
            {f.name} - {f.locality} | {f.category.join(', ')} | {f.layer}
          </div>
        ))}

        <h2>
          Stop Place: {departures?.stopPlace?.name} ({departures?.stopPlace?.id}
          )
        </h2>
        {departures?.stopPlace?.quays?.map((q) => (
          <div key={q.id}>
            <h3>
              {q.name} {q.publicCode}
            </h3>
          </div>
        ))}

        {result.data && (
          <>
            <h3>Search:</h3>
            {result.data.map((f, i) => (
              <div
                style={{ cursor: 'pointer' }}
                key={i}
                onClick={() => {
                  setSelectedPosition({
                    lat: f.geometry.coordinates[0],
                    lng: f.geometry.coordinates[1],
                  });
                }}
              >
                {f.name} - {f.locality} | {f.category.join(', ')} | {f.layer}
              </div>
            ))}
          </>
        )}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: '600px',
          marginTop: '2rem',
        }}
      >
        <div>Departures container</div>
        <Map position={selectedPosition} />
      </div>
    </>
  );
}

export type DeparturesPageProps = WithGlobalData<DeparturesContentProps>;
const DeparturesPage: NextPage<DeparturesPageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <DeparturesContent {...props} />
    </DefaultLayout>
  );
};

export default DeparturesPage;

export const getServerSideProps = withGlobalData<DeparturesContentProps>(
  withDepartureClient(async function ({ client }) {
    const result = await client.autocomplete('Kongens gate');
    const departures = await client.departures({ id: 'NSR:StopPlace:39382' });

    return {
      props: {
        autocompleteFeatures: result,
        departures,
      },
    };
  }),
);
