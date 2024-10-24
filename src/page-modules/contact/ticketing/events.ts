import { TranslatedString } from '@atb/translations';
import { commonEvents } from '../commoneEvents';
import { AppForm, FormCategory, WebshopForm } from './ticketingStateMachine';

export type RefundReason = { id: string; name: TranslatedString };

const ticketingSpecificFormEvents = {} as
  | {
      type: 'ON_INPUT_CHANGE';
      inputName: 'question' | 'orderId' | 'customerNumber';
      value: string;
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
      type: 'SUBMIT';
    };

export const ticketingFormEvents = {} as
  | typeof commonEvents
  | typeof ticketingSpecificFormEvents;
