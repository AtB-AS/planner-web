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
  differenceInCalendarDays,
} from 'date-fns';
import en from 'date-fns/locale/en-GB';
import nb from 'date-fns/locale/nb';
import nn from 'date-fns/locale/nn';
import humanizeDuration from 'humanize-duration';
import { DEFAULT_LANGUAGE, Language } from '../translations';
import dictionary from '@atb/translations/dictionary';
import { TFunc } from '@leile/lobo-t';
import { FALLBACK_LANGUAGE } from '@atb/translations/commons';

const humanizer = humanizeDuration.humanizer({});
const CET = 'Europe/Oslo';

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

/**
 * date-fns also has a rounding function, `roundToNearestMinutes`, but it
 * doesn't work correctly: https://github.com/date-fns/date-fns/issues/3129
 *
 * TODO: Replace with date-fns `roundToNearestMinutes`
 */
function roundMinute(date: Date, roundingMethod: RoundingMethod) {
  // Round based on minutes (60000 milliseconds)
  const coeff = 1000 * 60;

  switch (roundingMethod) {
    case 'nearest':
      return new Date(Math.round(date.getTime() / coeff) * coeff);
    case 'ceil':
      return new Date(Math.ceil(date.getTime() / coeff) * coeff);
    case 'floor':
      return new Date(Math.floor(date.getTime() / coeff) * coeff);
  }
}

export type RoundingMethod = 'ceil' | 'floor' | 'nearest';

export function formatToClock(
  isoDate: string | Date,
  language: Language,
  roundingMethod: RoundingMethod = 'floor',
  showSeconds?: boolean,
) {
  const parsed = parseIfNeeded(isoDate);
  const cet = setTimezoneIfNeeded(parsed);
  const rounded = !showSeconds ? roundMinute(cet, roundingMethod) : cet;
  const seconds = showSeconds ? ':' + format(cet, 'ss') : '';

  return formatLocaleTime(rounded, language) + seconds;
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
export function formatToSimpleDate(date: Date | string, language: Language) {
  return format(parseIfNeeded(date), 'do MMMM', {
    locale: languageToLocale(language),
  });
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
export function formatToWeekday(
  date: Date | string,
  language: Language,
  dateFormat?: string,
) {
  return format(parseIfNeeded(date), dateFormat ? dateFormat : 'EEEEEE', {
    locale: languageToLocale(language),
  });
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
export function daysBetween(start: string | Date, end: string | Date) {
  return differenceInCalendarDays(parseIfNeeded(end), parseIfNeeded(start));
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

export function formatTripDuration(
  originalDepartureTimeISO: string,
  originalArrivalTimeISO: string,
  language: Language,
) {
  const regex = /T(\d{2}:\d{2}):\d{2}\+/;
  const departure = formatToClock(originalDepartureTimeISO, language, 'floor');
  const arrival = formatToClock(originalArrivalTimeISO, language, 'ceil');

  const departureTime = originalDepartureTimeISO.replace(
    regex,
    `T${departure}:00+`,
  );
  const arrivalTime = originalArrivalTimeISO.replace(regex, `T${arrival}:00+`);

  const duration = secondsToDuration(
    secondsBetween(departureTime, arrivalTime),
    language,
  );

  return { duration, departure, arrival };
}

export function setTimezoneIfNeeded(date: Date): Date {
  if (Intl.DateTimeFormat().resolvedOptions().timeZone === CET) return date;
  return new Date(date.toLocaleString(FALLBACK_LANGUAGE, { timeZone: CET }));
}

export function formatCETToLocal(localTime: number) {
  const offset = getOffsetTimezone();
  return localTime + 3600000 * (offset - 1);
}

export function formatLocalTimeToCET(cet: number) {
  const offset = getOffsetTimezone();
  return cet - 3600000 * (offset - 1);
}

function getOffsetTimezone() {
  return (-1 * new Date().getTimezoneOffset()) / 60;
}
