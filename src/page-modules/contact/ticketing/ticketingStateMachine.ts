import { assign, fromPromise, setup } from 'xstate';
import { ticketingFormEvents } from './events';
import { commonInputValidator, InputErrorMessages } from '../validation';
import {
  convertFilesToBase64,
  findFirstErrorMessage,
  scrollToFirstErrorMessage,
  setBankAccountStatusAndResetBankInformation,
} from '../utils';
import { TicketType } from '../types';

export enum FormCategory {
  PriceAndTicketTypes = 'priceAndTicketTypes',
  App = 'app',
  Webshop = 'webshop',
  TravelCard = 'travelCard',
}

export enum AppForm {
  AppTicketing = 'appTicketing',
  AppTravelSuggestion = 'appTravelSuggestion',
  AppAccount = 'appAccount',
}

export enum WebshopForm {
  WebshopTicketing = 'webshopTicketing',
  WebshopAccount = 'webshopAccount',
}

export enum TravelCardForm {
  OrderTravelCard = 'orderTravelCard',
  TravelCardQuestion = 'travelCardQuestion',
}

enum FormType {
  PriceAndTicketTypes = 'priceAndTicketTypes',
  AppTicketing = 'appTicketing',
  AppTravelSuggestion = 'appTravelSuggestion',
  AppAccount = 'appAccount',
  WebshopTicketing = 'webshopTicketing',
  WebshopAccount = 'webshopAccount',
  TravelCardQuestion = 'travelCardQuestion',
  OrderTravelCard = 'orderTravelCard',
}

type SubmitInput = {
  formType?: string;
  attachments?: File[];
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  question?: string;
  orderId?: string;
  customerNumber?: string;
  travelCardNumber?: string;
  ticketType?: TicketType;
};

export type TicketingContextType = {
  formType?: FormType;
  attachments?: File[];
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  question?: string;
  orderId?: string;
  customerNumber?: string;
  travelCardNumber?: string;
  ticketType?: TicketType;
  hasInternationalBankAccount: boolean;
  isInitialAgreementChecked: boolean;
  showInputTravelCardNumber: boolean;
  errorMessages: InputErrorMessages;
  firstIncorrectErrorMessage?: string;
};

const setInputsToValidate = (context: TicketingContextType) => {
  const {
    formType,
    firstName,
    lastName,
    email,
    phoneNumber,
    question,
    orderId,
    customerNumber,
    travelCardNumber,
  } = context;

  const commonFields = {
    formType,
    question,
    firstName,
    lastName,
    email,
  };

  switch (formType) {
    case FormType.PriceAndTicketTypes:
      return {
        ...commonFields,
      };

    case FormType.AppTicketing:
      return {
        ...commonFields,
        orderId,
        phoneNumber,
        ...(customerNumber && { customerNumber }),
      };

    case FormType.AppTravelSuggestion:
      return {
        ...commonFields,
      };

    case FormType.AppAccount:
      return {
        ...commonFields,
        customerNumber,
        phoneNumber,
      };

    case FormType.TravelCardQuestion:
      return {
        ...commonFields,
        travelCardNumber,
        phoneNumber,
      };

    case FormType.WebshopTicketing:
      return {
        ...commonFields,
        ...(customerNumber && { customerNumber }),
        orderId,
        phoneNumber,
      };

    case FormType.WebshopAccount:
      return {
        ...commonFields,
        ...(customerNumber && { customerNumber }),
        phoneNumber,
      };
  }
};

export const ticketingStateMachine = setup({
  types: {
    context: {} as TicketingContextType,
    events: ticketingFormEvents,
  },
  guards: {
    isFormValid: ({ context }) => {
      const inputsToValidate = setInputsToValidate(context);
      const errors = commonInputValidator(inputsToValidate);
      return Object.keys(errors).length === 0;
    },
    isPriceAndTicketTypes: ({ event }) =>
      event.type === 'SELECT_FORM_CATEGORY' &&
      event.formCategory === FormCategory.PriceAndTicketTypes,
    isApp: ({ event }) =>
      event.type === 'SELECT_FORM_CATEGORY' &&
      event.formCategory === FormCategory.App,
    isTravelCard: ({ event }) =>
      event.type === 'SELECT_FORM_CATEGORY' &&
      event.formCategory === FormCategory.TravelCard,
    isWebshop: ({ event }) =>
      event.type === 'SELECT_FORM_CATEGORY' &&
      event.formCategory === FormCategory.Webshop,
    isAppAccount: ({ event }) =>
      event.type === 'SELECT_APP_FORM' && event.appForm === AppForm.AppAccount,
    isAppTicketing: ({ event }) =>
      event.type === 'SELECT_APP_FORM' &&
      event.appForm === AppForm.AppTicketing,
    isAppTravelSuggestion: ({ event }) =>
      event.type === 'SELECT_APP_FORM' &&
      event.appForm === AppForm.AppTravelSuggestion,
    isWebshopTicketing: ({ event }) =>
      event.type === 'SELECT_WEBSHOP_FORM' &&
      event.webshopForm === WebshopForm.WebshopTicketing,
    isWebshopAccount: ({ event }) =>
      event.type === 'SELECT_WEBSHOP_FORM' &&
      event.webshopForm === WebshopForm.WebshopAccount,
    isTravelCardQuestion: ({ event }) =>
      event.type === 'SELECT_TRAVELCARD_FORM' &&
      event.travelCardForm === TravelCardForm.TravelCardQuestion,
    isOrderTravelCard: ({ event }) =>
      event.type === 'SELECT_TRAVELCARD_FORM' &&
      event.travelCardForm === TravelCardForm.OrderTravelCard,
  },
  actions: {
    navigateToErrorPage: () => {
      window.location.href = '/contact/error';
    },
    navigateToSuccessPage: () => {
      window.location.href = '/contact/success';
    },

    setFormTypeToUndefined: assign({
      formType: () => undefined,
    }),

    clearValidationErrors: assign({ errorMessages: {} }),

    setValidationErrors: assign(({ context, event }) => {
      if (event.type === 'SUBMIT') {
        const inputsToValidate = setInputsToValidate(context);
        const errors = commonInputValidator(inputsToValidate);
        return {
          firstIncorrectErrorMessage: findFirstErrorMessage(
            event.orderedFormFieldNames,
            errors,
          ),
          errorMessages: { ...errors },
        };
      }
      return context;
    }),

    scrollToFirstErrorMessage: assign(({ context }) => {
      scrollToFirstErrorMessage(context.firstIncorrectErrorMessage);
      return context;
    }),

    onInputChange: assign(({ context, event }) => {
      if (event.type === 'ON_INPUT_CHANGE') {
        const { inputName, value } = event;

        context.errorMessages[inputName] = [];

        if (inputName === 'isInitialAgreementChecked' && !value) {
          return {
            ...context,
            isInitialAgreementChecked: false,
            formType: undefined,
          };
        }

        if (inputName === 'hasInternationalBankAccount') {
          return setBankAccountStatusAndResetBankInformation(
            context,
            value as boolean,
          );
        }

        return {
          ...context,
          [inputName]: value,
        };
      }
      return context;
    }),
  },
  actors: {
    submit: fromPromise(async ({ input }: { input: SubmitInput }) => {
      const base64EncodedAttachments = await convertFilesToBase64(
        input.attachments || [],
      );

      return await fetch('/api/contact/ticketing', {
        method: 'POST',
        body: JSON.stringify({
          ...input,
          attachments: base64EncodedAttachments,
        }),
      })
        .then((response) => {
          if (!response.ok) throw new Error('Failed to call API');
          return response.ok;
        })
        .catch((error) => {
          throw error;
        });
    }),
  },
}).createMachine({
  id: 'ticketingStateMachine',
  initial: 'editing',
  context: {
    hasInternationalBankAccount: false,
    isInitialAgreementChecked: false,
    showInputTravelCardNumber: true,
    errorMessages: {},
  },
  on: {
    ON_INPUT_CHANGE: {
      actions: 'onInputChange',
    },

    SELECT_FORM_CATEGORY: {
      target: '#formCategoryHandler',
    },

    SELECT_APP_FORM: {
      target: '#appFormHandler',
    },

    SELECT_WEBSHOP_FORM: {
      target: '#webshopFormHandler',
    },

    SELECT_TRAVELCARD_FORM: {
      target: '#travelCardFormHandler',
    },

    SUBMIT: { target: '#validating' },
  },
  states: {
    formCategoryHandler: {
      id: 'formCategoryHandler',
      always: [
        {
          guard: 'isPriceAndTicketTypes',
          target: `#${FormCategory.PriceAndTicketTypes}`,
        },
        {
          guard: 'isApp',
          target: `#${FormCategory.App}`,
        },
        {
          guard: 'isTravelCard',
          target: `#${FormCategory.TravelCard}`,
        },
        {
          guard: 'isWebshop',
          target: `#${FormCategory.Webshop}`,
        },
      ],
    },

    appFormHandler: {
      id: 'appFormHandler',
      always: [
        {
          guard: 'isAppAccount',
          target: `#${AppForm.AppAccount}`,
        },
        {
          guard: 'isAppTicketing',
          target: `#${AppForm.AppTicketing}`,
        },
        {
          guard: 'isAppTravelSuggestion',
          target: `#${AppForm.AppTravelSuggestion}`,
        },
      ],
    },

    webshopFormHandler: {
      id: 'webshopFormHandler',
      always: [
        {
          guard: 'isWebshopTicketing',
          target: `#${WebshopForm.WebshopTicketing}`,
        },
        {
          guard: 'isWebshopAccount',
          target: `#${WebshopForm.WebshopAccount}`,
        },
      ],
    },

    travelCardFormHandler: {
      id: 'travelCardFormHandler',
      always: [
        {
          guard: 'isTravelCardQuestion',
          target: `#${TravelCardForm.TravelCardQuestion}`,
        },
        {
          guard: 'isOrderTravelCard',
          target: `#${TravelCardForm.OrderTravelCard}`,
        },
      ],
    },

    editing: {
      initial: 'selectFormCategory',
      states: {
        selectFormCategory: {},
        priceAndTicketTypes: {
          id: 'priceAndTicketTypes',
          entry: assign({
            formType: () => FormType.PriceAndTicketTypes,
          }),
          exit: 'clearValidationErrors',
        },

        app: {
          id: 'app',
          initial: 'selectAppForm',
          entry: 'setFormTypeToUndefined',
          exit: 'clearValidationErrors',
          states: {
            selectAppForm: {},
            appAccount: {
              id: 'appAccount',
              entry: assign({
                formType: () => FormType.AppAccount,
              }),
            },
            appTicketing: {
              id: 'appTicketing',
              entry: assign({
                formType: () => FormType.AppTicketing,
              }),
            },
            appTravelSuggestion: {
              id: 'appTravelSuggestion',
              entry: assign({
                formType: () => FormType.AppTravelSuggestion,
              }),
            },
          },
        },
        travelCard: {
          id: 'travelCard',
          initial: 'selectTravelCardForm',
          entry: 'setFormTypeToUndefined',
          exit: 'clearValidationErrors',
          states: {
            selectTravelCardForm: {},
            travelCardQuestion: {
              id: 'travelCardQuestion',
              entry: assign({
                formType: () => FormType.TravelCardQuestion,
              }),
            },
            orderTravelCard: {
              id: 'orderTravelCard',
              entry: assign({
                formType: () => FormType.OrderTravelCard,
              }),
            },
          },
        },

        webshop: {
          id: 'webshop',
          initial: 'selectWebshopForm',
          entry: 'setFormTypeToUndefined',
          exit: 'clearValidationErrors',

          states: {
            selectWebshopForm: {},
            webshopTicketing: {
              id: 'webshopTicketing',
              entry: assign({
                formType: () => FormType.WebshopTicketing,
              }),
            },
            webshopAccount: {
              id: 'webshopAccount',
              entry: assign({
                formType: () => FormType.WebshopAccount,
              }),
            },
          },
        },
        history: {
          type: 'history',
          history: 'deep',
        },
      },
    },
    validating: {
      id: 'validating',
      always: [
        {
          guard: 'isFormValid',
          target: '#submitting',
        },
        {
          actions: ['setValidationErrors', 'scrollToFirstErrorMessage'],
          target: 'editing.history',
        },
      ],
    },

    submitting: {
      id: 'submitting',
      invoke: {
        src: 'submit',
        input: ({ context }: { context: TicketingContextType }) => ({
          formType: context.formType,
          attachments: context.attachments,
          firstName: context.firstName,
          lastName: context.lastName,
          email: context.email,
          phoneNumber: context.phoneNumber,
          address: context.address,
          question: context.question,
          orderId: context.orderId,
          customerNumber: context.customerNumber,
          travelCardNumber: context.travelCardNumber,
          ticketType: context.ticketType,
        }),

        onDone: {
          target: 'success',
        },

        onError: {
          target: 'error',
        },
      },
    },

    success: {
      entry: 'navigateToSuccessPage',
      type: 'final',
    },
    error: {
      entry: 'navigateToErrorPage',
      type: 'final',
    },
  },
});
