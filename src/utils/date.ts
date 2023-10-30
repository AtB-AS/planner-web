import {
  addDays,
  addMinutes,
  format,
  formatISO,
  isAfter,
  isBefore,
  isPast,
  isSameDay,
  Locale,
  parseISO,
  setMinutes,
  differenceInSeconds,
} from 'date-fns';
import en from 'date-fns/locale/en-GB';
import nb from 'date-fns/locale/nb';
import nn from 'date-fns/locale/nn';
import humanizeDuration from 'humanize-duration';
import { DEFAULT_LANGUAGE, Language } from '../translations';
import dictionary from '@atb/translations/dictionary';
import { TFunc } from '@leile/lobo-t';

const humanizer = humanizeDuration.humanizer({});

export function parseIfNeeded(a: string | Date): Date {
  return a instanceof Date ? a : parseISO(a);
}

export function maybeParseISO(a: string | undefined): Date | undefined {
  return !a ? undefined : parseISO(a);
}

export function formatToLongDateTime(
  isoDate: string | Date,
  language: Language,
) {
  const parsed = parseIfNeeded(isoDate);
  if (isSameDay(parsed, new Date())) {
    return formatToClock(parsed, language);
  }
  return format(parsed, 'PPp', { locale: languageToLocale(language) });
}
export function formatToAlwaysLongDateTime(
  isoDate: string | Date,
  language: Language,
) {
  const parsed = parseIfNeeded(isoDate);
  return format(parsed, 'PPp', { locale: languageToLocale(language) });
}

export function secondsToDurationShort(
  seconds: number,
  language: Language,
): string {
  return getShortHumanizer(seconds * 1000, language, {
    units: ['d', 'h', 'm'],
    round: true,
    conjunction: ' ',
  });
}

export function formatToShortDateWithYear(
  date: Date | string,
  language: Language,
) {
  return format(parseIfNeeded(date), 'dd.MM.yy', {
    locale: languageToLocale(language),
  });
}

function getLanguageCodeForHumanizeDuration(language: Language): string {
  // humanize-duration does not accept language code 'nn' or 'nb'.
  switch (language) {
    case Language.Norwegian:
      return 'no';
    case Language.English:
      return 'en';
    case Language.Nynorsk:
      return 'no';
  }
}

export function secondsToDuration(
  seconds: number,
  language: Language,
  opts?: humanizeDuration.Options,
): string {
  const currentLanguage = getLanguageCodeForHumanizeDuration(language);
  return humanizeDuration(seconds * 1000, {
    units: ['d', 'h', 'm'],
    round: true,
    language: currentLanguage,
    ...opts,
  });
}

export function secondsToDaysOrWeeks(
  seconds: number,
  language: Language,
  opts?: humanizeDuration.Options,
): string {
  const currentLanguage = getLanguageCodeForHumanizeDuration(language);
  return humanizeDuration(seconds * 1000, {
    units: ['w', 'd'],
    round: true,
    language: currentLanguage,
    ...opts,
  });
}

export function formatLocaleTime(date: Date | string, language: Language) {
  const lang = language ?? DEFAULT_LANGUAGE;
  switch (lang) {
    case Language.Norwegian:
      return format(parseIfNeeded(date), 'HH:mm');
    case Language.English:
      return format(parseIfNeeded(date), 'HH:mm');
    case Language.Nynorsk:
      return format(parseIfNeeded(date), 'HH:mm');
  }
}

export function formatToClock(isoDate: string | Date, language: Language) {
  const parsed = isoDate instanceof Date ? isoDate : parseISO(isoDate);
  return formatLocaleTime(parsed, language);
}

const languageToLocale = (language: Language): Locale => {
  switch (language) {
    case Language.Norwegian:
      return nb;
    case Language.English:
      return en;
    case Language.Nynorsk:
      return nn;
  }
};

export function formatToDate(date: Date | string, language: Language) {
  return format(parseIfNeeded(date), 'P', {
    locale: languageToLocale(language),
  });
}

export function formatToVerboseDateTime(
  date: Date | string,
  language: Language,
  t: TFunc<typeof Language>,
) {
  const at = t(dictionary.date.at);

  const dateString = format(parseIfNeeded(date), 'do MMMM', {
    locale: languageToLocale(language),
  });
  const timeString = format(parseIfNeeded(date), 'HH:mm', {
    locale: languageToLocale(language),
  });

  return `${dateString} ${at} ${timeString}`;
}

export function isInPast(date: Date | string) {
  return isPast(parseIfNeeded(date));
}

export function isOverDaysInFuture(date: Date | string, days: number) {
  return isAfter(parseIfNeeded(date), addDays(new Date(), days));
}

export function isBetween(
  date: Date | string,
  lowerLimit: Date | string,
  upperLimit: Date | string,
) {
  const dateObj = parseIfNeeded(date);
  return (
    isAfter(dateObj, parseIfNeeded(lowerLimit)) &&
    isBefore(dateObj, parseIfNeeded(upperLimit))
  );
}

export function formatToExpiredCard(date: Date | string) {
  return format(parseIfNeeded(date), 'MM/yy');
}

export function formatIso(isoDate: string | Date) {
  return formatISO(parseIfNeeded(isoDate));
}
export function formatIsoDate(isoDate: string | Date) {
  return formatISO(parseIfNeeded(isoDate), { representation: 'date' });
}
export function formatSimpleTime(isoDate: string | Date) {
  return format(parseIfNeeded(isoDate), 'HH:mm');
}
export function daysInFuture(days: number) {
  return addDays(new Date(), days);
}
export function closestHour() {
  return setMinutes(new Date(), 0);
}
export function dateTimeStringToDate(date: string, time: string) {
  return parseISO(`${date}T${time}`);
}
export function add1Minutes(date: Date) {
  return addMinutes(date, 1);
}
export function secondsBetween(
  start: string | Date,
  end: string | Date,
): number {
  const parsedStart = parseIfNeeded(start);
  const parsedEnd = parseIfNeeded(end);
  return differenceInSeconds(parsedEnd, parsedStart);
}
/**
 * Either show clock or relative time (X min) if below threshold specified by
 * second argument.
 *
 * @param isoDate date to format as clock or relative time
 * @param minuteLimit threshold in minutes for when to show relative time
 */

export function formatToClockOrRelativeMinutes(
  isoDate: string | Date,
  language: Language,
  nowText: string,
  minuteThreshold: number = 9,
) {
  const parsed = parseIfNeeded(isoDate);
  const diff = secondsBetween(new Date(), parsed);

  if (diff / 60 >= minuteThreshold) {
    return formatLocaleTime(parsed, language);
  }

  if (diff / 60 <= 1) {
    return nowText;
  }

  return secondsToMinutesShort(diff, language);
}
export function secondsToMinutesShort(
  seconds: number,
  language: Language,
): string {
  return getShortHumanizer(seconds * 1000, language, {
    units: ['m'],
    round: true,
  });
}
function getShortHumanizer(
  ms: number,
  language: Language,
  options?: humanizeDuration.Options,
) {
  const opts = {
    language: language === Language.English ? 'shortEn' : 'shortNo',
    languages: {
      shortNo: {
        y: () => 'år',
        mo: () => 'm',
        w: () => 'u',
        d: () => 'd',
        h: () => 't',
        m: () => 'min',
        s: () => 'sek',
        ms: () => 'ms',
      },
      shortEn: {
        y: () => 'y',
        mo: () => 'mo',
        w: () => 'w',
        d: () => 'd',
        h: () => 'h',
        m: () => 'min',
        s: () => 's',
        ms: () => 'ms',
      },
    },

    ...options,
  };

  return humanizer(ms, opts);
}
