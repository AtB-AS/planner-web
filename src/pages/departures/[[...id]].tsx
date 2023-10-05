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
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

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
  } else if ('stopPlace' in props) {
    return <SearchResultPage {...props} />;
  }
}

function isNearestStopPlacesProps(a: any): a is NearestStopPlacesProps {
  return 'address' in a;
}

function SearchResultPage({ departures }: DeparturesStopPlaceProps) {
  const router = useRouter();
  return (
    <div>
      <h3>Query: {router.query.id}</h3>
      <h3>
        Stop Place: {departures?.stopPlace?.name} ({departures?.stopPlace?.id})
      </h3>
      {departures?.quays?.map((q) => (
        <div key={q.id}>
          <h3>
            {q.name} {q.publicCode}
            <ul>
              {q.departures.map((d) => (
                <li key={d.id}>
                  {d.name} ({d.id})
                </li>
              ))}
            </ul>
          </h3>
        </div>
      ))}
    </div>
  );
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
  withDepartureClient<DeparturesContentProps, { id: string[] | undefined }>(
    async function ({ client, params, query }) {
      const id = params?.id?.[0];
      const stopPlace = id ? await client.departures({ id }) : null;
      if (id && stopPlace) {
        const departures = await client.departures({ id });
        return {
          props: {
            stopPlace: true,
            departures,
          },
        };
      } else if (query.lat && query.lon) {
        const position = {
          lat: parseFloat(query.lat.toString()),
          lon: parseFloat(query.lon.toString()),
        };
        const nearestStopPlaces = await client.nearestStopPlaces(position);

        const activeLocation = await client.reverse(position.lat, position.lon);

        return {
          props: {
            address: true,
            activeLocation,
            nearestStopPlaces,
          },
        };
      } else {
        return {
          props: { empty: true },
        };
      }
    },
  ),
);
