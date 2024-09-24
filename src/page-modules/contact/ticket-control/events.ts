import { commonEvents } from '../commoneEvents';

const ticketControlSpecificFormEvents = {} as
  | {
      type: 'TOGGLE';
      inputName:
        | 'isAppTicketStorageMode'
        | 'agreesFirstAgreement'
        | 'agreesSecondAgreement'
        | 'hasInternationalBankAccount';
    }
  | {
      type: 'ON_INPUT_CHANGE';
      inputName:
        | 'feeNumber'
        | 'invoiceNumber'
        | 'appPhoneNumber'
        | 'customerNumber'
        | 'travelCardNumber';
      value: string;
    };

export const ticketControlFormEvents = {} as
  | typeof ticketControlSpecificFormEvents
  | typeof commonEvents;
