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
        if (
          !params?.id ||
          !query.date ||
          (!query.fromStopPosition && !query.fromQuayId)
        ) {
          return {
            notFound: true,
          };
        }
        const id = params.id.toString();
        const date = new Date(query.date.toString());
        let fromStopPosition = Number(query.fromStopPosition);
        let toStopPosition = query.toStopPosition
          ? Number(query.toStopPosition)
          : undefined;

        // Temporary: Backwards compatibility for links with quay ids
        if (!query.fromStopPosition) {
          const journey = await client.serviceJourney({ id, date });
          if (!journey) {
            return { notFound: true };
          }
          const { estimatedCalls } = journey;
          fromStopPosition =
            estimatedCalls.find((c) => c.quay.id === query.fromQuayId)
              ?.stopPositionInPattern ?? 0;
          toStopPosition = estimatedCalls.find(
            (c) =>
              c.quay.id === query.toQuayId &&
              c.stopPositionInPattern > fromStopPosition,
          )?.stopPositionInPattern;
        }

        const serviceJourney = await client.serviceJourney({
          id,
          date,
          fromStopPosition,
          toStopPosition,
        });

        if (!serviceJourney) {
          return { notFound: true };
        }

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
