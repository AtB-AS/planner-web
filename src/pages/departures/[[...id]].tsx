import DefaultLayout from '@atb/layouts/default';
import { type WithGlobalData, withGlobalData } from '@atb/layouts/global-data';
import {
  type DepartureData,
  DeparturesLayout,
  type DeparturesLayoutProps,
  NearestStopPlaces,
  type NearestStopPlacesProps,
  StopPlace,
} from '@atb/page-modules/departures';
import { withDepartureClient } from '@atb/page-modules/departures/server';
import type { NextPage } from 'next';
import {
  getAllTransportModesFromFilterOptions,
  parseFilterQuery,
} from '@atb/modules/transport-mode';
import { parseSearchTimeQuery } from '@atb/modules/search-time';

type DeparturesStopPlaceProps = {
  stopPlace: true;
  departures?: DepartureData;
};

type DeparturesContentProps =
  | { empty: true }
  | DeparturesStopPlaceProps
  | (NearestStopPlacesProps & { address: true });

function DeparturesRouting(props: DeparturesContentProps) {
  if (isNearestStopPlacesProps(props)) {
    return (
      <NearestStopPlaces
        activeLocation={props.activeLocation}
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
    <DefaultLayout {...props}>
      <DeparturesLayout {...props}>
        <DeparturesRouting {...props} />
      </DeparturesLayout>
    </DefaultLayout>
  );
};

export default DeparturesPage;

export const getServerSideProps = withGlobalData(
  withDepartureClient<
    DeparturesLayoutProps & DeparturesContentProps,
    { id: string[] | undefined }
  >(async function ({ client, params, query }) {
    const id = params?.id?.[0];
    const stopPlace = id ? await client.stopPlace({ id }) : null;
    const transportModeFilter = parseFilterQuery(query.filter);
    const searchTime = parseSearchTimeQuery(
      query.searchMode,
      query.searchTime ? Number(query.searchTime) : undefined,
    );

    if (id && stopPlace) {
      const departures = await client.departures({
        id,
        date: searchTime.mode !== 'now' ? searchTime.dateTime : null,
        transportModes:
          getAllTransportModesFromFilterOptions(transportModeFilter),
      });


      const initialFeature = await client.reverse(
        stopPlace.position.lat,
        stopPlace.position.lon,
        'venue',
      );

      return {
        props: {
          stopPlace: true,
          departures,
          initialTransportModesFilter: transportModeFilter,
          initialSearchTime: searchTime,
          initialFeature,
        },
      };
    } else if (query.lat && query.lon) {
      const position = {
        lat: parseFloat(query.lat.toString()),
        lon: parseFloat(query.lon.toString()),
      };
      const nearestStopPlaces = await client.nearestStopPlaces({
        ...position,
        transportModes:
          getAllTransportModesFromFilterOptions(transportModeFilter),
      });

      const activeLocation = await client.reverse(
        position.lat,
        position.lon,
        'address',
      );

      return {
        props: {
          address: true,
          activeLocation,
          nearestStopPlaces,
          initialTransportModesFilter: transportModeFilter,
          initialSearchTime: searchTime,
          initialFeature: activeLocation,
        },
      };
    } else {
      return {
        props: { empty: true },
      };
    }
  }),
);
