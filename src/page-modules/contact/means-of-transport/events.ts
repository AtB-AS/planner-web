import { TranslatedString } from '@atb/translations';
import { commonEvents } from '../commoneEvents';

export type Area = { id: string; name: TranslatedString };

const meansOfTransportSpecificFormEvents = {} as {
  type: 'ON_INPUT_CHANGE';
  inputName: 'area' | 'formType' | 'wantsToBeContacted';
  value: Area | string | boolean;
};

export const meansOfTransportFormEvents = {} as
  | typeof meansOfTransportSpecificFormEvents
  | typeof commonEvents;
