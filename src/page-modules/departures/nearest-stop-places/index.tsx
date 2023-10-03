import { Map } from '@atb/components/map';
import type {
  GeocoderFeature,
  NearestStopPlacesData,
} from '@atb/page-modules/departures';
import Link from 'next/link';
import type { StopPlaceWithDistance } from '..';

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
        {nearestStopPlaces.map((item) => (
          <li key={item.stopPlace.id}>
            <StopPlaceItem item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export type StopPlaceItemProps = {
  item: StopPlaceWithDistance;
};
export default function StopPlaceItem({ item }: StopPlaceItemProps) {
  return (
    <Link
      href={`/departures/${item.stopPlace.id}`}
      className={style.stopPlaceItem}
    >
      <h3>{item.stopPlace.name}</h3>
      <span>Holdeplass</span>
      <span>{item.distance.toFixed(0)} m</span>
    </Link>
  );
}
