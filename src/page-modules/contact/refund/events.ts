import {
  FormCategory,
  RefundAndTravelGuarantee,
  RefundTicketForm,
} from './refundFormMachine';
import {
  PurchasePlatformType,
  ReasonForTransportFailure,
  TicketType,
  TransportModeType,
} from '../types';
import { Line } from '..';

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
        | 'firstName'
        | 'lastName'
        | 'address'
        | 'postalCode'
        | 'city'
        | 'email'
        | 'phoneNumber'
        | 'bankAccountNumber'
        | 'IBAN'
        | 'SWIFT'
        | 'fromStop'
        | 'toStop'
        | 'date'
        | 'plannedDepartureTime'
        | 'feedback'
        | 'attachments'
        | 'isInitialAgreementChecked'
        | 'hasInternationalBankAccount'
        | 'showInputTravelCardNumber';
      value:
        | string
        | boolean
        | ReasonForTransportFailure
        | TicketType
        | Line['quays'][0]
        | File[]
        | undefined;
    }
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
      type: 'ON_TRANSPORTMODE_CHANGE';
      value: TransportModeType;
    }
  | {
      type: 'ON_LINE_CHANGE';
      value: Line | undefined;
    }
  | {
      type: 'ON_PURCHASE_PLATFORM_CHANGE';
      value: PurchasePlatformType | undefined;
    }
  | {
      type: 'SUBMIT';
      orderedFormFieldNames: string[];
    };

export const RefundFormEvents = {} as typeof RefundSpecificFormEvents;
