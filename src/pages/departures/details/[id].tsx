import DefaultLayout from '@atb/layouts/default';
import type { WithGlobalData } from '@atb/layouts/global-data';
import { withGlobalData } from '@atb/layouts/global-data';
import { NextPage } from 'next';
import {
  DeparturesDetails,
  DeparturesDetailsProps,
} from '@atb/page-modules/departures/details';
import { withDepartureClient } from '@atb/page-modules/departures/server';

export type DeparturesDetailsPageProps = WithGlobalData<DeparturesDetailsProps>;
const DeparturesDetailsPage: NextPage<DeparturesDetailsPageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <DeparturesDetails {...props} />
    </DefaultLayout>
  );
};

export default DeparturesDetailsPage;

export const getServerSideProps = withGlobalData(
  withDepartureClient<DeparturesDetailsProps, { id: string[] | undefined }>(
    async function ({ client, params, query }) {
      if (!params?.id || !query.date || !query.fromQuayId) {
        return {
          notFound: true,
        };
      }
      const id = params.id.toString();
      const date = new Date(query.date.toString());
      const fromQuayId = query.fromQuayId.toString();

      const serviceJourney = await client.serviceJourney({
        id,
        date,
      });

      return {
        props: { fromQuayId, serviceJourney: serviceJourney },
      };
    },
  ),
);
