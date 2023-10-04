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
    async function ({ client, params }) {
      const id = params?.id?.[0];

      if (id) {
        const departures = await client.departures({ id });
        return {
          props: {
            stopPlace: true,
            departures,
          },
        };
      } else {
        const autocompleteFeatures =
          await client.autocomplete('Fylkeshusa Molde');

        const data = autocompleteFeatures[0];

        if (!data) {
          // TODO fix notFound
          return {
            props: {
              stopPlace: true,
            },
          };
        }

        const [lon, lat] = data.geometry.coordinates;
        const nearestStopPlaces = await client.nearestStopPlaces({
          lat,
          lon,
        });

        return {
          props: {
            address: true,
            activeLocation: data,
            nearestStopPlaces,
          },
        };
      }
    },
  ),
);
