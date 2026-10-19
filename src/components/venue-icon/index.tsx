import { ComponentText, useTranslation } from '@atb/translations';
import { MonoIcon, MonoIconProps } from '@atb/components/icon';
import { FeatureCategory } from '@atb/modules/geocoder';
import { TransportIcon } from '@atb/modules/transport-mode';
import style from './venue-icon.module.css';
import { onlyUniques } from '@atb/utils/only-uniques';
import { TransportModeType, TransportSubmodeType } from '@atb-as/config-specs';
import { TransportSubmode } from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';

export type VenueIconProps = {
  categories: FeatureCategory[];
  size?: MonoIconProps['size'];
};

export default function VenueIcon({ categories, size }: VenueIconProps) {
  const { t } = useTranslation();
  const transportModes = getTransportModes(categories);

  if (!transportModes.length) {
    return (
      <MonoIcon
        icon="map/Pin"
        role="img"
        alt={t(ComponentText.VenueIcon.unknown)}
        size={size}
      />
    );
  }

  if (transportModes.length > 1) {
    return (
      <div className={style.multipleContainer}>
        {transportModes.map((mode) => (
          <TransportIcon
            key={mode}
            transportMode={mode}
            transportSubmode={getDefaultSubmode(mode)}
            size={size}
          />
        ))}
      </div>
    );
  }

  return (
    <TransportIcon
      transportMode={transportModes[0]}
      transportSubmode={getDefaultSubmode(transportModes[0])}
      size={size}
    />
  );
}

// The geocoder doesn't tell us which submodes serve a stop, so assume local
// bus to match the city color used for most bus legs in trip results.
function getDefaultSubmode(
  mode: TransportModeType,
): TransportSubmodeType | undefined {
  return mode === 'bus' ? TransportSubmode.LocalBus : undefined;
}

function getTransportModes(categories: FeatureCategory[]): TransportModeType[] {
  return categories
    .map(mapLocationCategoryToTransportMode)
    .filter((mode): mode is TransportModeType => mode !== undefined)
    .filter(onlyUniques);
}

function mapLocationCategoryToTransportMode(
  category: FeatureCategory,
): TransportModeType | undefined {
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
      return undefined;
  }
}
