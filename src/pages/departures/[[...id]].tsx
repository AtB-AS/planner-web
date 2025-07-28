import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';
import {
  DeparturesLayout,
  type DeparturesLayoutProps,
  NearestStopPlaces,
  type NearestStopPlacesProps,
  StopPlace,
} from '@atb/page-modules/departures';
import { fetchFromDepartureQuery } from '@atb/page-modules/departures/fetch-departure-query';
import { withDepartureClient } from '@atb/page-modules/departures/server';
import {
  ExtendedDeparturesType,
  FromDepartureQuery,
} from '@atb/page-modules/departures/types';
import { PageText, TranslatedString } from '@atb/translations';
import type { NextPage } from 'next';
import { encode } from 'querystring';
import { withAccessLogging } from '@atb/modules/logging';

type DeparturesStopPlaceProps = {
  stopPlace: true;
  fromQuery: FromDepartureQuery;
  departures?: ExtendedDeparturesType;
};

type DeparturesContentProps =
  | { empty: true; fromQuery: FromDepartureQuery }
  | (DeparturesStopPlaceProps & { stopPlace: true })
  | (NearestStopPlacesProps & { address: true });

function DeparturesRouting(props: DeparturesContentProps) {
  if (isNearestStopPlacesProps(props)) {
    return (
      <NearestStopPlaces
        fromQuery={props.fromQuery}
        nearestStopPlaces={props.nearestStopPlaces}
      />
    );
  } else if ('stopPlace' in props && props.departures) {
    return <StopPlace departures={props.departures} />;
  }
}

function isNearestStopPlacesProps(a: any): a is NearestStopPlacesProps {
  return 'address' in a;
}

export type DeparturesPageProps = WithGlobalData<
  DeparturesLayoutProps & DeparturesContentProps
>;
const DeparturesPage: NextPage<DeparturesPageProps> = (props) => {
  return (
    <DefaultLayout {...props} title={getDepartureTitle(props)}>
      <DeparturesLayout {...props}>
        <DeparturesRouting {...props} />
      </DeparturesLayout>
    </DefaultLayout>
  );
};

function getDepartureTitle(
  props: DeparturesPageProps,
): TranslatedString | string {
  if (isNearestStopPlacesProps(props)) {
    return props.fromQuery.from?.name
      ? PageText.Departures.titleAddress(props.fromQuery.from?.name)
      : PageText.Departures.title;
  } else if ('stopPlace' in props) {
    return props.departures?.stopPlace.name
      ? PageText.Departures.titleStopp(props.departures?.stopPlace.name)
      : PageText.Departures.title;
  }

  return PageText.Departures.title;
}

export default DeparturesPage;

export const getServerSideProps = withAccessLogging(
  withGlobalData(
    withDepartureClient<
      DeparturesLayoutProps & DeparturesContentProps,
      { id: string[] | undefined }
    >(async function ({ client, params, query }) {
      if (query?.id && !params?.id) {
        const id = query.id;
        delete query.id;
        return {
          redirect: {
            destination: `/departures/${id}?${encode(query)}`,
            permanent: false,
          },
        };
      }
      const fromQuery = await fetchFromDepartureQuery(
        params?.id,
        query,
        client,
      );
      if (!fromQuery.isAddress && fromQuery.from) {
        const departures = await client.departures({
          id: fromQuery.from.id,
          date:
            fromQuery.searchTime.mode !== 'now'
              ? fromQuery.searchTime.dateTime
              : null,
        });

        return {
          props: {
            stopPlace: true,
            departures,
            fromQuery,
          },
        };
      } else if (fromQuery.isAddress && fromQuery.from) {
        const input = {
          lon: fromQuery.from.geometry.coordinates[0],
          lat: fromQuery.from.geometry.coordinates[1],
        };

        const nearestStopPlaces = await client.nearestStopPlaces(input);

        return {
          props: {
            address: true,
            nearestStopPlaces,
            fromQuery,
          },
        };
      } else {
        return {
          props: { empty: true, fromQuery },
        };
      }
    }),
  ),
);
