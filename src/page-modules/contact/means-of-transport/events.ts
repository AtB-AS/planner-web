import { TranslatedString } from '@atb/translations';
import { commonEvents } from '../commoneEvents';

export type Area = { id: string; name: TranslatedString };

const meansOfTransportSpecificFormEvents = {} as
  | {
      type: 'TOGGLE';
      field: 'wantsToBeContacted';
    }
  | {
      type: 'ON_INPUT_CHANGE';
      field: 'area' | 'formType';
      value: Area | string;
    };

export const meansOfTransportFormEvents = {} as
  | typeof meansOfTransportSpecificFormEvents
  | typeof commonEvents;
