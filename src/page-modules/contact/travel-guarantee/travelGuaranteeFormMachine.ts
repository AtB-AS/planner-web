import { TransportModeType } from '@atb-as/config-specs';
import { assign, fromPromise, setup } from 'xstate';
import { Line } from '../server/journey-planner/validators';
import { PageText, TranslatedString } from '@atb/translations';

type InputErrorMessages = {
  [key: string]: TranslatedString[]; // Error messages indexed by field name
};

export const fetchMachine = setup({
  types: {
    context: {} as {
      isChecked: boolean;
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

      apiResponse: boolean | undefined;
      errorMessages: InputErrorMessages;
    },
    events: {} as
      | { type: 'TOGGLE' }
      | { type: 'TAXI' }
      | { type: 'CAR' }
      | { type: 'OTHER' }
      | { type: 'SUBMIT' }
      | { type: 'SET_TRANSPORT_MODE'; transportMode: TransportModeType }
      | { type: 'SET_LINE'; line: Line }
      | { type: 'SET_DEPARTURE_LOCATION'; departureLocation: Line['quays'][0] }
      | { type: 'SET_ARRIVAL_LOCATION'; arrivalLocation: Line['quays'][0] }
      | { type: 'SET_DATE'; date: string }
      | { type: 'SET_TIME'; time: string }
      | { type: 'SET_FEEDBACK'; feedback: string }
      | { type: 'SET_FIRSTNAME'; firstname: string }
      | { type: 'SET_LASTNAME'; lastname: string }
      | { type: 'SET_EMAIL'; email: string }
      | { type: 'SET_ADDRESS'; address: string }
      | { type: 'SET_POSTAL_CODE'; postalCode: string }
      | { type: 'SET_PHONENUMBER'; phonenumber: string }
      | { type: 'SET_CITY'; city: string }
      | { type: 'SET_BANK_ACCOUNT'; bankAccount: string }
      | { type: 'SET_IBAN'; IBAN: string }
      | { type: 'SET_SWIFT'; SWIFT: string },

    input: {} as {
      isChecked: boolean;
      date: string;
      time: string;
    },
  },
  guards: {
    // TODO: Create guard to validate form input. Maybe create one guard combined by mulpiple guards.
    isValid: () => {
      return true;
    },
    validApiResponse: ({ context }) => {
      return !!context.apiResponse;
    },

    validateInputs: ({ context }) => {
      const inputErrorMessages: InputErrorMessages = {};

      if (!context.firstname) {
        if (!inputErrorMessages['firstname']) {
          inputErrorMessages['firstname'] = []; // Initialize the array if it doesn't exist
        }
        inputErrorMessages['firstname'].push(
          PageText.Contact.aboutYouInfo.lastname,
        );
      }

      if (!context.lastname) {
        if (!inputErrorMessages['lastname']) {
          inputErrorMessages['lastname'] = []; // Initialize the array if it doesn't exist
        }
        inputErrorMessages['lastname'].push(
          PageText.Contact.aboutYouInfo.lastname,
        );
      }

      // Check for Email
      if (!context.email) {
        if (!inputErrorMessages['email']) {
          inputErrorMessages['email'] = []; // Initialize the array if it doesn't exist
        }
        inputErrorMessages['email'].push(PageText.Contact.aboutYouInfo.email);
      }

      // Check for Address
      if (!context.address) {
        if (!inputErrorMessages['address']) {
          inputErrorMessages['address'] = []; // Initialize the array if it doesn't exist
        }
        inputErrorMessages['address'].push(
          PageText.Contact.aboutYouInfo.address,
        );
      }

      // Check for Postal Code
      if (!context.postalCode) {
        if (!inputErrorMessages['postalCode']) {
          inputErrorMessages['postalCode'] = []; // Initialize the array if it doesn't exist
        }
        inputErrorMessages['postalCode'].push(
          PageText.Contact.aboutYouInfo.postalCode,
        );
      }

      // Check for City
      if (!context.city) {
        if (!inputErrorMessages['city']) {
          inputErrorMessages['city'] = []; // Initialize the array if it doesn't exist
        }
        inputErrorMessages['city'].push(PageText.Contact.aboutYouInfo.city);
      }

      // Check for Phone Number
      if (!context.phonenumber) {
        if (!inputErrorMessages['phonenumber']) {
          inputErrorMessages['phonenumber'] = []; // Initialize the array if it doesn't exist
        }
        inputErrorMessages['phonenumber'].push(
          PageText.Contact.aboutYouInfo.phonenumber,
        );
      }

      // Check for Bank Account
      if (!context.bankAccount) {
        if (!inputErrorMessages['bankAccount']) {
          inputErrorMessages['bankAccount'] = []; // Initialize the array if it doesn't exist
        }
        inputErrorMessages['bankAccount'].push(
          PageText.Contact.aboutYouInfo.phonenumber,
        );
      }

      // Check for IBAN
      if (!context.IBAN) {
        if (!inputErrorMessages['IBAN']) {
          inputErrorMessages['IBAN'] = []; // Initialize the array if it doesn't exist
        }
        inputErrorMessages['IBAN'].push(
          PageText.Contact.aboutYouInfo.phonenumber,
        );
      }

      // Check for SWIFT
      if (!context.SWIFT) {
        if (!inputErrorMessages['SWIFT']) {
          inputErrorMessages['SWIFT'] = []; // Initialize the array if it doesn't exist
        }
        inputErrorMessages['SWIFT'].push(
          PageText.Contact.aboutYouInfo.phonenumber,
        );
      }

      // Populate context.errorMessages
      context.errorMessages = inputErrorMessages;

      // Return false if any error
      return Object.keys(inputErrorMessages).length > 0 ? false : true;
    },
  },
  actions: {
    cleanup: assign({
      transportMode: () => undefined,
      line: () => undefined,
      departureLocation: () => undefined,
      arrivalLocation: () => undefined,
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
        if (response.ok) return { success: true };
        return { success: false };
      });
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiAZQFUAhAWQEkAVAbQAYBdRUAAcA9rFwAXXMPwCQAD0QBGAGzcSAZgCsATnXLlAJi2rN6gDQgAnkoDsmktxsAObstN7FN5eoC+Pi2hYeISk5FTU7ADyAOLRADIAojz8SCAiYpLSsgoIACyKJNpFxSUlFtYIRvZO6rUqBg3c3Fp+ARg4BMRklDTsAIIAGqzJsukSUjKpOSpqWrr6VSbmVojqueoaBk6K3AbOqjYGyq0ggR0hJJDj+FB0TGxcfKOi41lTiJqaBdyKmoaKTmcTkB2nKtnsjhcblqyk83hOZ2CXSukhudAS7AA+uwAEp9ABytAACpEcVjmJEACJJJ6pMaZSagHJ2NSKXKudnqGw7TSAsGVdTaEhOYpOTQ2ZqmZS5BHtJGkCjCdAQAi3CDSMBkfAAN2EAGtNYjOgqlSqbggCLrMOgGckRnSXgzsh8vg5fv9AcCQfztiRcsVnHpuO4bLKgsaSIrlarqGAAE5x4RxkiCCg2gBmSdQJCNFyjZqgFp1wmttr49qEjomzoQn2+7oMAKB3pWlQM9nF20cn20nj8-hA+GEEDgslzxGeGWr7wQAFplA4mkvl8ubPz52Hzl0wmBJ69GfIPkLcgZtMpudovmze6DW7UbH7FGzT9wnA12TKB+PSCjVXunTO2wPq47anmK3DaGKuT8msBS5M4EFit4Ng2OoBifm04Z5qaf4OlObxMqsmi5H6TjrGRhwoV4wb8r8BgOAh5FNCo56bvKJCwAArpgmBwPAeH7jWQEOIYmhgZoiHEbRzQkKY2jBl83C5GKnihv2QA */
  initial: 'editing',
  context: ({ input }) => ({
    isChecked: input.isChecked,
    transportMode: undefined,
    line: undefined,
    departureLocation: undefined,
    arrivalLocation: undefined,
    date: input.date,
    time: input.time,

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

    apiResponse: undefined,
    errorMessages: {},
  }),
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
        SUBMIT: {
          guard: 'validateInputs',
          target: 'submitting',
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
              actions: assign({
                isChecked: ({ context }) => !context.isChecked,
              }),
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
          },
          tags: ['taxi', 'selected'],
        },
        car: {
          tags: ['car', 'selected'],
        },
        other: {
          tags: ['other', 'selected'],
        },
      },
    },

    submitting: {
      invoke: {
        src: 'callAPI',
        input: ({ context }) => ({ context }),

        onDone: {
          actions: assign({
            apiResponse: ({ event }: any) => event.output.success,
          }),
          target: 'validateApiResponse',
        },

        onError: 'editing',
      },
    },

    validateApiResponse: {
      always: [
        {
          target: 'success',
          guard: 'validApiResponse',
        },
        {
          target: 'editing', // Stay in 'editing' if validation fails
          actions: assign({
            errorMessages: {}, // Clear messages on retry
          }),
        },
      ],
    },

    success: {},
  },
});
