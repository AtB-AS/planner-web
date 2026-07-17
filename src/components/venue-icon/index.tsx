import { ComponentText, useTranslation } from '@atb/translations';
import { MonoIcon, MonoIconProps } from '@atb/components/icon';
import { FeatureCategory } from '@atb/modules/geocoder';
import style from './venue-icon.module.css';
import { onlyUniques } from '@atb/utils/only-uniques';

export type VenueIconProps = {
  categories: FeatureCategory[];
} & Omit<MonoIconProps, 'icon'>;

export default function VenueIcon({ categories, ...props }: VenueIconProps) {
  const venueIconTypes: VenueIconType[] = getVenueIconTypes(categories);

  if (!venueIconTypes.length) {
    return <MonoIcon icon="map/Pin" key="unknown" {...props} />;
  }

  if (venueIconTypes.length > 1) {
    return (
      <div className={style.multipleContainer}>
        {venueIconTypes.map((it) => (
          <IconComponent iconType={it} key={it} {...props} />
        ))}
      </div>
    );
  }

  return <IconComponent iconType={venueIconTypes[0]} {...props} />;
}

function isFeatureCategory(categories: any): categories is FeatureCategory[] {
  return categories.every((c: FeatureCategory) =>
    Object.values(FeatureCategory).includes(c),
  );
}

type VenueIconType =
  | 'bus'
  | 'tram'
  | 'rail'
  | 'air'
  | 'water'
  | 'metro'
  | 'unknown';
type IconComponentProps = {
  iconType: VenueIconType;
} & Omit<MonoIconProps, 'icon'>;
function IconComponent({ iconType, ...props }: IconComponentProps) {
  const { t } = useTranslation();
  switch (iconType) {
    case 'bus':
      return (
        <MonoIcon
          icon="transportation/BusFill"
          key="bus"
          role="img"
          alt={t(ComponentText.VenueIcon.bus)}
          {...props}
        />
      );
    case 'tram':
      return (
        <MonoIcon
          icon="transportation/TramFill"
          key="tram"
          role="img"
          alt={t(ComponentText.VenueIcon.tram)}
          {...props}
        />
      );
    case 'rail':
      return (
        <MonoIcon
          icon="transportation/TrainFill"
          key="rail"
          role="img"
          alt={t(ComponentText.VenueIcon.rail)}
          {...props}
        />
      );
    case 'air':
      return (
        <MonoIcon
          icon="transportation/PlaneFill"
          key="airport"
          role="img"
          alt={t(ComponentText.VenueIcon.air)}
          {...props}
        />
      );
    case 'water':
      return (
        <MonoIcon
          icon="transportation/FerryFill"
          key="boat"
          role="img"
          alt={t(ComponentText.VenueIcon.water)}
          {...props}
        />
      );
    case 'metro':
      return (
        <MonoIcon
          icon="transportation/MetroFill"
          key="metro"
          role="img"
          alt={t(ComponentText.VenueIcon.metro)}
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
  return category.map(mapLocationCategoryToVenueType).filter(onlyUniques);
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
      return 'rail';
    case 'airport':
      return 'air';
    case 'harbourPort':
    case 'ferryPort':
    case 'ferryStop':
      return 'water';
    case 'metroStation':
      return 'metro';
    default:
      return 'unknown';
  }
}
