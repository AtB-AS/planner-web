import { TranslatedString } from '@atb/translations';
import { commonEvents } from '../commoneEvents';
import {
  FormCategory,
  RefundAndTravelGuarantee,
  RefundTicketForm,
} from './travelGuaranteeFormMachine';

export type ReasonForTransportFailure = { id: string; name: TranslatedString };

const TravelGuaranteeSpecificFormEvents = {} as
  | {
      type: 'ON_INPUT_CHANGE';
      inputName:
        | 'formType'
        | 'kilometersDriven'
        | 'fromAddress'
        | 'toAddress'
        | 'amount'
        | 'reasonForTransportFailure'
        | 'isInitialAgreementChecked'
        | 'hasInternationalBankAccount';
      value: string | boolean | ReasonForTransportFailure;
    }
  | { type: 'SET_STATE_SUBMITTED'; stateSubmitted: string | undefined }
  | {
      type: 'SELECT_FORM_CATEGORY';
      formCategory: FormCategory;
    }
  | {
      type: 'SELECT_REFUND_TICKET_FORM';
      refundTicketForm: RefundTicketForm;
    }
  | {
      type: 'SELECT_REFUND_AND_TRAVEL_GUARANTEE_FORM';
      refundAndTravelGuarantee: RefundAndTravelGuarantee;
    }
  | {
      type: 'SUBMIT';
    };

export const TravelGuaranteeFormEvents = {} as
  | typeof TravelGuaranteeSpecificFormEvents
  | typeof commonEvents;
