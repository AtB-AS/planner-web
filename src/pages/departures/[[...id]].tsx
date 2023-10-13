import DefaultLayout from '@atb/layouts/default';
import type { WithGlobalData } from '@atb/layouts/global-data';
import { withGlobalData } from '@atb/layouts/global-data';
import {
  DepartureData,
  NearestStopPlaces,
  NearestStopPlacesProps,
} from '@atb/page-modules/departures';
import DeparturesLayout, {
  DeparturesLayoutProps,
} from '@atb/page-modules/departures/layout';
import { withDepartureClient } from '@atb/page-modules/departures/server';
import { StopPlace } from '@atb/page-modules/departures/stop-place';
import type { NextPage } from 'next';
import { parseFilterQuery } from '@atb/components/transport-mode-filter/utils';
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

    if (id && stopPlace) {
      const departures = await client.departures({
        id,
        transportModes: transportModeFilter,
      });
      return {
        props: {
          stopPlace: true,
          departures,
          initialTransportModesFilter: transportModeFilter,
        },
      };
    } else if (query.lat && query.lon) {
      const position = {
        lat: parseFloat(query.lat.toString()),
        lon: parseFloat(query.lon.toString()),
      };
      const nearestStopPlaces = await client.nearestStopPlaces({
        ...position,
        transportModes: transportModeFilter,
      });

      const activeLocation = await client.reverse(position.lat, position.lon);

      return {
        props: {
          address: true,
          activeLocation,
          nearestStopPlaces,
          initialTransportModesFilter: transportModeFilter,
        },
      };
    } else {
      return {
        props: { empty: true },
      };
    }
  }),
);
