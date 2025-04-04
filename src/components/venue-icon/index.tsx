import { ComponentText, useTranslation } from '@atb/translations';
import { MonoIcon, MonoIconProps } from '@atb/components/icon';

export type VenueIconProps = {
  categories: FeatureCategory[] | string[];
  multiple?: boolean;
} & Omit<MonoIconProps, 'icon'>;

export default function VenueIcon({
  categories,
  multiple,
  ...props
}: VenueIconProps) {
  let venueIconTypes: VenueIconType[] = [];

  if (isFeatureCategory(categories)) {
    venueIconTypes = getVenueIconTypes(categories);
  } else {
    venueIconTypes = categories as VenueIconType[];
  }

  if (!venueIconTypes.length) {
    return <MonoIcon icon="map/Pin" key="unknown" {...props} />;
  }

  if (multiple) {
    return (
      <>
        {venueIconTypes.map((it) => (
          <IconComponent iconType={it} key={it} {...props} />
        ))}
      </>
    );
  }

  return <IconComponent iconType={venueIconTypes[0]} {...props} />;
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

function isFeatureCategory(categories: any): categories is FeatureCategory[] {
  return categories.every((c: FeatureCategory) =>
    Object.values(FeatureCategory).includes(c),
  );
}

type VenueIconType = 'bus' | 'tram' | 'rail' | 'air' | 'water' | 'unknown';
type IconComponentProps = {
  iconType: VenueIconType;
} & Omit<MonoIconProps, 'icon'>;
function IconComponent({ iconType, ...props }: IconComponentProps) {
  const { t } = useTranslation();
  switch (iconType) {
    case 'bus':
      return (
        <MonoIcon
          icon="transportation-entur/Bus"
          key="bus"
          role="img"
          alt={t(ComponentText.VenueIcon.bus)}
          {...props}
        />
      );
    case 'tram':
      return (
        <MonoIcon
          icon="transportation-entur/Tram"
          key="tram"
          role="img"
          alt={t(ComponentText.VenueIcon.tram)}
          {...props}
        />
      );
    case 'rail':
      return (
        <MonoIcon
          icon="transportation-entur/Train"
          key="rail"
          role="img"
          alt={t(ComponentText.VenueIcon.rail)}
          {...props}
        />
      );
    case 'air':
      return (
        <MonoIcon
          icon="transportation-entur/Plane"
          key="airport"
          role="img"
          alt={t(ComponentText.VenueIcon.air)}
          {...props}
        />
      );
    case 'water':
      return (
        <MonoIcon
          icon="transportation-entur/Ferry"
          key="boat"
          role="img"
          alt={t(ComponentText.VenueIcon.water)}
          {...props}
        />
      );
    case 'unknown':
    default:
      return (
        <MonoIcon
          icon="map/Pin"
          key="unknown"
          role="img"
          alt={t(ComponentText.VenueIcon.unknown)}
          {...props}
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
      return 'air';
    case 'harbourPort':
    case 'ferryPort':
    case 'ferryStop':
      return 'water';
    default:
      return 'unknown';
  }
}
