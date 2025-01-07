import { commonEvents } from '../commoneEvents';
import {
  AppForm,
  FormCategory,
  WebshopForm,
  TravelCardForm,
} from './ticketingStateMachine';

const ticketingSpecificFormEvents = {} as
  | {
      type: 'ON_INPUT_CHANGE';
      inputName:
        | 'question'
        | 'orderId'
        | 'customerNumber'
        | 'travelCardNumber'
        | 'refundReason'
        | 'amount'
        | 'isInitialAgreementChecked'
        | 'hasInternationalBankAccount'
        | 'showInputTravelCardNumber';
      value: string | boolean;
    }
  | {
      type: 'ON_SET_STATE';
      target: FormCategory;
    }
  | {
      type: 'SELECT_FORM_CATEGORY';
      formCategory: FormCategory;
    }
  | {
      type: 'SELECT_APP_FORM';
      appForm: AppForm;
    }
  | {
      type: 'SELECT_WEBSHOP_FORM';
      webshopForm: WebshopForm;
    }
  | {
      type: 'SELECT_TRAVELCARD_FORM';
      travelCardForm: TravelCardForm;
    }
  | {
      type: 'SUBMIT';
    };

export const ticketingFormEvents = {} as
  | typeof commonEvents
  | typeof ticketingSpecificFormEvents;
