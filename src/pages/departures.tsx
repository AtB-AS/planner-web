import DefaultLayout from '@atb/layouts/default';
import type { WithGlobalData } from '@atb/layouts/global-data';
import { withGlobalData } from '@atb/layouts/global-data';
import type { AutocompleteFeature } from '@atb/page-modules/departures';
import { useAutocomplete } from '@atb/page-modules/departures/client';
import { withDepartureClient } from '@atb/page-modules/departures/server';
import { CommonText, useTranslation } from '@atb/translations';
import type { NextPage } from 'next';
import { useState } from 'react';

type DeparturesContentProps = {
  autocompleteFeatures: AutocompleteFeature[];
};

function DeparturesContent({ autocompleteFeatures }: DeparturesContentProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const result = useAutocomplete(query);

  return (
    <div>
      <h1>{t(CommonText.Titles.siteTitle)}</h1>
      <input type="text" onChange={(e) => setQuery(e.currentTarget.value)} />

      {autocompleteFeatures.map((f, i) => (
        <div key={i}>{f.name}</div>
      ))}

      {result.data && (
        <>
          <h3>Search:</h3>
          {result.data.map((f, i) => (
            <div key={i}>{f.name}</div>
          ))}
        </>
      )}
    </div>
  );
}

type DeparturesProps = WithGlobalData<DeparturesContentProps>;
const Departures: NextPage<DeparturesProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <DeparturesContent {...props} />
    </DefaultLayout>
  );
};

export default Departures;

export const getServerSideProps = withGlobalData<DeparturesContentProps>(
  withDepartureClient(async function ({ client }) {
    const result = await client.autocomplete('Kongens gate');

    return {
      props: {
        autocompleteFeatures: result,
      },
    };
  }),
);
