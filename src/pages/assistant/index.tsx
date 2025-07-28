import DefaultLayout from '@atb/layouts/default';
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
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';
import { withAccessLogging } from '@atb/modules/logging';

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

export const getServerSideProps = withAccessLogging(
  withGlobalData(
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
              fallback: potential.trip,
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
  ),
);
