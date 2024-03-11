import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, type WithGlobalData } from '@atb/layouts/global-data';
import {
  AssistantLayout,
  fetchFromToTripQuery,
  Trip,
  type AssistantLayoutProps,
  type FromToTripQuery,
  type TripProps,
} from '@atb/page-modules/assistant';
import { withAssistantClient } from '@atb/page-modules/assistant/server';
import { getAssistantTripIfCached } from '@atb/page-modules/assistant/server/trip-cache';
import type { NextPage } from 'next';

export type AssistantContentProps =
  | { tripQuery: FromToTripQuery; empty: true }
  | TripProps;

export type AssistantPageProps = WithGlobalData<
  AssistantLayoutProps & AssistantContentProps
>;

function AssistantContent(props: AssistantContentProps) {
  if (!('empty' in props) && props.tripQuery) {
    return <Trip {...props} />;
  }
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
      const response = await fetch('http://localhost:3000/api/assistant/line');
      const linesData = await response.json();
      console.log('linesData', linesData);

      if (!tripQuery.from || !tripQuery.to) {
        return {
          props: {
            tripQuery,
            empty: true,
          },
        };
      }

      const potential = getAssistantTripIfCached(tripQuery);

      if (potential) {
        return {
          props: {
            tripQuery,
            fallback: potential,
          },
        };
      }

      return {
        props: {
          tripQuery,
        },
      };
    },
  ),
);
