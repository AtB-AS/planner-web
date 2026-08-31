import dictionary from '@atb/translations/dictionary';
import { TranslateFunction } from '@atb/translations';

export function humanizeDistance(
  distanceInMeters: number,
  t: TranslateFunction,
): string {
  const rounded = Math.round(distanceInMeters);
  if (rounded >= 1000) {
    return `${(rounded / 1000).toFixed(1)} ${t(dictionary.distance.km)}`;
  }
  return `${rounded} ${t(dictionary.distance.m)}`;
}
