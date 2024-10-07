import { assign, fromPromise, setup, TransitionTarget } from 'xstate';
import { ticketsAppFormEvents } from './events';
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

enum FormType {
  PriceAndTicketTypes = 'priceAndTicketTypes',
  AppTicketing = 'appTicketing',
  AppTravelSuggestion = 'appTravelSuggestion',
  AppAccount = 'appAccount',
  WebshopForm = 'webshopForm',
  TravelCardQuestion = 'travelCardQuestion',
  OrderTravelCard = 'orderTravelCard',
  AppTicketRefund = 'appTicketRefund',
  OtherTicketRefund = 'otherTicketRefund',
}

type submitInput = {
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

export type TicketsAppContextProps = {
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

const setInputToValidate = (context: TicketsAppContextProps) => {
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

export const ticketsAppFormMachine = setup({
  types: {
    context: {} as TicketsAppContextProps,
    events: ticketsAppFormEvents,
  },
  guards: {
    isFormValid: ({ context }) => {
      const inputToValidate = setInputToValidate(context);
      context.errorMessages = commonInputValidator(inputToValidate);
      return Object.keys(context.errorMessages).length > 0 ? false : true;
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

    setFormTypeToPriceAndTicketTypes: assign({
      formType: () => FormType.PriceAndTicketTypes,
    }),

    setFormTypeToWebshopForm: assign({
      formType: () => FormType.WebshopForm,
    }),

    clearValidationErrors: assign({ errorMessages: {} }),

    setValidationErrors: assign(({ context }) => {
      const inputToValidate = setInputToValidate(context);
      const errors = commonInputValidator(inputToValidate);
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
    submit: fromPromise(
      async ({
        input: {
          formType,
          attachments,
          firstName,
          lastName,
          email,
          phoneNumber,
          address,
          postalCode,
          city,
          bankAccountNumber,
          IBAN,
          SWIFT,
          question,
          orderId,
          customerNumber,
          travelCardNumber,
          refundReason,
          amount,
        },
      }: {
        input: submitInput;
      }) => {
        const base64EncodedAttachments = await convertFilesToBase64(
          attachments || [],
        );

        return await fetch('/api/contact/tickets-app', {
          method: 'POST',
          body: JSON.stringify({
            formType: formType,
            attachments: base64EncodedAttachments,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            address: address,
            postalCode: postalCode,
            city: city,
            bankAccountNumber: bankAccountNumber,
            IBAN: IBAN,
            SWIFT: SWIFT,
            question: question,
            orderId: orderId,
            customerNumber: customerNumber,
            travelCardNumber: travelCardNumber,
            refundReason: refundReason,
            amount: amount,
          }),
        })
          .then((response) => {
            // throw an error to force onError
            if (!response.ok) throw new Error('Failed to call API');
            return response.ok;
          })
          .catch((error) => {
            throw error;
          });
      },
    ),
  },
}).createMachine({
  id: 'ticketControlForm',
  initial: 'formCategoryHandler',
  context: {
    hasInternationalBankAccount: false,
    errorMessages: {},
  },
  on: {
    SELECT_FORM_CATEGORY: {
      target: '#formCategoryHandler',
    },

    SELECT_APP_FORM: {
      target: '#appFormHandler',
    },

    ON_INPUT_CHANGE: {
      actions: 'onInputChange',
    },
  },
  states: {
    selectFormCategory: {},
    formCategoryHandler: {
      id: 'formCategoryHandler',
      always: [
        {
          guard: ({ event }) =>
            event.type === 'SELECT_FORM_CATEGORY' &&
            event.formCategory === FormCategory.PriceAndTicketTypes,
          target: FormCategory.PriceAndTicketTypes,
        },
        {
          guard: ({ event }) =>
            event.type === 'SELECT_FORM_CATEGORY' &&
            event.formCategory === FormCategory.App,
          target: FormCategory.App,
        },
        {
          guard: ({ event }) =>
            event.type === 'SELECT_FORM_CATEGORY' &&
            event.formCategory === FormCategory.TravelCard,
          target: FormCategory.TravelCard,
        },
        {
          guard: ({ event }) =>
            event.type === 'SELECT_FORM_CATEGORY' &&
            event.formCategory === FormCategory.Webshop,
          target: FormCategory.Webshop,
        },
        {
          guard: ({ event }) =>
            event.type === 'SELECT_FORM_CATEGORY' &&
            event.formCategory === FormCategory.Refund,
          target: FormCategory.Refund,
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

    priceAndTicketTypes: {
      initial: 'editing',
      entry: ['setFormTypeToPriceAndTicketTypes'],
      exit: 'clearValidationErrors',
      states: {
        editing: {
          on: { SUBMIT: 'validating' },
        },
        validating: {
          always: [
            {
              guard: 'isFormValid',
              target: '#submitting',
            },

            {
              actions: ['setValidationErrors'],
              target: 'editing',
            },
          ],
        },
      },
    },
    app: {
      initial: 'editing',
      entry: 'setFormTypeToUndefined',
      exit: ['clearValidationErrors'],
      states: {
        editing: {
          initial: 'selectAppForm',
          on: { SUBMIT: 'validating' },

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
            history: {
              type: 'history',
            },
          },
        },
        validating: {
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
      },
    },
    travelCard: {
      entry: 'setFormTypeToUndefined',
      exit: 'clearValidationErrors',
    },
    webshop: {
      entry: 'setFormTypeToWebshopForm',
      exit: 'clearValidationErrors',
    },
    refund: {
      entry: 'setFormTypeToUndefined',
      exit: 'clearValidationErrors',
    },

    submitting: {
      id: 'submitting',
      invoke: {
        src: 'submit',
        input: ({ context }: { context: TicketsAppContextProps }) => ({
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
