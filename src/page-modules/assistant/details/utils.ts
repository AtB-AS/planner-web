import { TranslateFunction } from '@atb/translations';
import {
  DestinationDisplayType,
  formatDestinationDisplay,
} from '@atb/utils/destination-display';
import { Assistant } from '@atb/translations/pages';

export function formatQuayName(
  t: TranslateFunction,
  quayName?: string,
  publicCode?: string | null,
) {
  if (!quayName) return;
  if (!publicCode) return quayName;
  const prefix = t(Assistant.details.quayPublicCodePrefix);
  return `${quayName}${prefix ? prefix : ' '}${publicCode}`;
}

export function getPlaceName(
  t: TranslateFunction,
  placeName?: string,
  quayName?: string,
  publicCode?: string | null,
): string {
  const fallback = placeName ?? '';
  return quayName
    ? (formatQuayName(t, quayName, publicCode) ?? fallback)
    : fallback;
}

export function getLineDestinationName(
  t: TranslateFunction,
  destinationDisplay?: DestinationDisplayType,
  lineName?: string,
): string {
  return formatDestinationDisplay(t, destinationDisplay) ?? lineName ?? '';
}
