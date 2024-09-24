import { commonEvents } from '../commoneEvents';

const ticketControlSpecificFormEvents = {} as
  | {
      type: 'TOGGLE';
      field:
        | 'isAppTicketStorageMode'
        | 'agreesFirstAgreement'
        | 'agreesSecondAgreement'
        | 'hasInternationalBankAccount';
    }
  | {
      type: 'ON_INPUT_CHANGE';
      field:
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
