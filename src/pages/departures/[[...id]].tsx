import DefaultLayout from '@atb/layouts/default';
import type { WithGlobalData } from '@atb/layouts/global-data';
import type { NextPage } from 'next';
import { withGlobalData } from '@atb/layouts/global-data';
import { useRouter } from 'next/router';
import DeparturesLayout, {
  DeparturesLayoutProps,
} from '@atb/page-modules/departures/layout';
import { withDepartureClient } from '@atb/page-modules/departures/server';
import { DepartureData } from '@atb/page-modules/departures';
import _ from 'lodash';

function DeparturesContent({ departures }: DeparturesContentProps) {
  const router = useRouter();

  if (!departures && !router.query.id) {
    return null;
  }

  return (
    <div>
      <h3>Query: {router.query.id}</h3>
      <h3>
        Stop Place: {departures?.stopPlace?.name} ({departures?.stopPlace?.id})
      </h3>
      {departures?.quays?.map((q) => (
        <div key={q.id}>
          <h3>
            {q.name} {q.publicCode}
          </h3>
        </div>
      ))}
    </div>
  );
}

type DeparturesContentProps = {
  departures?: DepartureData;
};

export type DeparturesPageProps = WithGlobalData<
  DeparturesLayoutProps & DeparturesContentProps
>;
const DeparturesPage: NextPage<DeparturesPageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <DeparturesLayout {...props}>
        <DeparturesContent {...props} />
      </DeparturesLayout>
    </DefaultLayout>
  );
};

export default DeparturesPage;

export const getServerSideProps = withGlobalData<DeparturesContentProps>(
  withDepartureClient<DeparturesContentProps>(async function ({
    client,
    query,
  }) {
    const id = _.first(query.id);

    if (!id) {
      return { props: {} };
    }

    const departures: DepartureData = await client.departures({ id });

    return {
      props: {
        departures,
      },
    };
  }),
);
