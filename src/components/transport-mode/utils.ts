import { ComponentText } from '@atb/translations';
import { TransportModeGroup } from './types';

export function transportModeToTranslatedString(mode: TransportModeGroup) {
  if (!ComponentText.TransportMode.modes[mode.mode]) {
    return ComponentText.TransportMode.modes.unknown;
  }
  return ComponentText.TransportMode.modes[mode.mode];
}
export function severalTransportModesToTranslatedStrings(
  modes: TransportModeGroup[],
) {
  return modes
    .map((mode) => ComponentText.TransportMode.modes[mode.mode])
    .filter(Boolean);
}
