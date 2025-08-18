import { assign, fromPromise, setup } from 'xstate';
import { ticketControlFormEvents } from './events';
import {
  convertFilesToBase64,
  findFirstErrorMessage,
  getLineName,
  scrollToFirstErrorMessage,
  setBankAccountStatusAndResetBankInformation,
  setLineAndResetStops,
  setTransportModeAndResetLineAndStops,
} from '../utils';
import { Line } from '../server/journey-planner/validators';
import { commonInputValidator, InputErrorMessages } from '../validation';
import { TransportModeType } from '../types';

export enum FormType {
  FeeComplaint = 'feeComplaint',
  Feedback = 'feedback',
  PostponePayment = 'postponePayment',
}

type SubmitInput = {
  feeNumber?: string;
  appPhoneNumber?: string;
  customerNumber?: string;
  travelCardNumber?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  email?: string;
  phoneNumber?: string;
  bankAccountNumber?: string;
  IBAN?: string;
  SWIFT?: string;
  attachments?: File[];
  transportMode?: string;
  lineName?: string;
  fromStop?: string;
  toStop?: string;
  dateOfTicketControl?: string;
  timeOfTicketControl?: string;
  feedback?: string;
  invoiceNumber?: string;
};

export type TicketControlContextProps = {
  feeNumber?: string;
  appPhoneNumber?: string;
  customerNumber?: string;
  travelCardNumber?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  email?: string;
  phoneNumber?: string;
  bankAccountNumber?: string;
  IBAN?: string;
  SWIFT?: string;
  attachments?: File[];
  transportMode?: TransportModeType | undefined;
  line?: Line | undefined;
  fromStop?: Line['quays'][0] | undefined;
  toStop?: Line['quays'][0] | undefined;
  dateOfTicketControl?: string;
  timeOfTicketControl?: string;
  feedback?: string;
  invoiceNumber?: string;

  formType?: FormType;
  agreesFirstAgreement: boolean;
  agreesSecondAgreement: boolean;
  isAppTicketStorageMode: boolean;
  hasInternationalBankAccount: boolean;
  errorMessages: InputErrorMessages;
  firstErrorMessage?: string;
};

const disagreeAgreements = (context: TicketControlContextProps) => {
  return {
    ...context,
    agreesFirstAgreement: false,
    agreesSecondAgreement: false,
  };
};

const setInputsToValidate = (context: TicketControlContextProps) => {
  // Destructure the needed fields from context
  const {
    formType,
    firstName,
    lastName,
    email,
    feeNumber,
    feedback,
    phoneNumber,
    invoiceNumber,
    appPhoneNumber,
    customerNumber,
    travelCardNumber,
    address,
    postalCode,
    city,
    hasInternationalBankAccount,
    bankAccountNumber,
    IBAN,
    SWIFT,
    transportMode,
    line,
    dateOfTicketControl,
    timeOfTicketControl,
    isAppTicketStorageMode,
  } = context;

  switch (formType) {
    case FormType.FeeComplaint:
      return {
        feeNumber,
        feedback,
        firstName,
        lastName,
        email,
        address,
        postalCode,
        city,
        phoneNumber,
        ...(isAppTicketStorageMode
          ? { appPhoneNumber, customerNumber }
          : { travelCardNumber }),
        ...(hasInternationalBankAccount
          ? { IBAN, SWIFT }
          : { bankAccountNumber }),
      };

    case FormType.Feedback:
      return {
        transportMode,
        line,
        dateOfTicketControl,
        timeOfTicketControl,
        feedback,
        firstName,
        lastName,
        email,
      };

    case FormType.PostponePayment:
      return { feeNumber, invoiceNumber, firstName, lastName, email };
  }
};

export const ticketControlFormMachine = setup({
  types: {
    context: {} as TicketControlContextProps,
    events: ticketControlFormEvents,
  },
  guards: {
    isFormValid: ({ context }) => {
      const inputsToValidate = setInputsToValidate(context);
      const errors = commonInputValidator(inputsToValidate);
      return Object.keys(errors).length === 0;
    },
    isFeeComplaintForm: ({ event }) =>
      event.type === 'SELECT_FORM_TYPE' &&
      event.formType === FormType.FeeComplaint,
    isFeedbackForm: ({ event }) =>
      event.type === 'SELECT_FORM_TYPE' && event.formType === FormType.Feedback,
    isPostponePaymentForm: ({ event }) =>
      event.type === 'SELECT_FORM_TYPE' &&
      event.formType === FormType.PostponePayment,
  },
  actions: {
    navigateToErrorPage: () => {
      window.location.href = '/contact/error';
    },

    navigateToSuccessPage: () => {
      window.location.href = '/contact/success';
    },

    clearValidationErrors: assign({ errorMessages: {} }),

    setValidationErrors: assign(({ context, event }) => {
      if (event.type === 'SUBMIT') {
        const inputsToValidate = setInputsToValidate(context);
        const errors = commonInputValidator(inputsToValidate);
        return {
          firstErrorMessage: findFirstErrorMessage(
            event.orderedFormFieldNames,
            errors,
          ),
          errorMessages: { ...errors },
        };
      }
      return context;
    }),

    scrollToFirstErrorMessage: assign(({ context }) => {
      scrollToFirstErrorMessage(context.firstErrorMessage);
      return context;
    }),

    onInputChange: assign(({ context, event }) => {
      if (event.type === 'ON_INPUT_CHANGE') {
        const { inputName, value } = event;

        context.errorMessages[inputName] = [];

        // Set both agreements to false if agreesFirstAgreement is set to false.
        if (inputName === 'agreesFirstAgreement' && !value)
          return disagreeAgreements(context);

        if (inputName === 'hasInternationalBankAccount') {
          return setBankAccountStatusAndResetBankInformation(
            context,
            value as boolean,
          );
        }

        return { ...context, [inputName]: value };
      }
      return context;
    }),

    onTransportModeChange: assign(({ context, event }) => {
      if (event.type === 'ON_TRANSPORTMODE_CHANGE')
        return setTransportModeAndResetLineAndStops(context, event.value);
      return context;
    }),

    onLineChange: assign(({ context, event }) => {
      if (event.type === 'ON_LINE_CHANGE')
        return setLineAndResetStops(context, event.value);
      return context;
    }),
  },
  actors: {
    submit: fromPromise(async ({ input }: { input: SubmitInput }) => {
      const base64EncodedAttachments = await convertFilesToBase64(
        input.attachments || [],
      );
      return await fetch('/api/contact/ticket-control', {
        method: 'POST',
        body: JSON.stringify({
          ...input,
          attachments: base64EncodedAttachments,
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
    }),
  },
}).createMachine({
  id: 'ticketControlForm',
  initial: 'editing',
  context: {
    agreesFirstAgreement: false,
    agreesSecondAgreement: false,
    hasInternationalBankAccount: false,
    isAppTicketStorageMode: true,
    errorMessages: {},
  },
  on: {
    ON_INPUT_CHANGE: { actions: 'onInputChange' },

    SELECT_FORM_TYPE: { target: '#formTypeHandler' },

    SUBMIT: { target: '#validating' },
  },
  states: {
    formHandler: {
      id: 'formTypeHandler',
      always: [
        { guard: 'isFeeComplaintForm', target: `#${FormType.FeeComplaint}` },
        { guard: 'isFeedbackForm', target: `#${FormType.Feedback}` },
        {
          guard: 'isPostponePaymentForm',
          target: `#${FormType.PostponePayment}`,
        },
      ],
    },
    editing: {
      initial: 'selectFormType',
      on: {
        ON_INPUT_CHANGE: { actions: 'onInputChange' },
        ON_TRANSPORTMODE_CHANGE: { actions: 'onTransportModeChange' },
        ON_LINE_CHANGE: { actions: 'onLineChange' },
      },

      states: {
        selectFormType: {},
        feeComplaint: {
          id: 'feeComplaint',
          entry: assign({ formType: () => FormType.FeeComplaint }),
          exit: 'clearValidationErrors',
        },
        feedback: {
          id: 'feedback',
          entry: assign({ formType: () => FormType.Feedback }),
          exit: 'clearValidationErrors',
        },
        postponePayment: {
          id: 'postponePayment',
          entry: assign({ formType: () => FormType.PostponePayment }),
          exit: 'clearValidationErrors',
        },
        history: { type: 'history', history: 'deep' },
      },
    },

    validating: {
      id: 'validating',
      always: [
        { guard: 'isFormValid', target: '#submitting' },
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
        input: ({ context }: { context: TicketControlContextProps }) => ({
          feeNumber: context.feeNumber,
          appPhoneNumber: context.appPhoneNumber,
          customerNumber: context.customerNumber,
          travelCardNumber: context.travelCardNumber,
          firstName: context.firstName,
          lastName: context.lastName,
          address: context.address,
          postalCode: context.postalCode,
          city: context.city,
          email: context.email,
          phoneNumber: context.phoneNumber,
          bankAccountNumber: context.bankAccountNumber,
          IBAN: context.IBAN,
          SWIFT: context.SWIFT,
          feedback: context.feedback,
          transportMode: context.transportMode,
          lineName: getLineName(context.line),
          fromStop: context.fromStop?.name,
          toStop: context.toStop?.name,
          dateOfTicketControl: context.dateOfTicketControl,
          timeOfTicketControl: context.timeOfTicketControl,
          invoiceNumber: context.invoiceNumber,
          attachments: context.attachments,
        }),

        onDone: { target: 'success' },

        onError: { target: 'error' },
      },
    },

    success: { entry: 'navigateToSuccessPage', type: 'final' },
    error: { entry: 'navigateToErrorPage', type: 'final' },
  },
});
