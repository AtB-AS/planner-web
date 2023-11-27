import { MapWithHeader } from '@atb/modules/map';
import { GeocoderFeature } from '../types';
import {
  NearestStopPlacesData,
  StopPlaceWithDistance,
} from '../server/journey-planner';
import Link from 'next/link';
import style from './nearest-stop-places.module.css';
import { Typo } from '@atb/components/typography';
import { useRouter } from 'next/router';
import VenueIcon, { FeatureCategory } from '@atb/components/venue-icon';
import { PageText, useTranslation } from '@atb/translations';
import EmptyMessage from '@atb/components/empty-message';
import { SituationOrNoticeIcon } from '@atb/modules/situations';

export type NearestStopPlacesProps = {
  activeLocation: GeocoderFeature | undefined;
  nearestStopPlaces: NearestStopPlacesData;
};

export function NearestStopPlaces({
  nearestStopPlaces,
  activeLocation,
}: NearestStopPlacesProps) {
  const { t } = useTranslation();
  const router = useRouter();

  if (nearestStopPlaces.length === 0) {
    return (
      <EmptyMessage
        title={t(
          PageText.Departures.nearest.emptySearchResults
            .emptyNearbyLocationsTitle,
        )}
        details={t(
          PageText.Departures.nearest.emptySearchResults
            .emptyNearbyLocationsDetails,
        )}
      />
    );
  }
  return (
    <section className={style.nearestContainer}>
      <div className={style.mapContainer}>
        {activeLocation && (
          <MapWithHeader
            id={activeLocation.id}
            name={activeLocation.name}
            layer="address"
            position={{
              lon: activeLocation.geometry.coordinates[0],
              lat: activeLocation.geometry.coordinates[1],
            }}
            onSelectStopPlace={(stopPlaceId) =>
              router.push(`/departures/${stopPlaceId}`)
            }
          />
        )}
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
  const { t } = useTranslation();

  return (
    <Link
      href={`/departures/${item.stopPlace.id}`}
      className={style.stopPlaceItem}
      title={t(
        PageText.Departures.nearest.stopPlaceItem.uuTitle(
          item.stopPlace.name,
          item.distance.toFixed(0),
        ),
      )}
    >
      <div className={style.stopPlaceItem__text}>
        <Typo.h3 textType="body__primary--bold">{item.stopPlace.name}</Typo.h3>
        <Typo.span textType="body__secondary">
          {item.stopPlace.description ??
            t(PageText.Departures.nearest.stopPlaceItem.stopPlace)}
        </Typo.span>
        <Typo.span textType="body__secondary" className={style.secondaryText}>
          {item.distance.toFixed(0)} m
        </Typo.span>
      </div>

      <div className={style.stopPlaceItem__icon}>
        {item.stopPlace.situations.length > 0 && (
          <SituationOrNoticeIcon situations={item.stopPlace.situations} />
        )}
        <VenueIcon category={[FeatureCategory.BUS_STATION]} size="large" />
      </div>
    </Link>
  );
}
