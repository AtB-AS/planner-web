import { commonEvents } from '../commoneEvents';
import { FormType } from './ticket-control-form-machine';

const ticketControlSpecificFormEvents = {} as
  | {
      type: 'ON_INPUT_CHANGE';
      inputName:
        | 'formType'
        | 'feeNumber'
        | 'invoiceNumber'
        | 'appPhoneNumber'
        | 'customerNumber'
        | 'travelCardNumber'
        | 'isAppTicketStorageMode'
        | 'agreesFirstAgreement'
        | 'agreesSecondAgreement'
        | 'hasInternationalBankAccount'
        | 'dateOfTicketControl'
        | 'timeOfTicketControl';
      value: string | boolean;
    }
  | {
      type: 'SELECT_FORM_TYPE';
      formType: FormType;
    }
  | {
      type: 'SUBMIT';
    };
export const ticketControlFormEvents = {} as
  | typeof ticketControlSpecificFormEvents
  | typeof commonEvents;
