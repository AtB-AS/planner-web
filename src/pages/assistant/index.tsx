import { parseFilterQuery } from '@atb/components/transport-mode-filter/utils';
import DefaultLayout from '@atb/layouts/default';
import { WithGlobalData, withGlobalData } from '@atb/layouts/global-data';
import AssistantLayout, {
  AssistantLayoutProps,
} from '@atb/page-modules/assistant/layout';
import { withAssistantClient } from '@atb/page-modules/assistant/server';
import { TripData } from '@atb/page-modules/assistant/server/journey-planner/validators';
import { NextPage } from 'next';
import Trip, { TripProps } from '@atb/page-modules/assistant/trip';
import { parseTripQuery } from '@atb/page-modules/assistant';

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

        if (from && to) {
          const trip = await client.trip({
            from,
            to,
            departureDate: tripQuery.departureDate,
            departureMode: tripQuery.departureMode,
            transportModes: transportModeFilter || undefined,
          });

          return {
            props: {
              initialFromFeature: from,
              initialToFeature: to,
              initialTransportModesFilter: transportModeFilter,
              trip,
              departureMode: tripQuery.departureMode,
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
