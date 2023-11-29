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

type AssistantContentProps = { tripQuery: FromToTripQuery } | TripProps;

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
    async function ({ client, query }) {
      const tripQuery = await fetchFromToTripQuery(query, client);

      if (!tripQuery.from || !tripQuery.to) {
        return {
          props: {
            tripQuery,
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
