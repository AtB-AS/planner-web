import { TransportModeType } from '@atb-as/config-specs';
import { Line } from '../../server/journey-planner/validators';
import { assign, fromPromise, setup } from 'xstate';
import { commonInputValidator, InputErrorMessages } from '../../validation';
import {
  convertFilesToBase64,
  getCurrentDateString,
  getCurrentTimeString,
} from '../../utils';
import { ticketControlFormEvents } from '../events';

type APIParams = {
  transportMode: TransportModeType | undefined;
  line: Line | undefined;
  fromStop: Line['quays'][0] | undefined;
  toStop: Line['quays'][0] | undefined;
  date: string;
  plannedDepartureTime: string;
  feedback: string;
  firstName: string;
  lastName: string;
  email: string;
  attachments?: File[];
};

type ContextProps = {
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

    cleanErrorMessages: assign({
      errorMessages: () => ({}),
    }),
  },
  actors: {
    callAPI: fromPromise(
      async ({
        input: {
          transportMode,
          line,
          fromStop,
          toStop,
          date,
          plannedDepartureTime,
          feedback,
          firstName,
          lastName,
          email,
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
            transportMode: transportMode,
            line: line?.id,
            fromStop: fromStop?.id,
            toStop: toStop?.id,
            date: date,
            plannedDepartureTime: plannedDepartureTime,
            feedback: feedback,
            firstName: firstName,
            lastName: lastName,
            email: email,
            attachments: base64EncodedAttachments,
          }),
        })
          .then((response) => {
            // throw an error to force onError
            if (!response.ok) throw new Error('Failed to call API');
            return response.ok;
          })
          .catch((error) => {
            console.log(error);
            throw error;
          });
      },
    ),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDMyQEYEMDGBrAYgPYBOAtgHQAuxmAbmADYCyhEYAxLGJQCo33NWYANoAGALqJQAB0KwAlpXmEAdlJAAPRAFoAjADYATOV0BOAKwBmXYfMAaEAE9Eu8+QDsugCwAOL5fdzAF8gh1QMHAISCgZ5FQ4uSgAZOJEJdVkFJVV1LQRbHw9Rd1FrWwdnfN1yfVFzL30fQJCwtAgsPCIycjZpTGJKAFdiMCTCbExslU5uABEwPoHh0fHJ5RUxSSQQTMV13J1dS0sTUVcjeycXdy9yUtNRC5aQcPbIrop+4nlaTAYxiZTGaUACCxG+v3+qymmwycj2OW2eW0lh8hVM3ke5SuCEshn0RTKwWeKiE8G2rw6UTIcKy+yROn8hWOpj8AUulW0ng8PnM51sz0p72iVH4jBYbFpCLUDIQKIe5BZbMCFRcbk8vn8zVCLzaVI+5Fi8SlUwOCH0pnIPn0eJ8Ng5iEM1Vq9Ua2taEU6It6-SGIwBa0RMnhptlhlElt5pnZqoQBgJNh8DyeOqFXu6Xx+fwDoeDdKDmh0ln0CYxXixDrjPlEivdus91IosEG6FIikoJvpoGR1nIvlEDSala8DUVfPMKZCQA */
  id: 'feedbackForm',
  initial: 'editing',
  context: {
    transportMode: undefined,
    line: undefined,
    fromStop: undefined,
    toStop: undefined,
    date: getCurrentDateString(),
    plannedDepartureTime: getCurrentTimeString(),
    feedback: '',
    firstName: '',
    lastName: '',
    email: '',
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
          transportMode: context.transportMode,
          line: context.line,
          fromStop: context.fromStop,
          toStop: context.toStop,
          date: context.date,
          plannedDepartureTime: context.plannedDepartureTime,
          feedback: context.feedback,
          firstName: context.firstName,
          lastName: context.lastName,
          email: context.email,
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
