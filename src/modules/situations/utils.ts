import { Notice, Situation } from './types';
import { Statuses } from '@atb-as/theme';
import { ColorIcons, MonoIcons } from '@atb/components/icon';
import { Language } from '@atb/translations';
import { getTextForLanguage } from '@atb/translations/utils';
import { daysBetween, isBetween } from '@atb/utils/date';
import { onlyUniquesBasedOnField } from '@atb/utils/only-uniques';
import { isAfter, isBefore } from 'date-fns';

export const getMessageTypeForSituation = (situation: Situation) =>
  situation.reportType === 'incident' ? 'warning' : 'info';

export const getMsgTypeForMostCriticalSituationOrNotice = (
  situations: Situation[],
  notices?: Notice[],
  cancellation: boolean = false,
): Statuses | undefined => {
  if (cancellation) return 'error';
  if (!situations.length) {
    return notices?.length ? 'info' : undefined;
  }
  return situations
    .map(getMessageTypeForSituation)
    .reduce(
      (mostCritical, msgType) =>
        msgType === 'warning' ? 'warning' : mostCritical,
      'info',
    );
};

export const getIconForMostCriticalSituationOrNotice = (
  situations: Situation[],
  notices?: Notice[],
  cancellation: boolean = false,
) => {
  const msgType = getMsgTypeForMostCriticalSituationOrNotice(
    situations,
    notices,
    cancellation,
  );
  return msgType && messageTypeToColorIcon(msgType);
};

export const messageTypeToColorIcon = (messageType: Statuses): ColorIcons => {
  switch (messageType) {
    case 'warning':
      return 'status/Warning';
    case 'error':
      return 'status/Error';
    case 'valid':
      return 'status/Check';
    default:
      return 'status/Info';
  }
};

export const messageTypeToMonoIcon = (messageType: Statuses): MonoIcons => {
  switch (messageType) {
    case 'warning':
      return 'status/Warning';
    case 'error':
      return 'status/Error';
    case 'valid':
      return 'status/Check';
    default:
      return 'status/Info';
  }
};

/**
 * Filter notices by removing duplicates (by id), removing those without text,
 * and also sorting them since the order from Entur may change on each request.
 */
export const filterNotices = (notices: Notice[]): Required<Notice>[] =>
  notices
    .filter((n): n is Required<Notice> => !!n.text)
    .filter(onlyUniquesBasedOnField('id'))
    .sort((s1, s2) => s1.id.localeCompare(s2.id));

/**
 * Get the situation summary, with a fallback to the description.
 */
export const getSituationSummary = (
  situation: Situation,
  language: Language,
): string | undefined => {
  let text = getTextForLanguage(situation.summary, language);
  if (!text) {
    text = getTextForLanguage(situation.description, language);
  }
  return text || undefined;
};

/**
 * If end time is further ahead than 1 year, than return undefined. This is
 * because some companies set an end time really far ahead (2050, 9999 etc.)
 * when they don't know when the situation message will end.
 */
export const validateEndTime = (endTime?: string) =>
  endTime && daysBetween(new Date(), endTime) <= 365 ? endTime : undefined;

/**
 * Check if a situation is valid at a specific date by comparing it to the
 * validity period of the situation. If the situation has neither start time nor
 * end time it will be considered valid at all times.
 *
 * This function uses currying of the date to enable inline use in filter
 * functions.
 */
export const isSituationValidAtDate =
  (date: string | Date = new Date()) =>
  (situation: Situation) => {
    const { startTime, endTime } = situation.validityPeriod || {};
    if (startTime && endTime) {
      return isBetween(date, startTime, endTime);
    } else if (startTime) {
      return isAfter(date, startTime);
    } else if (endTime) {
      return isBefore(date, endTime);
    }
    return true;
  };
