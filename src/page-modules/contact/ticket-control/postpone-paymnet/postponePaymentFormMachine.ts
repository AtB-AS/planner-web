import { assign, fromPromise, setup } from 'xstate';
import { commonFieldValidator, InputErrorMessages } from '../../validation';
import { ticketControlFormEvents } from '../events';

type APIParams = {
  feeNumber: string;
  invoiceNumber: string;
  firstName: string;
  lastName: string;
  email: string;
};

type ContextProps = {
  errorMessages: InputErrorMessages;
} & APIParams;

export const postponePaymentForm = setup({
  types: {
    context: {} as ContextProps,
    events: ticketControlFormEvents,
  },

  guards: {
    validateInputs: ({ context }) => commonFieldValidator(context),
  },
  actions: {
    updateField: assign(({ context, event }) => {
      if (event.type === 'UPDATE_FIELD') {
        const { field, value } = event;
        // Remove errorMessages if any
        context.errorMessages[field] = [];
        return {
          ...context,
          [field]: value,
        };
      }
      return context;
    }),

    cleanErrorMessages: assign({
      errorMessages: () => ({}),
    }),
  },
  actors: {
    callAPI: fromPromise(
      async ({
        input: { feeNumber, invoiceNumber, firstName, lastName, email },
      }: {
        input: APIParams;
      }) => {
        return await fetch('/contact/ticket-control', {
          method: 'POST',
          body: JSON.stringify({
            feeNumber: feeNumber,
            invoiceNumber: invoiceNumber,
            firstName: firstName,
            lastName: lastName,
            email: email,
          }),
        }).then((response) => {
          // throw an error to force onError
          if (!response.ok) throw new Error('Failed to call API');
          return response.ok;
        });
      },
    ),
  },
}).createMachine({
  id: 'postponePaymentForm',
  initial: 'editing',
  context: {
    feeNumber: '',
    invoiceNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    errorMessages: {},
  },
  states: {
    editing: {
      entry: 'cleanErrorMessages',
      on: {
        UPDATE_FIELD: {
          actions: 'updateField',
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
          invoiceNumber: context.invoiceNumber,
          firstName: context.firstName,
          lastName: context.lastName,
          email: context.email,
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
