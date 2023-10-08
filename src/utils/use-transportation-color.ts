import {
  TransportMode,
  TransportSubmode,
} from '@atb/components/transport-mode/types';
import { useTheme } from '@atb/modules/theme';
import { TransportColor } from '@atb/modules/theme';

export function useTransportationColor(
  mode?: TransportMode,
  subMode?: TransportSubmode,
  colorType: 'background' | 'text' = 'background',
  colorMode: 'primary' | 'secondary' = 'primary',
): string {
  const themeColor = useThemeColorForTransportMode(mode, subMode);
  const theme = useTheme();
  return theme.transport[themeColor][colorMode][colorType];
}

export const useThemeColorForTransportMode = (
  mode?: TransportMode,
  subMode?: TransportSubmode,
): TransportColor => {
  switch (mode) {
    case 'bus':
    case 'coach':
      if (subMode === 'localBus') return 'transport_city';
      if (subMode === 'airportLinkBus') return 'transport_airport_express';
      return 'transport_region';
    case 'rail':
      if (subMode === 'airportLinkRail') return 'transport_airport_express';
      return 'transport_train';
    case 'tram':
      return 'transport_city';
    case 'water':
      return 'transport_boat';
    case 'air':
      return 'transport_plane';
    case 'metro':
      return 'transport_train';
    default:
      return 'transport_other';
  }
};
