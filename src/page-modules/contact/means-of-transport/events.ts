import { TranslatedString } from '@atb/translations';
import { commonEvents } from '../commoneEvents';
import { Line } from '..';

export type Area = { id: string; name: TranslatedString };

const meansOfTransportSpecificFormEvents = {} as {
  type: 'ON_INPUT_CHANGE';
  inputName: 'area' | 'formType' | 'isResponseWanted' | 'stop';
  value: Area | string | boolean | Line['quays'][0] | undefined;
};

export const meansOfTransportFormEvents = {} as
  | typeof meansOfTransportSpecificFormEvents
  | typeof commonEvents;
