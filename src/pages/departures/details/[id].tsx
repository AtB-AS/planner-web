import DefaultLayout from '@atb/layouts/default';
import { NextPage } from 'next';
import {
  DeparturesDetails,
  DeparturesDetailsProps,
} from '@atb/page-modules/departures/details';
import { withDepartureClient } from '@atb/page-modules/departures/server';
import { withAccessLogging } from '@atb/modules/logging';
import { type WithGlobalData, withGlobalData } from '@atb/modules/global-data';

export type DeparturesDetailsPageProps = WithGlobalData<DeparturesDetailsProps>;
const DeparturesDetailsPage: NextPage<DeparturesDetailsPageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <DeparturesDetails {...props} />
    </DefaultLayout>
  );
};

export default DeparturesDetailsPage;

export const getServerSideProps = withAccessLogging(
  withGlobalData(
    withDepartureClient<DeparturesDetailsProps, { id: string[] | undefined }>(
      async function ({ client, params, query }) {
        if (!params?.id || !query.date || !query.fromStopPosition) {
          return {
            notFound: true,
          };
        }
        const id = params.id.toString();
        const date = new Date(query.date.toString());
        const fromStopPosition = Number(query.fromStopPosition);
        const toStopPosition = query.toStopPosition
          ? Number(query.toStopPosition)
          : undefined;

        const serviceJourney = await client.serviceJourney({
          id,
          date,
          fromStopPosition,
          toStopPosition,
        });

        return {
          props: {
            fromStopPosition,
            serviceJourney: serviceJourney,
            ...(toStopPosition !== undefined ? { toStopPosition } : {}),
          },
        };
      },
    ),
  ),
);
