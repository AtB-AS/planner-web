import { commonEvents } from '../commoneEvents';
import { EditingState } from './tickets-app-form-machine';

const ticketsAppSpecificFormEvents = {} as
  | {
      type: 'ON_INPUT_CHANGE';
      inputName: 'formType';
      value: string;
    }
  | {
      type: 'ON_SET_STATE';
      target: EditingState;
    };

export const ticketsAppFormEvents = {} as
  | typeof commonEvents
  | typeof ticketsAppSpecificFormEvents;
