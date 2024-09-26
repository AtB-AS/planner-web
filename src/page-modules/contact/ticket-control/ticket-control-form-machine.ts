import { assign, fromPromise, setup } from 'xstate';
import { ticketControlFormEvents } from './events';
import {
  convertFilesToBase64,
  getCurrentDateString,
  getCurrentTimeString,
} from '../utils';
import { TransportModeType } from '@atb-as/config-specs';
import { Line } from '../server/journey-planner/validators';
import { commonInputValidator, InputErrorMessages } from '../validation';
import ErrorMessage from '../components/input/error-message';
import { error } from 'console';

export enum FormType {
  FeeComplaint = 'feeComplaint',
  Feedback = 'feedback',
  PostponePayment = 'postponePayment',
}

type submitInput = {
  // Common
  firstName: string;
  lastName: string;
  email: string;
  feedback?: string;
  attachments?: File[];
  feeNumber?: string;

  // Complaint
  address?: string;
  postalCode?: string;
  city?: string;
  phoneNumber?: string;
  bankAccountNumber?: string;
  IBAN?: string;
  SWIFT?: string;
  appPhoneNumber?: string;
  customerNumber?: string;
  travelCardNumber?: string;

  // Feedback
  transportMode?: string;
  lineName?: string;
  fromStopName?: string;
  toStopName?: string;
  date?: string;
  plannedDepartureTime?: string;

  // PostponePayment
  invoiceNumber?: string;
};

export type ContextProps = {
  // Common
  formType: FormType | undefined;
  firstName: string;
  lastName: string;
  email: string;
  feedback?: string;
  attachments?: File[];
  feeNumber?: string;

  // Complaint
  appPhoneNumber?: string;
  customerNumber?: string;
  travelCardNumber?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  phoneNumber?: string;
  bankAccountNumber?: string;
  IBAN?: string;
  SWIFT?: string;
  agreesFirstAgreement: boolean;
  agreesSecondAgreement: boolean;
  isAppTicketStorageMode: boolean;
  hasInternationalBankAccount: boolean;
  errorMessages: InputErrorMessages;

  //Feedback
  transportMode?: TransportModeType | undefined;
  line?: Line | undefined;
  fromStop?: Line['quays'][0] | undefined;
  toStop?: Line['quays'][0] | undefined;
  date?: string;
  plannedDepartureTime?: string;

  // PostponePayment
  invoiceNumber?: string;
};

// Function to reset the agreement fields and error messages
const resetAgreementFieldsAndErrors = (
  context: ContextProps,
  formType: FormType,
) => {
  return {
    ...context,
    formType: formType,
    agreesFirstAgreement: false,
    agreesSecondAgreement: false,
    isAppTicketStorageMode: true,
    hasInternationalBankAccount: false,
    errorMessages: {},
  };
};

const setInputToValidate = (context: ContextProps) => {
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
    bankAccountNumber,
    IBAN,
    SWIFT,
    transportMode,
    line,
    fromStop,
    toStop,
    date,
    plannedDepartureTime,
  } = context;

  switch (formType) {
    case FormType.FeeComplaint:
      return {
        firstName,
        lastName,
        email,
        phoneNumber,
        appPhoneNumber,
        customerNumber,
        travelCardNumber,
        address,
        postalCode,
        city,
        bankAccountNumber,
        IBAN,
        SWIFT,
      };

    case FormType.Feedback:
      return {
        firstName,
        lastName,
        email,
        feedback,
        transportMode,
        line,
        fromStop,
        toStop,
        date,
        plannedDepartureTime,
      };

    case FormType.PostponePayment:
      return {
        firstName,
        lastName,
        email,
        feeNumber,
        invoiceNumber,
      };
  }
};

export const ticketControlFormMachine = setup({
  types: {
    context: {} as ContextProps,
    events: ticketControlFormEvents,
  },
  guards: {
    validateInputs: ({ context }) => {
      const inputToValidate = setInputToValidate(context);
      context.errorMessages = commonInputValidator(inputToValidate);
      return Object.keys(context.errorMessages).length > 0 ? false : true;
    },
  },
  actions: {
    cleanErrorMessages: assign({
      errorMessages: () => ({}),
    }),

    onInputChange: assign(({ context, event }) => {
      if (event.type === 'ON_INPUT_CHANGE') {
        const { inputName, value } = event;

        if (inputName === 'formType') {
          return resetAgreementFieldsAndErrors(context, value as FormType);
        }

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
          firstName,
          lastName,
          email,
          feedback,
          attachments,
          feeNumber,
          appPhoneNumber,
          customerNumber,
          travelCardNumber,
          address,
          postalCode,
          city,
          phoneNumber,
          bankAccountNumber,
          IBAN,
          SWIFT,
          transportMode,
          lineName,
          fromStopName,
          toStopName,
          date,
          plannedDepartureTime,
          invoiceNumber,
        },
      }: {
        input: submitInput;
      }) => {
        const base64EncodedAttachments = await convertFilesToBase64(
          attachments || [],
        );
        return await fetch('/api/contact/ticket-control', {
          method: 'POST',
          body: JSON.stringify({
            feeNumber: feeNumber,
            appPhoneNumber: appPhoneNumber,
            customerNumber: customerNumber,
            travelCardNumber: travelCardNumber,
            additionalInfo: feedback,
            firstName: firstName,
            lastName: lastName,
            address: address,
            postalCode: postalCode,
            city: city,
            email: email,
            phoneNumber: phoneNumber,
            bankAccountNumber: bankAccountNumber,
            IBAN: IBAN,
            SWIFT: SWIFT,
            attachments: base64EncodedAttachments,
            transportMode: transportMode,
            line: lineName,
            fromStop: fromStopName,
            toStop: toStopName,
            date: date,
            plannedDepartureTime: plannedDepartureTime,
            invoiceNumber: invoiceNumber,
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
    // Common
    formType: undefined,
    firstName: '',
    lastName: '',
    email: '',
    feedback: '',
    feeNumber: '',
    errorMessages: {},

    // Complaint
    appPhoneNumber: '',
    customerNumber: '',
    travelCardNumber: '',
    address: '',
    postalCode: '',
    city: '',
    phoneNumber: '',
    bankAccountNumber: '',
    IBAN: '',
    SWIFT: '',
    agreesFirstAgreement: false,
    agreesSecondAgreement: false,
    hasInternationalBankAccount: false,
    isAppTicketStorageMode: true,

    // Feeback
    transportMode: undefined,
    line: undefined,
    fromStop: undefined,
    toStop: undefined,
    date: getCurrentDateString(),
    plannedDepartureTime: getCurrentTimeString(),

    // PostponePayment
    invoiceNumber: '',
  },
  states: {
    editing: {
      initial: 'idle',
      on: {
        ON_INPUT_CHANGE: {
          actions: 'onInputChange',
        },

        VALIDATE: {
          guard: 'validateInputs',
          target: 'editing.readyForSubmit',
        },
      },

      states: {
        idle: {},
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
          firstName: context.firstName,
          lastName: context.lastName,
          email: context.email,
          feedback: context.feedback,
          attachments: context.attachments,
          feeNumber: context.feeNumber,
          appPhoneNumber: context?.appPhoneNumber,
          customerNumber: context?.customerNumber,
          travelCardNumber: context?.travelCardNumber,
          address: context?.address,
          postalCode: context?.postalCode,
          city: context?.city,
          phoneNumber: context?.phoneNumber,
          bankAccountNumber: context?.bankAccountNumber,
          IBAN: context?.IBAN,
          SWIFT: context?.SWIFT,
          transportMode: context?.transportMode,
          lineName: context?.line?.name,
          fromStopName: context?.fromStop?.name,
          toStopName: context?.toStop?.name,
          date: context?.date,
          plannedDepartureTime: context?.plannedDepartureTime,
          invoiceNumber: context?.invoiceNumber,
        }),

        onDone: {
          target: 'success',
        },

        onError: {
          target: 'editing',
        },
      },
    },

    success: {
      type: 'final',
    },
  },
});
