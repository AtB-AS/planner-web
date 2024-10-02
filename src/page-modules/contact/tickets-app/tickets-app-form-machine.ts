import { assign, fromPromise, setup, TransitionTarget } from 'xstate';
import { ticketsAppFormEvents } from './events';
import { commonInputValidator, InputErrorMessages } from '../validation';
import { convertFilesToBase64 } from '../utils';

export enum EditingState {
  PriceAndTicketTypes = 'priceAndTicketTypes',
  App = 'app',
  Webshop = 'webshop',
  TravelCard = 'travelCard',
  Refund = 'refund',
}

export enum FormType {
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
  feedback?: string;
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
  customerId?: string;
  travelCardNumber?: string;
  ticketType?: string;
  refundReason?: string;
  amount?: string;
};

export type ContextProps = {
  formType?: FormType;
  feedback?: string;
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
  customerId?: string;
  travelCardNumber?: string;
  ticketType?: string;
  refundReason?: string;
  amount?: string;
  errorMessages: InputErrorMessages;
};

const setInputToValidate = (context: ContextProps) => {
  // Destructure the needed fields from context
  const {
    formType,
    feedback,
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
    customerId,
    travelCardNumber,
    ticketType,
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
        feedback,
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
        customerId,
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
        customerId,
        orderId,
      };

    case FormType.OtherTicketRefund:
      return {
        formType,
        ticketType,
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
    context: {} as ContextProps,
    events: ticketsAppFormEvents,
  },
  guards: {
    validateInputs: ({ context }) => {
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
    onInputChange: assign(({ context, event }) => {
      if (event.type === 'ON_INPUT_CHANGE') {
        const { inputName, value } = event;

        if (inputName === 'formType') {
          context.errorMessages = {};
        } else {
          context.errorMessages[inputName] = [];
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
    submit: fromPromise(
      async ({
        input: {
          formType,
          feedback,
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
          customerId,
          travelCardNumber,
          ticketType,
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
            feedback: feedback,
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
            customerId: customerId,
            travelCardNumber: travelCardNumber,
            ticketType: ticketType,
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
  initial: 'editing',
  context: {
    hasInternationalBankAccount: false,
    errorMessages: {},
  },
  states: {
    editing: {
      initial: 'idle',
      on: {
        ON_INPUT_CHANGE: {
          actions: 'onInputChange',
        },

        ON_SET_STATE: Object.values(EditingState).map((state) => {
          return {
            target: `editing.${state}`,
            guard: ({ event }) => event.target === state,
          };
        }),

        VALIDATE: {
          guard: 'validateInputs',
          target: 'editing.readyForSubmit',
        },
      },

      states: {
        idle: {},
        priceAndTicketTypes: {
          entry: assign({
            formType: () => FormType.PriceAndTicketTypes,
          }),
        },
        app: {
          entry: 'setFormTypeToUndefined',
        },
        webshop: {
          entry: assign({
            formType: () => FormType.WebshopForm,
          }),
        },
        travelCard: {
          entry: 'setFormTypeToUndefined',
        },
        refund: {
          entry: 'setFormTypeToUndefined',
        },
        readyForSubmit: {
          type: 'final',
        },
      },

      onDone: {
        target: 'submitting',
      },
    },

    submitting: {
      invoke: {
        src: 'submit',
        input: ({ context }: { context: ContextProps }) => ({
          formType: context.formType,
          feedback: context.feedback,
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
          customerId: context.customerId,
          travelCardNumber: context.travelCardNumber,
          ticketType: context.ticketType,
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
