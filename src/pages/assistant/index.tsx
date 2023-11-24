import DefaultLayout from '@atb/layouts/default';
import { type WithGlobalData, withGlobalData } from '@atb/layouts/global-data';
import { withAssistantClient } from '@atb/page-modules/assistant/server';
import {
  AssistantLayout,
  type AssistantLayoutProps,
  parseTripQuery,
  StreetMode,
  Trip,
  type TripData,
  type TripProps,
} from '@atb/page-modules/assistant';
import type { NextPage } from 'next';
import { parseSearchTimeQuery } from '@atb/modules/search-time';
import {
  getAllTransportModesFromFilterOptions,
  parseFilterQuery,
} from '@atb/modules/transport-mode';

type AssistantContentProps = { empty: true } | TripProps;

export type AssistantPageProps = WithGlobalData<
  AssistantLayoutProps & AssistantContentProps
>;

function AssistantContent(props: AssistantContentProps) {
  if (isTripDataProps(props)) {
    return <Trip {...props} />;
  }
}

function isTripDataProps(a: any): a is { trip: TripData } {
  return 'trip' in a;
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
      const tripQuery = parseTripQuery(query);
      if (tripQuery) {
        const [from, to] = await Promise.all([
          client.reverse(
            tripQuery.fromLat,
            tripQuery.fromLon,
            tripQuery.fromLayer,
          ),
          await client.reverse(
            tripQuery.toLat,
            tripQuery.toLon,
            tripQuery.toLayer,
          ),
        ]);
        const transportModeFilter = parseFilterQuery(tripQuery.filter);

        const searchTime = parseSearchTimeQuery(
          tripQuery.searchMode,
          tripQuery.searchTime,
        );

        if (from && to) {
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
              initialFromFeature: from,
              initialToFeature: to,
              initialTransportModesFilter: transportModeFilter,
              initialSearchTime: searchTime,
              trip,
              nonTransitTrips,
            },
          };
        }
      }
      return {
        props: {
          empty: true,
        },
      };
    },
  ),
);
