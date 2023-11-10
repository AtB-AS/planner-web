import { NoticeFragment, SituationFragment } from './types';
import { Statuses } from '@atb-as/theme';
import { ColorIcons } from '@atb/components/icon';
export const getMessageTypeForSituation = (situation: SituationFragment) =>
  situation.reportType === 'incident' ? 'warning' : 'info';

export const getMsgTypeForMostCriticalSituationOrNotice = (
  situations: SituationFragment[],
  notices?: NoticeFragment[],
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
  situations: SituationFragment[],
  notices?: NoticeFragment[],
  cancellation: boolean = false,
) => {
  const msgType = getMsgTypeForMostCriticalSituationOrNotice(
    situations,
    notices,
    cancellation,
  );
  return msgType && messageTypeToIcon(msgType);
};

const messageTypeToIcon = (messageType: Statuses): ColorIcons => {
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
