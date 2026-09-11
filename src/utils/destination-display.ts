import { TranslateFunction } from '@atb/translations';
import dictionary from '@atb/translations/dictionary';

export type DestinationDisplayType = {
  frontText?: string;
  via?: string[];
};

/**
 * Format a destination display as `"<frontText> via <A>, <B> og <C>"`, or just
 * the front text when there are no via-names.
 */
export function formatDestinationDisplay(
  t: TranslateFunction,
  destinationDisplay?: DestinationDisplayType,
): string | undefined {
  if (!destinationDisplay) return undefined;

  const frontText = destinationDisplay.frontText;
  // The generated types claim `via: string[]`, but the schema allows null
  // entries (codegen runs with `maybeValue: 'T'`). Drop them, or they would be
  // concatenated into the visible text as "null".
  const via = destinationDisplay.via?.filter(Boolean);

  if (!frontText) return undefined;
  if (!via || via.length < 1) return frontText;

  let viaNames = via[0];
  if (via.length > 1) {
    viaNames =
      via.slice(0, -1).join(', ') +
      ` ${t(dictionary.listConcatWord)} ` +
      via[via.length - 1];
  }

  return frontText + ` ${t(dictionary.via)} ` + viaNames;
}
