import { commonEvents } from '../commoneEvents';
import { Line } from '..';
import { FormType } from './means-of-transport-form-machine';

const meansOfTransportSpecificFormEvents = {} as
  | {
      type: 'ON_INPUT_CHANGE';
      inputName: 'formType' | 'isResponseWanted' | 'stop';
      value: string | boolean | Line['quays'][0] | undefined;
    }
  | {
      type: 'SELECT_FORM_TYPE';
      formType: FormType;
    }
  | {
      type: 'SUBMIT';
      orderedFormFieldNames: string[];
    };

export const meansOfTransportFormEvents = {} as
  | typeof meansOfTransportSpecificFormEvents
  | typeof commonEvents;
