import { TransportModeType } from '@atb-as/config-specs';
import { Line } from '../../server/journey-planner/validators';
import { assign, setup } from 'xstate';

export const formMachine = setup({
  types: {
    context: {} as {
      transportMode: TransportModeType | undefined;
      line: Line | undefined;
      departureLocation: Line['quays'][0] | undefined;
      arrivalLocation: Line['quays'][0] | undefined;
      date: string;
      time: string;
      feedback: string;
      subject: string;
      firstname: string;
      lastname: string;
      email: string;
    },
    events: {} as
      | {
          type: 'SET_TRANSPORT_MODE';
          transportMode: TransportModeType;
        }
      | { type: 'SET_LINE'; line: Line }
      | { type: 'SET_DEPARTURE_LOCATON'; departureLocation: Line['quays'][0] }
      | { type: 'SET_ARRIVAL_LOCATON'; arrivalLocation: Line['quays'][0] }
      | { type: 'SET_DATE'; date: string }
      | { type: 'SET_TIME'; time: string }
      | { type: 'SET_FEEDBACK'; feedback: string }
      | { type: 'SET_FIRSTNAME'; firstname: string }
      | { type: 'SET_LASTNAME'; lastname: string }
      | { type: 'SET_EMAIL'; email: string }
      | { type: 'SUBMIT' }
      | { type: 'RESOLVE' }
      | { type: 'FALIURE' },
    input: {} as {
      subject: string;
      date: string;
      time: string;
    },
  },
  guards: {
    isTransportModeUndefined: ({ context }) => !context.transportMode,
    isLineModeUndefined: ({ context }) => !context.line,
    isDepartureLocationUndefined: ({ context }) => !context.departureLocation,
    isArrivalLocationUndefined: ({ context }) => !context.arrivalLocation,
    isFeedbackTooShort: ({ context }) => context.feedback.length === 0,
    isFirstnameEmpty: ({ context }) => context.firstname.length === 0,
    isLastnameEmpty: ({ context }) => context.lastname.length === 0,
    isEmailEmpty: ({ context }) => context.email.length === 0,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDMyQEYEMDGBrAYgPYBOAtgHQAuxmAbmADYCyhEYAxLGJQCo33NWYANoAGALqJQAB0KwAlpXmEAdlJAAPRAFoAjADYATOV0BOAKwBmXYfMAaEAE9Eu8+QDsugCwAOL5fdzAF8gh1QMHAISCgZ5FQ4uSgAZOJEJdVkFJVV1LQRbHw9Rd1FrWwdnfN1yfVFzL30fQJCwtAgsPCIycjZpTGJKAFdiMCTCbExslU5uABEwPoHh0fHJ5RUxSSQQTMV13J1dS0sTUVcjeycXdy9yUtNRC5aQcPbIrop+4nlaTAYxiZTGaUACCxG+v3+qymmwycj2OW2eW0lh8hVM3ke5SuCEshn0RTKwWeKiE8G2rw6UTIcKy+yROn8hWOpj8AUulW0ng8PnM51sz0p72iVH4jBYbFpCLUDIQKIe5BZbMCFRcbk8vn8zVCLzaVI+5Fi8SlUwOCH0pnIPn0eJ8Ng5iEM1Vq9Ua2taEU6It6-SGIwBa0RMnhptlhlElt5pnZqoQBgJNh8DyeOqFXu6Xx+fwDoeDdKDmh0ln0CYxXixDrjPlEivdus91IosEG6FIikoJvpoGR1nIvlEDSala8DUVfPMKZCQA */
  id: 'feedbackForm',
  initial: 'editing',
  context: ({ input }) => ({
    transportMode: undefined,
    line: undefined,
    departureLocation: undefined,
    arrivalLocation: undefined,
    date: input.date,
    time: input.time,
    feedback: '',
    subject: input.subject,
    firstname: '',
    lastname: '',
    email: '',
  }),

  states: {
    editing: {
      on: {
        SET_TRANSPORT_MODE: {
          guard: 'isTransportModeUndefined',
          actions: assign({
            transportMode: ({ event }) => event.transportMode,
          }),
        },
        SET_LINE: {
          actions: assign({
            line: ({ event }) => event.line,
          }),
        },
        SET_DEPARTURE_LOCATON: {
          actions: assign({
            departureLocation: ({ event }) => event.departureLocation,
          }),
        },
        SET_ARRIVAL_LOCATON: {
          actions: assign({
            arrivalLocation: ({ event }) => event.arrivalLocation,
          }),
        },
        SET_DATE: {
          actions: assign({
            date: ({ event }) => event.date,
          }),
        },
        SET_TIME: {
          actions: assign({
            time: ({ event }) => event.time,
          }),
        },
        SET_FEEDBACK: {
          actions: assign({
            feedback: ({ event }) => event.feedback,
          }),
        },
        SET_FIRSTNAME: {
          actions: assign({
            firstname: ({ event }) => event.firstname,
          }),
        },
        SET_LASTNAME: {
          actions: assign({
            lastname: ({ event }) => event.lastname,
          }),
        },
        SET_EMAIL: {
          actions: assign({
            email: ({ event }) => event.email,
          }),
        },
        SUBMIT: [
          {
            guard: 'isTransportModeUndefined',
            target: 'editing.transportMode.error.undefinedTransportMode',
          },
          {
            guard: 'isLineModeUndefined',
            target: 'editing.line.error.undefinedLine',
          },
          {
            guard: 'isDepartureLocationUndefined',
            target:
              'editing.departureLocation.error.undefinedDepartureLocation',
          },
          {
            guard: 'isArrivalLocationUndefined',
            target: 'editing.arrivalLocation.error.undefinedArrivalLocation',
          },
          {
            guard: 'isFeedbackTooShort',
            target: 'editing.feedback.error.emptyFeedback',
          },
          {
            guard: 'isFirstnameEmpty',
            target: 'editing.firstname.error.emptyFirstname',
          },
          {
            guard: 'isLastnameEmpty',
            target: 'editing.lastname.error.emptyLastname',
          },
          {
            guard: 'isEmailEmpty',
            target: 'editing.email.error.emptyEmail',
          },
          {
            target: 'submitting',
          },
        ],
      },

      type: 'parallel',
      states: {
        transportMode: {
          initial: 'valid',
          states: {
            valid: {},
            error: {
              initial: 'undefinedTransportMode',
              states: {
                undefinedTransportMode: {},
              },
            },
          },
        },
        line: {
          initial: 'valid',
          states: {
            valid: {},
            error: {
              initial: 'undefinedLine',
              states: {
                undefinedLine: {},
              },
            },
          },
        },
        departureLocation: {
          initial: 'valid',
          states: {
            valid: {},
            error: {
              initial: 'undefinedDepartureLocation',
              states: {
                undefinedDepartureLocation: {},
              },
            },
          },
        },
        arrivalLocation: {
          initial: 'valid',
          states: {
            valid: {},
            error: {
              initial: 'undefinedArrivalLocation',
              states: {
                undefinedArrivalLocation: {},
              },
            },
          },
        },
        feedback: {
          initial: 'valid',
          states: {
            valid: {},
            error: {
              initial: 'emptyFeedback',
              states: {
                emptyFeedback: {},
              },
            },
          },
        },
        firstname: {
          initial: 'valid',
          states: {
            valid: {},
            error: {
              initial: 'emptyFirstname',
              states: {
                emptyFirstname: {},
              },
            },
          },
        },
        lastname: {
          initial: 'valid',
          states: {
            valid: {},
            error: {
              initial: 'emptyLastname',
              states: {
                emptyLastname: {},
              },
            },
          },
        },
        email: {
          initial: 'valid',
          states: {
            valid: {},
            error: {
              initial: 'emptyEmail',
              states: {
                emptyEmail: {},
              },
            },
          },
        },
      },
    },

    submitting: {
      on: {
        RESOLVE: 'success',
        FALIURE: {
          target: 'editing',
        },
      },
    },
    success: {
      type: 'final',
    },
  },
});
