import { assign, fromPromise, setup } from 'xstate';
import { commonInputValidator, InputErrorMessages } from '../../validation';
import { convertFilesToBase64 } from '../../utils';
import { ticketControlFormEvents } from '../events';

type APIParams = {
  feeNumber: string;
  appPhoneNumber: string | undefined;
  customerNumber: string | undefined;
  travelCardNumber: string | undefined;
  feedback: string;
  firstName: string;
  lastName: string;
  address: string;
  postalCode: string;
  city: string;
  email: string;
  phoneNumber: string;
  bankAccountNumber: string;
  IBAN: string;
  SWIFT: string;
  attachments?: File[];
};

type ContextProps = {
  agreesFirstAgreement: boolean;
  agreesSecondAgreement: boolean;
  isAppTicketStorageMode: boolean;
  hasInternationalBankAccount: boolean;
  errorMessages: InputErrorMessages;
} & APIParams;

export const formMachine = setup({
  types: {
    context: {} as ContextProps,
    events: ticketControlFormEvents,
  },
  guards: {
    validateInputs: ({ context }) => commonInputValidator(context),
  },
  actions: {
    cleanErrorMessages: assign({
      errorMessages: () => ({}),
    }),

    onInputChange: assign(({ context, event }) => {
      if (event.type === 'ON_INPUT_CHANGE') {
        const { inputName, value } = event;
        // Remove errorMessages if any
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
    callAPI: fromPromise(
      async ({
        input: {
          feeNumber,
          appPhoneNumber,
          customerNumber,
          travelCardNumber,
          feedback,
          firstName,
          lastName,
          address,
          postalCode,
          city,
          email,
          phoneNumber,
          bankAccountNumber,
          IBAN,
          SWIFT,
          attachments,
        },
      }: {
        input: APIParams;
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
  id: 'feeComplaintForm',
  initial: 'editing',
  context: {
    feeNumber: '',
    appPhoneNumber: undefined,
    customerNumber: undefined,
    travelCardNumber: undefined,
    feedback: '',
    firstName: '',
    lastName: '',
    address: '',
    postalCode: '',
    city: '',
    email: '',
    phoneNumber: '',
    bankAccountNumber: '',
    IBAN: '',
    SWIFT: '',
    agreesFirstAgreement: false,
    agreesSecondAgreement: false,
    hasInternationalBankAccount: false,
    isAppTicketStorageMode: true,
    errorMessages: {},
  },
  states: {
    editing: {
      entry: 'cleanErrorMessages',
      on: {
        ON_INPUT_CHANGE: {
          actions: 'onInputChange',
        },
        VALIDATE: {
          guard: 'validateInputs',
          target: 'submitting',
        },
      },
    },

    submitting: {
      invoke: {
        src: 'callAPI',
        input: ({ context }) => ({
          feeNumber: context.feeNumber,
          appPhoneNumber: context.appPhoneNumber,
          customerNumber: context.customerNumber,
          travelCardNumber: context.travelCardNumber,
          feedback: context.feedback,
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
          attachments: context.attachments,
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