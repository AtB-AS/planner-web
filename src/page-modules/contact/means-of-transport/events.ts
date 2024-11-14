import { commonEvents } from '../commoneEvents';
import { Line } from '..';

const meansOfTransportSpecificFormEvents = {} as {
  type: 'ON_INPUT_CHANGE';
  inputName: 'formType' | 'isResponseWanted' | 'stop';
  value: string | boolean | Line['quays'][0] | undefined;
};

export const meansOfTransportFormEvents = {} as
  | typeof meansOfTransportSpecificFormEvents
  | typeof commonEvents;
