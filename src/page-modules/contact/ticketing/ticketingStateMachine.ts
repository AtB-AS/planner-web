import { assign, fromPromise, setup } from 'xstate';
import { ticketingFormEvents } from './events';
import { commonInputValidator, InputErrorMessages } from '../validation';
import { convertFilesToBase64 } from '../utils';

export enum FormCategory {
  PriceAndTicketTypes = 'priceAndTicketTypes',
  App = 'app',
  Webshop = 'webshop',
  TravelCard = 'travelCard',
  Refund = 'refund',
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

enum FormType {
  PriceAndTicketTypes = 'priceAndTicketTypes',
  AppTicketing = 'appTicketing',
  AppTravelSuggestion = 'appTravelSuggestion',
  AppAccount = 'appAccount',
  WebshopTicketing = 'webshopTicketing',
  WebshopAccount = 'webshopAccount',
  TravelCardQuestion = 'travelCardQuestion',
  OrderTravelCard = 'orderTravelCard',
  AppTicketRefund = 'appTicketRefund',
  OtherTicketRefund = 'otherTicketRefund',
}

type SubmitInput = {
  formType?: string;
  attachments?: File[];
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  bankAccountNumber?: string;
  IBAN?: string;
  SWIFT?: string;
  question?: string;
  orderId?: string;
  customerNumber?: string;
  travelCardNumber?: string;
  refundReason?: string;
  amount?: string;
};

export type TicketingContextType = {
  formType?: FormType;
  attachments?: File[];
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  hasInternationalBankAccount: boolean;
  bankAccountNumber?: string;
  IBAN?: string;
  SWIFT?: string;
  question?: string;
  orderId?: string;
  customerNumber?: string;
  travelCardNumber?: string;
  refundReason?: string;
  amount?: string;
  errorMessages: InputErrorMessages;
};

const setInputsToValidate = (context: TicketingContextType) => {
  const {
    formType,
    attachments,
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    postalCode,
    city,
    hasInternationalBankAccount,
    bankAccountNumber,
    IBAN,
    SWIFT,
    question,
    orderId,
    customerNumber,
    travelCardNumber,
    refundReason,
    amount,
  } = context;

  const commonAppFields = {
    formType,
    question,
    attachments,
    firstName,
    lastName,
    email,
  };

  switch (formType) {
    case FormType.PriceAndTicketTypes:
      return {
        formType,
        question,
        firstName,
        lastName,
        email,
      };

    case FormType.AppTicketing:
      return {
        ...commonAppFields,
        orderId,
        phoneNumber,
      };

    case FormType.AppTravelSuggestion:
      return {
        ...commonAppFields,
      };

    case FormType.AppAccount:
      return {
        ...commonAppFields,
        customerNumber,
        phoneNumber,
      };

    case FormType.TravelCardQuestion:
      return {
        formType,
        travelCardNumber,
        question,
        firstName,
        lastName,
        email,
        phoneNumber,
      };

    case FormType.OrderTravelCard:
      return {
        formType,
        firstName,
        lastName,
        address,
        postalCode,
        city,
        email,
      };

    case FormType.WebshopTicketing:
      return { formType, orderId, question, ...(!customerNumber && { email }) };

    case FormType.WebshopAccount:
      return { formType, question, ...(!customerNumber && { email }) };

    case FormType.AppTicketRefund:
      return {
        formType,
        customerNumber,
        orderId,
      };

    case FormType.OtherTicketRefund:
      return {
        formType,
        travelCardNumber,
        refundReason,
        amount,
        firstName,
        lastName,
        address,
        postalCode,
        city,
        email,
        phoneNumber,
        ...(hasInternationalBankAccount
          ? { IBAN, SWIFT }
          : { bankAccountNumber }),
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

    setValidationErrors: assign(({ context }) => {
      const inputsToValidate = setInputsToValidate(context);
      const errors = commonInputValidator(inputsToValidate);
      return { errorMessages: { ...errors } };
    }),

    onInputChange: assign(({ context, event }) => {
      if (event.type === 'ON_INPUT_CHANGE') {
        const { inputName, value } = event;

        context.errorMessages[inputName] = [];

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

    SUBMIT: { target: '#validating' },
  },
  states: {
    formCategoryHandler: {
      id: 'formCategoryHandler',
      always: [
        {
          guard: ({ event }) =>
            event.type === 'SELECT_FORM_CATEGORY' &&
            event.formCategory === FormCategory.PriceAndTicketTypes,
          target: `#${FormCategory.PriceAndTicketTypes}`,
        },
        {
          guard: ({ event }) =>
            event.type === 'SELECT_FORM_CATEGORY' &&
            event.formCategory === FormCategory.App,
          target: `#${FormCategory.App}`,
        },
        {
          guard: ({ event }) =>
            event.type === 'SELECT_FORM_CATEGORY' &&
            event.formCategory === FormCategory.TravelCard,
          target: `#${FormCategory.TravelCard}`,
        },
        {
          guard: ({ event }) =>
            event.type === 'SELECT_FORM_CATEGORY' &&
            event.formCategory === FormCategory.Webshop,
          target: `#${FormCategory.Webshop}`,
        },
        {
          guard: ({ event }) =>
            event.type === 'SELECT_FORM_CATEGORY' &&
            event.formCategory === FormCategory.Refund,
          target: `#${FormCategory.Refund}`,
        },
      ],
    },

    appFormHandler: {
      id: 'appFormHandler',
      always: [
        {
          guard: ({ event }) =>
            event.type === 'SELECT_APP_FORM' &&
            event.appForm === AppForm.AppAccount,
          target: `#${AppForm.AppAccount}`,
        },
        {
          guard: ({ event }) =>
            event.type === 'SELECT_APP_FORM' &&
            event.appForm === AppForm.AppTicketing,
          target: `#${AppForm.AppTicketing}`,
        },
        {
          guard: ({ event }) =>
            event.type === 'SELECT_APP_FORM' &&
            event.appForm === AppForm.AppTravelSuggestion,
          target: `#${AppForm.AppTravelSuggestion}`,
        },
      ],
    },
    webshopFormHandler: {
      id: 'webshopFormHandler',
      always: [
        {
          guard: ({ event }) =>
            event.type === 'SELECT_WEBSHOP_FORM' &&
            event.webshopForm === WebshopForm.WebshopTicketing,
          target: `#${WebshopForm.WebshopTicketing}`,
        },
        {
          guard: ({ event }) =>
            event.type === 'SELECT_WEBSHOP_FORM' &&
            event.webshopForm === WebshopForm.WebshopAccount,
          target: `#${WebshopForm.WebshopAccount}`,
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
          entry: 'setFormTypeToUndefined',
          exit: 'clearValidationErrors',
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
        refund: {
          id: 'refund',
          entry: 'setFormTypeToUndefined',
          exit: 'clearValidationErrors',
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
          actions: 'setValidationErrors',
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
          postalCode: context.postalCode,
          city: context.city,
          bankAccountNumber: context.bankAccountNumber,
          IBAN: context.IBAN,
          SWIFT: context.SWIFT,
          question: context.question,
          orderId: context.orderId,
          customerNumber: context.customerNumber,
          travelCardNumber: context.travelCardNumber,
          refundReason: context.refundReason,
          amount: context.amount,
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
