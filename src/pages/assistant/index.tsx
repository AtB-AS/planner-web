import { parseFilterQuery } from '@atb/components/transport-mode-filter/utils';
import DefaultLayout from '@atb/layouts/default';
import { type WithGlobalData, withGlobalData } from '@atb/layouts/global-data';
import { withAssistantClient } from '@atb/page-modules/assistant/server';
import Trip, { TripProps } from '@atb/page-modules/assistant/trip';
import type { TripData } from '@atb/page-modules/assistant';
import {
  AssistantLayout,
  AssistantLayoutProps,
  parseTripQuery,
  StreetMode,
} from '@atb/page-modules/assistant';
import type { NextPage } from 'next';
import { parseSearchTimeQuery } from '@atb/modules/search-time/utils';

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
        const from = await client.reverse(
          tripQuery.fromLat,
          tripQuery.fromLon,
          tripQuery.fromLayer,
        );
        const to = await client.reverse(
          tripQuery.toLat,
          tripQuery.toLon,
          tripQuery.toLayer,
        );
        const transportModeFilter = parseFilterQuery(tripQuery.filter);

        const searchTime = parseSearchTimeQuery(
          tripQuery.searchMode,
          tripQuery.searchTime,
        );

        if (from && to) {
          const trip = await client.trip({
            from,
            to,
            searchTime,
            transportModes: transportModeFilter || undefined,
          });

          const nonTransitTrips = await client.nonTransitTrips({
            from,
            to,
            searchTime,
            directModes: [StreetMode.Foot, StreetMode.Bicycle],
          });

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
