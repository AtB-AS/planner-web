import { TranslatedString } from '@atb/translations';
import { commonEvents } from '../commoneEvents';

export type ReasonForTransportFailure = { id: string; name: TranslatedString };

const TravelGuaranteeSpecificFormEvents = {} as
  | { type: 'TAXI' }
  | { type: 'CAR' }
  | { type: 'OTHER' }
  | {
      type: 'ON_INPUT_CHANGE';
      inputName:
        | 'kilometersDriven'
        | 'reasonForTransportFailure'
        | 'isIntialAgreementChecked'
        | 'hasInternationalBankAccount';
      value: string | boolean | ReasonForTransportFailure;
    }
  | { type: 'SET_STATE_SUBMITTED'; stateSubmitted: string | undefined };

export const TravelGuaranteeFormEvents = {} as
  | typeof TravelGuaranteeSpecificFormEvents
  | typeof commonEvents;
