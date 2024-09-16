import { TransportModeType } from '@atb-as/config-specs';
import { assign, fromPromise, setup } from 'xstate';
import { Line } from '../server/journey-planner/validators';
import { machineEvents } from '../machineEvents';
import { InputErrorMessages, formInputValidator } from '../formInputValidator';

export const fetchMachine = setup({
  types: {
    context: {} as {
      isIntialAgreementChecked: boolean;
      transportMode: TransportModeType | undefined;
      line: Line | undefined;
      departureLocation: Line['quays'][0] | undefined;
      arrivalLocation: Line['quays'][0] | undefined;
      date: string;
      time: string;
      feedback: string;
      firstname: string;
      lastname: string;
      email: string;
      address: string;
      postalCode: string;
      phonenumber: string;
      city: string;
      bankAccount: string;
      IBAN: string;
      SWIFT: string;
      errorMessages: InputErrorMessages;
    },
    events: machineEvents,
  },
  guards: {
    validateInputs: ({ context }) => formInputValidator(context),
  },
  actions: {
    setIsIntialAgreementChecked: assign({
      isIntialAgreementChecked: ({ context }) =>
        !context.isIntialAgreementChecked,
    }),
    setTransportMode: assign({
      transportMode: ({ event }) =>
        (
          event as {
            type: 'SET_TRANSPORT_MODE';
            transportMode: TransportModeType;
          }
        ).transportMode,
    }),
    setLine: assign({
      line: ({ event }) => (event as { type: 'SET_LINE'; line: Line }).line,
    }),
    setDepartureLocation: assign({
      departureLocation: ({ event }) =>
        (
          event as {
            type: 'SET_DEPARTURE_LOCATION';
            departureLocation: Line['quays'][0];
          }
        ).departureLocation,
    }),
    setArrivalLocation: assign({
      arrivalLocation: ({ event }) =>
        (
          event as {
            type: 'SET_ARRIVAL_LOCATION';
            arrivalLocation: Line['quays'][0];
          }
        ).arrivalLocation,
    }),
    setFeedback: assign({
      feedback: ({ event }) =>
        (event as { type: 'SET_FEEDBACK'; feedback: string }).feedback,
    }),
    setFirstname: assign({
      firstname: ({ event }) =>
        (event as { type: 'SET_FIRSTNAME'; firstname: string }).firstname,
    }),
    setLastname: assign({
      lastname: ({ event }) =>
        (event as { type: 'SET_LASTNAME'; lastname: string }).lastname,
    }),
    setAddress: assign({
      address: ({ event }) =>
        (event as { type: 'SET_ADDRESS'; address: string }).address,
    }),
    setPostalCode: assign({
      postalCode: ({ event }) =>
        (event as { type: 'SET_POSTAL_CODE'; postalCode: string }).postalCode,
    }),
    setCity: assign({
      city: ({ event }) => (event as { type: 'SET_CITY'; city: string }).city,
    }),
    setEmail: assign({
      email: ({ event }) =>
        (event as { type: 'SET_EMAIL'; email: string }).email,
    }),
    setPhonenumber: assign({
      phonenumber: ({ event }) =>
        (event as { type: 'SET_PHONENUMBER'; phonenumber: string }).phonenumber,
    }),
    setBankAccount: assign({
      bankAccount: ({ event }) =>
        (event as { type: 'SET_BANK_ACCOUNT'; bankAccount: string })
          .bankAccount,
    }),
    setIBAN: assign({
      IBAN: ({ event }) => (event as { type: 'SET_IBAN'; IBAN: string }).IBAN,
    }),
    setSWIFT: assign({
      SWIFT: ({ event }) =>
        (event as { type: 'SET_SWIFT'; SWIFT: string }).SWIFT,
    }),
  },
  actors: {
    callAPI: fromPromise(async ({ context }: any) => {
      return await fetch('/api/travel-guarantee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(context),
      }).then((response) => {
        // throw an error to force onError
        if (!response.ok) {
          throw new Error('Failed to call API'); // You can add more specific error details if needed
        }
      });
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiAZQFUAhAWQEkAVAbQAYBdRUAAcA9rFwAXXMPwCQAD0QBGAGzcSAZgCsATnXLlAJi2rN6gDQgAnkoDsmktxsAObstN7FN5eoC+Pi2hYeISk5FTU7ADyAOLRADIAojz8SCAiYpLSsgoIACyKJNpFxSUlFtYIRvZO6rUqBg3c3Fp+ARg4BMRklDTsAIIAGqzJsukSUjKpOSpqWrr6VSbmVojqueoaBk6K3AbOqjYGyq0ggR0hJJDj+FB0TGxcfKOi41lTiJqaBdyKmoaKTmcTkB2nKtnsjhcblqyk83hOZ2CXSukhudAS7AA+uwAEp9ABytAACpEcVjmJEACJJJ6pMaZSagHJ2NSKXKudnqGw7TSAsGVdTaEhOYpOTQ2ZqmZS5BHtJGkCjCdAQAi3CDSMBkfAAN2EAGtNYjOgqlSqbggCLrMOgGckRnSXgzsh8vg5fv9AcCQfztiRcsVnHpuO4bLKgsaSIrlarqGAAE5x4RxkiCCg2gBmSdQJCNFyjZqgFp1wmttr49qEjomzoQn2+7oMAKB3pWlQM9nF20cn20nj8-hA+GEEDgslzxGeGWr7wQAFplA4mkvl8ubPz52Hzl0wmBJ69GfIPkLcgZtMpudovmze6DW7UbH7FGzT9wnA12TKB+PSCjVXunTO2wPq47anmK3DaGKuT8msBS5M4EFit4Ng2OoBifm04Z5qaf4OlObxMqsmi5H6TjrGRhwoV4wb8r8BgOAh5FNCo56bvKJCwAArpgmBwPAeH7jWQEOIYmhgZoiHEbRzQkKY2jBl83C5GKnihv2QA */
  initial: 'editing',
  context: {
    isIntialAgreementChecked: false,
    transportMode: undefined,
    line: undefined,
    departureLocation: undefined,
    arrivalLocation: undefined,
    date: new Date().toISOString().split('T')[0],
    time: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
    feedback: '',
    firstname: '',
    lastname: '',
    email: '',
    address: '',
    postalCode: '',
    phonenumber: '',
    city: '',
    bankAccount: '',
    IBAN: '',
    SWIFT: '',
    errorMessages: {},
  },
  states: {
    editing: {
      initial: 'idle',
      on: {
        TAXI: {
          target: 'editing.taxi',
        },
        CAR: {
          target: 'editing.car',
        },
        OTHER: {
          target: 'editing.other',
        },
        SET_FEEDBACK: {
          actions: 'setFeedback',
        },
        SET_FIRSTNAME: {
          actions: 'setFirstname',
        },
        SET_LASTNAME: {
          actions: 'setLastname',
        },
        SET_EMAIL: {
          actions: 'setEmail',
        },
        SET_ADDRESS: {
          actions: 'setAddress',
        },
        SET_POSTAL_CODE: {
          actions: 'setPostalCode',
        },
        SET_CITY: {
          actions: 'setCity',
        },
        SET_PHONENUMBER: {
          actions: 'setPhonenumber',
        },
        SET_BANK_ACCOUNT: {
          actions: 'setBankAccount',
        },
        SET_IBAN: {
          actions: 'setIBAN',
        },
        SET_SWIFT: {
          actions: 'setSWIFT',
        },
      },

      states: {
        idle: {
          on: {
            TOGGLE: {
              actions: 'setIsIntialAgreementChecked',
            },
          },
        },

        taxi: {
          on: {
            SET_TRANSPORT_MODE: {
              actions: 'setTransportMode',
            },
            SET_LINE: {
              actions: 'setLine',
            },
            SET_DEPARTURE_LOCATION: {
              actions: 'setDepartureLocation',
            },
            SET_ARRIVAL_LOCATION: {
              actions: 'setArrivalLocation',
            },
            VALIDATE: {
              guard: 'validateInputs',
              target: 'readyForSubmitt',
            },
          },

          tags: ['taxi', 'selected'],
        },

        car: {
          on: {
            VALIDATE: {
              guard: 'validateInputs',
              target: 'readyForSubmitt',
            },
          },
          tags: ['car', 'selected'],
        },

        other: {
          on: {
            VALIDATE: {
              guard: 'validateInputs',
              target: 'readyForSubmitt',
            },
          },
          tags: ['other', 'selected'],
        },
        readyForSubmitt: {
          type: 'final',
        },
      },

      onDone: {
        target: 'submitting',
      },
    },

    submitting: {
      invoke: {
        src: 'callAPI',
        input: ({ context }) => ({ context }),

        onDone: {
          target: 'success',
        },

        onError: 'editing',
      },
    },

    success: {
      type: 'final',
    },
  },
});
