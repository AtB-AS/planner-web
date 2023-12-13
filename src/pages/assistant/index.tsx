import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, type WithGlobalData } from '@atb/layouts/global-data';
import { getAllTransportModesFromFilterOptions } from '@atb/modules/transport-mode';
import {
  AssistantLayout,
  fetchFromToTripQuery,
  StreetMode,
  Trip,
  type AssistantLayoutProps,
  type FromToTripQuery,
  type TripData,
  type TripProps,
} from '@atb/page-modules/assistant';
import { withAssistantClient } from '@atb/page-modules/assistant/server';
import type { NextPage } from 'next';

export type AssistantContentProps =
  | { tripQuery: FromToTripQuery; empty: true }
  | TripProps;

export type AssistantPageProps = WithGlobalData<
  AssistantLayoutProps & AssistantContentProps
>;

function AssistantContent(props: AssistantContentProps) {
  if (isTripDataProps(props)) {
    return <Trip {...props} />;
  }
}

function isTripDataProps(a: any): a is { trip: TripData } {
  return 'trip' in a && a.trip;
}

const AssistantPage: NextPage<AssistantPageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <AssistantLayout {...props}>
        <AssistantContent {...props} />
      </AssistantLayout>
    </DefaultLayout>
  );
};

export default AssistantPage;

export const getServerSideProps = withGlobalData(
  withAssistantClient<AssistantLayoutProps & AssistantContentProps>(
    async function ({ client, res, query }) {
      const tripQuery = await fetchFromToTripQuery(query, client);

      if (!tripQuery.from || !tripQuery.to) {
        res.setHeader(
          'Cache-Control',
          'public, s-maxage=60, stale-while-revalidate=360',
        );

        return {
          props: {
            tripQuery,
            empty: true,
          },
        };
      }

      const { from, to, searchTime, transportModeFilter } = tripQuery;

      const [trip, nonTransitTrips] = await Promise.all([
        client.trip({
          from,
          to,
          searchTime,
          transportModes:
            getAllTransportModesFromFilterOptions(transportModeFilter),
        }),
        client.nonTransitTrips({
          from,
          to,
          searchTime,
          directModes: [StreetMode.Foot, StreetMode.Bicycle],
        }),
      ]);

      res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59',
      );

      return {
        props: {
          tripQuery,
          trip,
          nonTransitTrips,
        },
      };
    },
  ),
);
