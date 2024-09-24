import { TranslatedString } from '@atb/translations';
import { commonEvents } from '../commoneEvents';

export type ReasonForTransportFailure = { id: string; name: TranslatedString };

const TravelGuaranteeSpecificFormEvents = {} as
  | { type: 'TAXI' }
  | { type: 'CAR' }
  | { type: 'OTHER' }
  | {
      type: 'TOGGLE';
      field: 'isIntialAgreementChecked' | 'hasInternationalBankAccount';
    }
  | {
      type: 'ON_INPUT_CHANGE';
      field: 'kilometersDriven' | 'reasonForTransportFailure';
      value: string | ReasonForTransportFailure;
    }
  | { type: 'SET_STATE_SUBMITTED'; stateSubmitted: string | undefined };

export const TravelGuaranteeFormEvents = {} as
  | typeof TravelGuaranteeSpecificFormEvents
  | typeof commonEvents;
