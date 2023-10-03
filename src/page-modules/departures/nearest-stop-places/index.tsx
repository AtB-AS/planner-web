import { Map } from '@atb/components/map';
import type {
  GeocoderFeature,
  NearestStopPlacesData,
} from '@atb/page-modules/departures';
import Link from 'next/link';
import { StopPlaceInfo } from '../server/journey-planner';

import style from './nearest-stop-places.module.css';

export type NearestStopPlacesProps = {
  activeLocation: GeocoderFeature;
  nearestStopPlaces: NearestStopPlacesData;
};

export function NearestStopPlaces({
  nearestStopPlaces,
  activeLocation,
}: NearestStopPlacesProps) {
  return (
    <section className={style.nearestContainer}>
      <div className={style.mapContainer}>
        <Map
          position={{
            lat: activeLocation.geometry.coordinates[1],
            lng: activeLocation.geometry.coordinates[0],
          }}
        />
      </div>

      <ul className={style.stopPlacesList}>
        {nearestStopPlaces.map((stopPlace) => (
          <li key={stopPlace.id}>
            <StopPlaceItem stopPlace={stopPlace} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export type StopPlaceItemProps = {
  stopPlace: StopPlaceInfo;
};
export default function StopPlaceItem({ stopPlace }: StopPlaceItemProps) {
  return <Link href={`/departures/${stopPlace.id}`}>{stopPlace.name}</Link>;
}
