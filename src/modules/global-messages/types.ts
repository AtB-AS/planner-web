import { MessageMode } from '@atb/components/message-box';
import { LocalizedString } from '@atb/translations/commons';
import { Timestamp } from 'firebase/firestore';

export enum GlobalMessageContextEnum {
  plannerWebAssistant = 'planner-web-assistant',
}

export type GlobalMessageType = {
  id: string;
  active: boolean;
  title?: LocalizedString[];
  body: LocalizedString[];
  type: MessageMode;
  subtle?: boolean;
  context: GlobalMessageContextEnum[];
  isDismissable?: boolean;
  startDate?: Timestamp;
  endDate?: Timestamp;
};