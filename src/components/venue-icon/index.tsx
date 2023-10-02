import { ComponentText, useTranslation } from '@atb/translations';
import { MonoIcon } from '@atb/assets/mono-icon';

export default function VenueIcon({
  category,
  multiple,
}: {
  category: FeatureCategory[];
  multiple?: boolean;
}) {
  const venueIconTypes = getVenueIconTypes(category);

  if (!venueIconTypes.length) {
    return <MonoIcon src="map/Pin.svg" key="unknown" />;
  }

  if (multiple) {
    return (
      <>
        {venueIconTypes.map((it) => (
          <IconComponent iconType={it} key={it} />
        ))}
      </>
    );
  }

  return <IconComponent iconType={venueIconTypes[0]} />;
}

export enum FeatureCategory {
  ONSTREET_BUS = 'onstreetBus',
  ONSTREET_TRAM = 'onstreetTram',
  AIRPORT = 'airport',
  RAIL_STATION = 'railStation',
  METRO_STATION = 'metroStation',
  BUS_STATION = 'busStation',
  COACH_STATION = 'coachStation',
  TRAM_STATION = 'tramStation',
  HARBOUR_PORT = 'harbourPort',
  FERRY_PORT = 'ferryPort',
  FERRY_STOP = 'ferryStop',
  LIFT_STATION = 'liftStation',
  VEHICLE_RAIL_INTERCHANGE = 'vehicleRailInterchange',
  GROUP_OF_STOP_PLACES = 'GroupOfStopPlaces',
  POI = 'poi',
  VEGADRESSE = 'Vegadresse',
  STREET = 'street',
  TETTSTEDDEL = 'tettsteddel',
  BYDEL = 'bydel',
  OTHER = 'other',
}

type VenueIconType = 'bus' | 'tram' | 'rail' | 'airport' | 'boat' | 'unknown';
function IconComponent({ iconType }: { iconType: VenueIconType }) {
  const { t } = useTranslation();
  switch (iconType) {
    case 'bus':
      return (
        <MonoIcon
          src="transportation-entur/Bus.svg"
          key="bus"
          role="img"
          alt={t(ComponentText.VenueIcon.bus)}
        />
      );
    case 'tram':
      return (
        <MonoIcon
          src="transportation-entur/Tram.svg"
          key="tram"
          role="img"
          alt={t(ComponentText.VenueIcon.tram)}
        />
      );
    case 'rail':
      return (
        <MonoIcon
          src="transportation-entur/Train.svg"
          key="rail"
          role="img"
          alt={t(ComponentText.VenueIcon.rail)}
        />
      );
    case 'airport':
      return (
        <MonoIcon
          src="transportation-entur/Plane.svg"
          key="airport"
          role="img"
          alt={t(ComponentText.VenueIcon.air)}
        />
      );
    case 'boat':
      return (
        <MonoIcon
          src="transportation-entur/Ferry.svg"
          key="boat"
          role="img"
          alt={t(ComponentText.VenueIcon.water)}
        />
      );
    case 'unknown':
    default:
      return (
        <MonoIcon
          src="map/Pin.svg"
          key="unknown"
          role="img"
          alt={t(ComponentText.VenueIcon.unknown)}
        />
      );
  }
}

function getVenueIconTypes(category: FeatureCategory[]): VenueIconType[] {
  return category
    .map(mapLocationCategoryToVenueType)
    .filter((v, i, arr) => arr.indexOf(v) === i); // get distinct values
}

function mapLocationCategoryToVenueType(
  category: FeatureCategory,
): VenueIconType {
  switch (category) {
    case 'onstreetBus':
    case 'busStation':
    case 'coachStation':
      return 'bus';
    case 'onstreetTram':
    case 'tramStation':
      return 'tram';
    case 'railStation':
    case 'metroStation':
      return 'rail';
    case 'airport':
      return 'airport';
    case 'harbourPort':
    case 'ferryPort':
    case 'ferryStop':
      return 'boat';
    default:
      return 'unknown';
  }
}
