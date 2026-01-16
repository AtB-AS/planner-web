import { MapWithHeader } from '@atb/components/map';
import { FromDepartureQuery } from '../types';
import Link from 'next/link';
import style from './nearest-stop-places.module.css';
import { Typo } from '@atb/components/typography';
import { useRouter } from 'next/router';
import VenueIcon from '@atb/components/venue-icon';
import { PageText, useTranslation } from '@atb/translations';
import EmptyMessage from '@atb/components/empty-message';
import { SituationOrNoticeIcon } from '@atb/modules/situations';
import ScreenReaderOnly from '@atb/components/screen-reader-only';
import {
  OpenGraphDescription,
  OpenGraphImage,
} from '@atb/components/open-graph';
import { NearestStopPlaceType } from '@atb/page-modules/departures/types';

export type NearestStopPlacesProps = {
  fromQuery: FromDepartureQuery;
  nearestStopPlaces: NearestStopPlaceType[];
};

export function NearestStopPlaces({
  nearestStopPlaces,
  fromQuery,
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

  const pos = {
    lon: fromQuery.from?.geometry.coordinates[0]!,
    lat: fromQuery.from?.geometry.coordinates[1]!,
  };
  return (
    <section className={style.nearestContainer}>
      {fromQuery.from && (
        <>
          <OpenGraphImage
            image={`api/departures/og-location?lat=${pos.lat}&lon=${pos.lon}`}
          />
          {/* Hard coded to norwegian as this should be the default for sharing links where
            we dont know what language to show. */}
          <OpenGraphDescription
            description={`Se oversikt over alle stopp i nærheten av ${fromQuery.from?.name ?? ''}.`}
          />
        </>
      )}

      <ScreenReaderOnly
        text={t(
          PageText.Departures.nearest.resultsFound(nearestStopPlaces.length),
        )}
        role="status"
      />

      <ul className={style.stopPlacesList}>
        {nearestStopPlaces.map((item) => (
          <li key={item.stopPlace.id} data-testid="list-item-stop-place">
            <StopPlaceItem item={item} />
          </li>
        ))}
      </ul>

      <div className={style.mapContainer}>
        {fromQuery.from && (
          <MapWithHeader
            name={fromQuery.from.name}
            layer="address"
            position={pos}
            onSelectStopPlace={(stopPlaceId) =>
              router.push(`/departures/${stopPlaceId}`)
            }
          />
        )}
      </div>
    </section>
  );
}

export type StopPlaceItemProps = {
  item: NearestStopPlaceType;
};
export default function StopPlaceItem({ item }: StopPlaceItemProps) {
  const { t } = useTranslation();

  if (!item.distance) return null;

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
        <Typo.h3 textType="body__m__strong" testID="stopPlaceName">
          {item.stopPlace.name}
        </Typo.h3>
        <Typo.span textType="body__s">
          {item.stopPlace.description ??
            t(PageText.Departures.nearest.stopPlaceItem.stopPlace)}
        </Typo.span>
        <Typo.span textType="body__s" className={style.secondaryText}>
          {item.distance.toFixed(0)} m
        </Typo.span>
      </div>

      <div className={style.stopPlaceItem__icon}>
        {item.stopPlace.situations.length > 0 && (
          <SituationOrNoticeIcon situations={item.stopPlace.situations} />
        )}
        {item.stopPlace.transportMode?.map((mode: string) => (
          <VenueIcon key={item.stopPlace.id} categories={[mode]} size="large" />
        ))}
      </div>
    </Link>
  );
}
