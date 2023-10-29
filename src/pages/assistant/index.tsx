import { parseFilterQuery } from '@atb/components/transport-mode-filter/utils';
import DefaultLayout from '@atb/layouts/default';
import { WithGlobalData, withGlobalData } from '@atb/layouts/global-data';
import AssistantLayout, {
  AssistantLayoutProps,
} from '@atb/page-modules/assistant/layout';
import { withAssistantClient } from '@atb/page-modules/assistant/server';
import { TripData } from '@atb/page-modules/assistant/server/journey-planner/validators';
import { NextPage } from 'next';
import { parseLayerQueryString } from '@atb/page-modules/assistant/utils';
import { TripPattern } from '@atb/page-modules/assistant/trip-pattern';

type AssistantContentProps = { empty: true } | { trip: TripData };

export type AssistantPageProps = WithGlobalData<
  AssistantLayoutProps & AssistantContentProps
>;

function AssistantContent(props: AssistantContentProps) {
  if (isTripDataProps(props)) {
    return props.trip.tripPatterns.map((tripPattern, i) => (
      <TripPattern
        key={`tripPattern-${tripPattern.expectedStartTime}-${i}`}
        tripPattern={tripPattern}
        index={i}
      />
    ));
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
      const transportModeFilter = parseFilterQuery(query.filter);

      let initialFromFeature;
      if (query.fromLat && query.fromLon && query.fromLayer) {
        const fromLat = parseFloat(query.fromLat.toString());
        const fromLon = parseFloat(query.fromLon.toString());
        const fromLayer = parseLayerQueryString(query.fromLayer.toString());

        initialFromFeature = await client.reverse(fromLat, fromLon, fromLayer);
      }

      let initialToFeature;
      if (query.toLat && query.toLon && query.toLayer) {
        initialToFeature = await client.reverse(
          parseFloat(query.toLat.toString()),
          parseFloat(query.toLon.toString()),
          parseLayerQueryString(query.toLayer.toString()),
        );
      }
      const arriveBy =
        query.arriveBy && new Date(Number(query.arriveBy.toString()));
      const departBy =
        query.departBy && new Date(Number(query.departBy.toString()));
      const when = arriveBy || departBy || new Date();

      if (initialFromFeature && initialToFeature) {
        const trip = await client.trip({
          from: initialFromFeature,
          to: initialToFeature,
          arriveBy: Boolean(arriveBy),
          when,
          transportModes: transportModeFilter,
        });

        return {
          props: {
            initialFromFeature,
            initialToFeature,
            initialTransportModesFilter: transportModeFilter,
            trip,
          },
        };
      }

      return {
        props: {
          empty: true,
        },
      };
    },
  ),
);
