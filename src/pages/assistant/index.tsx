import { parseFilterQuery } from '@atb/components/transport-mode-filter/utils';
import DefaultLayout from '@atb/layouts/default';
import { WithGlobalData, withGlobalData } from '@atb/layouts/global-data';
import AssistantLayout, {
  AssistantLayoutProps,
} from '@atb/page-modules/assistant/layout';
import { withAssistantClient } from '@atb/page-modules/assistant/server';
import { TripData } from '@atb/page-modules/assistant/server/journey-planner/validators';
import { useTranslation } from '@atb/translations';
import { formatLocaleTime } from '@atb/utils/date';
import { NextPage } from 'next';
import style from './assistant.module.css';
import { parseLayerQueryString } from '@atb/page-modules/assistant/utils';

type AssistantContentProps = { empty: true } | { trip: TripData };

export type AssistantPageProps = WithGlobalData<
  AssistantLayoutProps & AssistantContentProps
>;

function AssistantContent(props: AssistantContentProps) {
  const { language } = useTranslation();
  if (isTripDataProps(props)) {
    return (
      <section>
        {props.trip.tripPatterns.map((tripPattern, i) => (
          <div
            key={`tripPattern-${tripPattern.expectedStartTime}-${i}`}
            className={style.tripPattern}
          >
            {tripPattern.legs.map((leg, i) => (
              <div
                key={`leg-${leg.expectedStartTime}-${i}`}
                className={style.leg}
              >
                <span>{leg.mode ? leg.mode : 'foot'}</span>
                <span>{leg.line?.publicCode}</span>
                <span>
                  {leg.fromPlace.name} til {leg.toPlace.name}
                </span>
                <span>
                  {formatLocaleTime(leg.aimedStartTime, language)} -{' '}
                  {formatLocaleTime(leg.aimedEndTime, language)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </section>
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

      const arriveBy = query.arriveBy === 'true';
      const when = query.when
        ? new Date(Number(query.when.toString()))
        : new Date();

      if (initialFromFeature && initialToFeature) {
        const trip = await client.trip({
          from: initialFromFeature,
          to: initialToFeature,
          arriveBy,
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
