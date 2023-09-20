import DefaultLayout from '@atb/layouts/default';
import { withGlobalData } from '@atb/layouts/global-data';
import { withDepartureClient } from '@atb/page-modules/departures';
import { CommonText, useTranslation } from '@atb/translations';
import type { WithGlobalData } from '@atb/layouts/global-data';
import type { AutocompleteFeature } from '@atb/page-modules/departures';
import type { NextPage } from 'next';

type DeparturesContentProps = {
  autocompleteFeatures: AutocompleteFeature[];
};

function DeparturesContent({ autocompleteFeatures }: DeparturesContentProps) {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t(CommonText.Titles.siteTitle)}</h1>

      {autocompleteFeatures.map((f) => (
        <div>{f.name}</div>
      ))}
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
