import { Notice, Situation } from './types';
import { ColorIcons, MonoIcons } from '@atb/components/icon';
import { Language } from '@atb/translations';
import { getTextForLanguage } from '@atb/translations/utils';
import { daysBetween } from '@atb/utils/date';
import { onlyUniquesBasedOnField } from '@atb/utils/only-uniques';
import { StatusColorName } from '@atb/modules/theme';

export const getMessageTypeForSituation = (situation: Situation) =>
  situation.reportType === 'incident' ? 'warning' : 'info';

export const getMsgTypeForMostCriticalSituationOrNotice = (
  situations: Situation[],
  notices?: Notice[],
  cancellation: boolean = false,
): StatusColorName | undefined => {
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

export const messageTypeToColorIcon = (messageType: StatusColorName): ColorIcons => {
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

export const messageTypeToMonoIcon = (messageType: StatusColorName): MonoIcons => {
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
