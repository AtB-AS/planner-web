import { parseFilterQuery } from '@atb/components/transport-mode-filter/utils';
import DefaultLayout from '@atb/layouts/default';
import { type WithGlobalData, withGlobalData } from '@atb/layouts/global-data';
import { withAssistantClient } from '@atb/page-modules/assistant/server';
import type { TripData, NonTransitTripData } from '@atb/page-modules/assistant';
import {
  StreetMode,
  TripPattern,
  parseLayerQueryString,
  AssistantLayout,
  AssistantLayoutProps,
} from '@atb/page-modules/assistant';
import type { NextPage } from 'next';
import { NonTransitTrip } from '@atb/page-modules/assistant/non-transit-pill';

import style from '@atb/page-modules/assistant/assistant.module.css';

type AssistantContentProps =
  | { empty: true }
  | { trip: TripData; nonTransitTrips: NonTransitTripData };

export type AssistantPageProps = WithGlobalData<
  AssistantLayoutProps & AssistantContentProps
>;

function AssistantContent(props: AssistantContentProps) {
  if (isTripDataProps(props)) {
    const nonTransits = Object.entries(props.nonTransitTrips);
    return (
      <div className={style.tripResults}>
        {nonTransits.length > 0 && (
          <div className={style.nonTransitResult}>
            {Object.entries(props.nonTransitTrips).map(([legType, trip]) => (
              <NonTransitTrip
                key={legType}
                tripPattern={trip.tripPatterns[0]}
                nonTransitType={legType as keyof NonTransitTripData}
              />
            ))}
          </div>
        )}
        {props.trip.tripPatterns.map((tripPattern, i) => (
          <TripPattern
            key={`tripPattern-${tripPattern.expectedStartTime}-${i}`}
            tripPattern={tripPattern}
            index={i}
          />
        ))}
      </div>
    );
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

        const nonTransitTrips = await client.nonTransitTrips({
          from: initialFromFeature,
          to: initialToFeature,
          arriveBy: Boolean(arriveBy),
          when,
          directModes: [StreetMode.Foot, StreetMode.Bicycle],
        });

        return {
          props: {
            initialFromFeature,
            initialToFeature,
            initialTransportModesFilter: transportModeFilter,
            trip,
            nonTransitTrips,
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
