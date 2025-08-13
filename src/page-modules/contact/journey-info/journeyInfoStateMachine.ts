import { assign, fromPromise, setup } from 'xstate';
import {
  convertFilesToBase64,
  findFirstErrorMessage,
  scrollToFirstErrorMessage,
} from '../utils';
import { commonInputValidator, InputErrorMessages } from '../validation';
import { journeyInfoFormEvents } from './events';

type SubmitInput = {
  attachments?: File[];
  firstName?: string;
  lastName?: string;
  email?: string;
  question?: string;
};

export type JourneyInfoContextType = {
  attachments?: File[];
  firstName?: string;
  lastName?: string;
  email?: string;
  question?: string;
  errorMessages: InputErrorMessages;
  firstIncorrectErrorMessage?: string;
};

const setInputsToValidate = (context: JourneyInfoContextType) => {
  const { firstName, lastName, email, question } = context;

  return {
    question,
    firstName,
    lastName,
    email,
  };
};

export const journeyInfoStateMachine = setup({
  types: {
    context: {} as JourneyInfoContextType,
    events: journeyInfoFormEvents,
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

      return await fetch('/api/contact/journey-info', {
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
  id: 'journeyInfoStateMachine',
  initial: 'editing',
  context: {
    errorMessages: {},
  },
  on: {
    ON_INPUT_CHANGE: {
      actions: 'onInputChange',
    },

    SUBMIT: { target: '#validating' },
  },
  states: {
    editing: {
      initial: 'selectJourneyInfoForm',
      states: {
        selectJourneyInfoForm: {},
        journeyInfo: {
          id: 'journeyInfo',
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
          actions: ['setValidationErrors', 'scrollToFirstErrorMessage'],
          target: 'editing.history',
        },
      ],
    },

    submitting: {
      id: 'submitting',
      invoke: {
        src: 'submit',
        input: ({ context }: { context: JourneyInfoContextType }) => ({
          attachments: context.attachments,
          firstName: context.firstName,
          lastName: context.lastName,
          email: context.email,
          question: context.question,
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
