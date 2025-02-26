import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, type WithGlobalData } from '@atb/layouts/global-data';
import {
  AssistantLayout,
  type AssistantLayoutProps,
  fetchFromToTripQuery,
  type FromToTripQuery,
  Trip,
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
