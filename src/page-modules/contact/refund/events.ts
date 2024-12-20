import { TranslatedString } from '@atb/translations';
import { commonEvents } from '../commoneEvents';
import {
  FormCategory,
  RefundAndTravelGuarantee,
  RefundTicketForm,
} from './refundFormMachine';

export type ReasonForTransportFailure = { id: string; name: TranslatedString };
export type TicketType = { id: string; name: TranslatedString };

const RefundSpecificFormEvents = {} as
  | {
      type: 'ON_INPUT_CHANGE';
      inputName:
        | 'formType'
        | 'kilometersDriven'
        | 'fromAddress'
        | 'toAddress'
        | 'amount'
        | 'reasonForTransportFailure'
        | 'orderId'
        | 'customerNumber'
        | 'ticketType'
        | 'travelCardNumber'
        | 'refundReason'
        | 'isInitialAgreementChecked'
        | 'hasInternationalBankAccount'
        | 'showInputTravelCardNumber';
      value: string | boolean | ReasonForTransportFailure | TicketType;
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

export const RefundFormEvents = {} as
  | typeof RefundSpecificFormEvents
  | typeof commonEvents;
