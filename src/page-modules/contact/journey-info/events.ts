import { commonEvents } from '../commoneEvents';

const journeyInfoSpecificFormEvents = {} as
  | {
      type: 'ON_INPUT_CHANGE';
      inputName: 'question';
      value: string | boolean;
    }
  | {
      type: 'ON_SET_STATE';
    }
  | {
      type: 'SUBMIT';
      orderedFormFieldNames: string[];
    };

export const journeyInfoFormEvents = {} as
  | typeof commonEvents
  | typeof journeyInfoSpecificFormEvents;
