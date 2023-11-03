import { TranslatedString } from '@atb/translations';
import dictionary from '@atb/translations/dictionary';
import { TransportModeType } from '@atb/components/transport-mode/types';

export function getTranslatedModeName(
  mode: TransportModeType | null,
): TranslatedString {
  const legModeNames = dictionary.travel.legModes;
  switch (mode) {
    case 'bus':
    case 'coach':
      return legModeNames.bus;
    case 'rail':
      return legModeNames.rail;
    case 'tram':
      return legModeNames.tram;
    case 'water':
      return legModeNames.water;
    case 'air':
      return legModeNames.air;
    case 'foot':
      return legModeNames.foot;
    case 'metro':
      return legModeNames.metro;
    case 'bicycle':
      return legModeNames.bicycle;
    default:
      return legModeNames.unknown;
  }
}
