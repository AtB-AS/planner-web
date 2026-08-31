import { capitalize } from 'lodash';
import { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';
import { Language, TranslateFunction } from '@atb/translations';
import dictionary from '@atb/translations/dictionary.ts';
import { daysBetween, formatToSimpleDate } from '@atb/utils/date';
import { getQuayOrPlaceName } from '../../utils.ts';

export function getTripFromToNames(
  tripPattern: ExtendedTripPatternWithDetailsType,
  t: TranslateFunction,
) {
  const firstLeg = tripPattern.legs[0];
  const fromLeg =
    firstLeg?.mode === 'foot' && tripPattern.legs[1]
      ? tripPattern.legs[1]
      : firstLeg;
  const toLeg = tripPattern.legs[tripPattern.legs.length - 1];

  return {
    fromName: getQuayOrPlaceName(
      t,
      fromLeg?.fromPlace.quay,
      fromLeg?.fromPlace.name,
    ),
    toName: getQuayOrPlaceName(t, toLeg?.toPlace.quay, toLeg?.toPlace.name),
  };
}

export function getDayPrefixedStartLabel(
  startTime: string,
  startTimeLabel: string,
  includeDayInfo: boolean,
  language: Language,
  t: TranslateFunction,
) {
  if (!includeDayInfo) return startTimeLabel;

  const daysDifference = daysBetween(new Date(), startTime);
  if (daysDifference === 0) return startTimeLabel;

  const dayLabel =
    daysDifference === 1 || daysDifference === 2
      ? capitalize(t(dictionary.date.relativeDayNames(daysDifference)))
      : formatToSimpleDate(startTime, language);

  return `${dayLabel}, ${startTimeLabel}`;
}
