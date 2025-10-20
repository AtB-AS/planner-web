import DefaultLayout from '@atb/layouts/default';
import {
  AssistantLayout,
  type AssistantLayoutProps,
  fetchFromToTripQuery,
  type FromToTripQuery,
  Trip,
  type TripProps,
} from '@atb/page-modules/assistant';
import {
  geocoderClient,
  journeyClient,
} from '@atb/page-modules/assistant/server';
import { getAssistantTripIfCached } from '@atb/page-modules/assistant/server/trip-cache';
import type { GetServerSideProps, NextPage } from 'next';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';
import { withAccessLogging } from '@atb/modules/logging';
import { getTransportModeFilter } from '@atb/modules/firebase/transport-mode-filter.ts';
import qs from 'query-string';
import { createTripQuery } from '@atb/page-modules/assistant/utils.ts';

export type AssistantContentProps =
  | { tripQuery: FromToTripQuery; empty: true }
  | TripProps;

export type AssistantPageProps = WithGlobalData<
  AssistantLayoutProps & AssistantContentProps
>;

function AssistantContent(props: AssistantContentProps) {
  if (!('empty' in props) && 'tripQuery' in props && props.tripQuery) {
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

function isMissingTransportModeFilter(tripQuery: FromToTripQuery): boolean {
  return (
    tripQuery.transportModeFilter === null ||
    tripQuery.transportModeFilter.length === 0
  );
}
async function getDefaultTransportModeFiltersString(): Promise<string> {
  const transportModeFilter = await getTransportModeFilter();
  if (transportModeFilter) {
    return `${qs.stringify(
      {
        filter: transportModeFilter
          .filter((option) => option.selectedAsDefault)
          .map((option) => option.id)
          .join(','),
      },
      { encode: true },
    )}`;
  }
  return '';
}

export const getServerSideProps = withAccessLogging(
  withGlobalData(async function ({ query }) {
    const tripQuery = await fetchFromToTripQuery(query, geocoderClient());

    if (isMissingTransportModeFilter(tripQuery)) {
      const defaultTransportModeFilter =
        await getDefaultTransportModeFiltersString;
      const urlTripQuery = createTripQuery(tripQuery);
      return {
        redirect: {
          destination: `/assistant?${defaultTransportModeFilter}&${qs.stringify(urlTripQuery, { encode: true })}`,
          permanent: false,
        },
      };
    }

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
  }),
);
