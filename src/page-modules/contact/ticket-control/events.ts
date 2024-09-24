import { commonEvents } from '../commoneEvents';

const ticketControlSpecificFormEvents = {} as {
  type: 'ON_INPUT_CHANGE';
  inputName:
    | 'feeNumber'
    | 'invoiceNumber'
    | 'appPhoneNumber'
    | 'customerNumber'
    | 'travelCardNumber'
    | 'isAppTicketStorageMode'
    | 'agreesFirstAgreement'
    | 'agreesSecondAgreement'
    | 'hasInternationalBankAccount';
  value: string | boolean;
};

export const ticketControlFormEvents = {} as
  | typeof ticketControlSpecificFormEvents
  | typeof commonEvents;
