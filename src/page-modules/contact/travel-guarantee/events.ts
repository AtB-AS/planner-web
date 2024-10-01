import { TranslatedString } from '@atb/translations';
import { commonEvents } from '../commoneEvents';

export type ReasonForTransportFailure = { id: string; name: TranslatedString };

const TravelGuaranteeSpecificFormEvents = {} as
  | {
      type: 'ON_INPUT_CHANGE';
      inputName:
        | 'formType'
        | 'kilometersDriven'
        | 'fromAddress'
        | 'toAddress'
        | 'reasonForTransportFailure'
        | 'isIntialAgreementChecked'
        | 'hasInternationalBankAccount';
      value: string | boolean | ReasonForTransportFailure;
    }
  | { type: 'SET_STATE_SUBMITTED'; stateSubmitted: string | undefined };

export const TravelGuaranteeFormEvents = {} as
  | typeof TravelGuaranteeSpecificFormEvents
  | typeof commonEvents;
