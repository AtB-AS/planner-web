import { TransportModeType } from '@atb-as/config-specs';
import { assign, fromPromise, setup } from 'xstate';

type ContextProps = {
  isChecked: boolean;
  transportMode: TransportModeType | undefined;
  date: string;
  time: string;
  name: string;
  apiResponse: boolean;
};

export const fetchMachine = setup({
  types: {
    context: {} as ContextProps,
    input: {} as {
      isChecked: boolean;
      date: string;
      time: string;
    },
  },
  guards: {
    isValid: () => {
      return true;
    },
    validApiResponse: ({ context }) => {
      return context.apiResponse;
    },
  },
  actors: {
    callAPI: fromPromise(async ({ context }) => {
      return await fetch('/api/travel-guarantee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Legg til Content-Type header
        },
        body: JSON.stringify(context),
      }).then((response) => response.ok);
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiAZQFUAhAWQEkAVAbQAYBdRUAAcA9rFwAXXMPwCQAD0QBGAGzcSAZgCsATnXLlAJi2rN6gDQgAnkoDsmktxsAObstN7FN5eoC+Pi2hYeISk5FTU7ADyAOLRADIAojz8SCAiYpLSsgoIACyKJNpFxSUlFtYIRvZO6rUqBg3c3Fp+ARg4BMRklDTsAIIAGqzJsukSUjKpOSpqWrr6VSbmVojqueoaBk6K3AbOqjYGyq0ggR0hJJDj+FB0TGxcfKOi41lTiJqaBdyKmoaKTmcTkB2nKtnsjhcblqyk83hOZ2CXSukhudAS7AA+uwAEp9ABytAACpEcVjmJEACJJJ6pMaZSagHJ2NSKXKudnqGw7TSAsGVdTaEhOYpOTQ2ZqmZS5BHtJGkCjCdAQAi3CDSMBkfAAN2EAGtNYjOgqlSqbggCLrMOgGckRnSXgzsh8vg5fv9AcCQfztiRcsVnHpuO4bLKgsaSIrlarqGAAE5x4RxkiCCg2gBmSdQJCNFyjZqgFp1wmttr49qEjomzoQn2+7oMAKB3pWlQM9nF20cn20nj8-hA+GEEDgslzxGeGWr7wQAFplA4mkvl8ubPz52Hzl0wmBJ69GfIPkLcgZtMpudovmze6DW7UbH7FGzT9wnA12TKB+PSCjVXunTO2wPq47anmK3DaGKuT8msBS5M4EFit4Ng2OoBifm04Z5qaf4OlObxMqsmi5H6TjrGRhwoV4wb8r8BgOAh5FNCo56bvKJCwAArpgmBwPAeH7jWQEOIYmhgZoiHEbRzQkKY2jBl83C5GKnihv2QA */
  initial: 'idle',
  context: ({ input }) => ({
    isChecked: input.isChecked,
    transportMode: undefined,
    date: input.date,
    time: input.time,
    name: 'World',
    apiResponse: false,
  }),
  states: {
    idle: {
      on: {
        SUBMIT: {
          guard: 'isValid',
          target: 'submitting',
        },
        TOGGLE: {
          actions: assign({
            isChecked: ({ context }) => !context.isChecked,
          }),
        },
        TAXI: {
          target: 'editing',
        },
      },
    },

    editing: {
      tags: ['taxi', 'selected'],
      //entry: 'cleanup',
      on: {
        SUBMIT: {
          guard: 'isValid',
          target: 'submitting',
        },
        SET_TRANSPORT_MODE: {
          actions: assign({
            transportMode: ({ event }) => event.transportMode,
          }),
        },
      },
    },

    submitting: {
      invoke: {
        src: 'callAPI',
        input: ({ context }) => ({ context }),
        onDone: {
          apiResponse: ({ event }: any) => {
            console.log('event.output ', event.output);
            return event.output;
          },
          target: 'validateApiRespone',
        },

        onError: 'editing',
      },
    },

    validateApiRespone: {
      always: [
        {
          target: 'success',
          guard: {
            type: 'validApiResponse',
          },
        },
        {
          target: 'editing',
        },
      ],
    },

    success: {},
  },
});
/*
export const travelGuaranteeFormMachine = setup({
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
      address: string;
      postalCode: string;
      city: string;
      email: string;
      phonenumber: string;
      bankAccount: string;
      iban: string;
      swift: string;
    },
    input: {} as {
      isChecked: boolean;
      date: string;
      time: string;
    },
  },

  guards: {
    isFirstnameEmpty: ({ context }) => context.firstname.length === 0,
    isLastnameEmpty: ({ context }) => context.lastname.length === 0,
    isEmailEmpty: ({ context }) => context.email.length === 0,
    isAddressEmpty: ({ context }) => context.address.length === 0,
    isPostalCodeEmpty: ({ context }) => context.postalCode.length === 0,
    isCityEmpty: ({ context }) => context.city.length === 0,
    isPhonenumberEmpty: ({ context }) => context.phonenumber.length === 0,
    isBankAccountEmpty: ({ context }) => context.bankAccount.length === 0,
  },
  actions: {
    cleanup: assign({
      transportMode: () => undefined,
      line: () => undefined,
      departureLocation: () => undefined,
      arrivalLocation: () => undefined,
    }),
    setFeedback: assign({
      feedback: ({ event }) => event.feedback,
    }),
    setFirstname: assign({
      firstname: ({ event }) => event.firstname,
    }),

    setLastname: assign({
      lastname: ({ event }) => event.lastname,
    }),

    setAddress: assign({
      address: ({ event }) => event.address,
    }),

    setPostalCode: assign({
      postalCode: ({ event }) => event.postalCode,
    }),

    setCity: assign({
      city: ({ event }) => event.city,
    }),

    setEmail: assign({
      email: ({ event }) => event.email,
    }),

    setPhonenummber: assign({
      phonenumber: ({ event }) => event.phonenumber,
    }),

    setBankAccount: assign({
      bankAccount: ({ event }) => event.bankAccount,
    }),

    setIBAN: assign({
      iban: ({ event }) => event.iban,
    }),

    setSWIFT: assign({
      swift: ({ event }) => event.swift,
    }),
  },
}).createMachine({
 
  id: 'travelGuaranteeForm',
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
    address: '',
    postalCode: '',
    city: '',
    email: '',
    phonenumber: '',
    bankAccount: '',
    iban: '',
    swift: '',
    ticketStorageMode: undefined,
  }),

  states: {
    editing: {
      on: {
        SET_TRANSPORT_MODE: {
          //guard: 'isTransportModeUndefined',
          actions: assign({
            transportMode: ({ event }) => event.transportMode,
          }),
        },
        SET_LINE: {
          actions: assign({
            line: ({ event }) => event.line,
          }),
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
        SET_ADDRESS: {
          actions: 'setAddress',
        },
        SET_POSTAL_CODE: {
          actions: 'setPostalCode',
        },
        SET_CITY: {
          actions: 'setCity',
        },
        SET_EMAIL: {
          actions: 'setEmail',
        },
        SET_PHONENUMMBER: {
          actions: 'setPhonenummber',
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
        SUBMIT: [
          {
            guard: 'isFirstnameEmpty',
            target: 'editing.firstname.error.empty',
          },

          /*
          {
            guard: 'isLastnameEmpty',
            target: 'editing.lastname.error.emptyLastname',
          },
          {
            guard: 'isAddressEmpty',
            target: 'editing.address.error.emptyAddress',
          },
          {
            guard: 'isPostalCodeEmpty',
            target: 'editing.postalCode.error.emptyPostalCode',
          },
          {
            guard: 'isCityEmpty',
            target: 'editing.city.error.emptyCity',
          },
          {
            guard: 'isEmailEmpty',
            target: 'editing.email.error.emptyEmail',
          },
          {
            guard: 'isPhonenumberEmpty',
            target: 'editing.phonenumber.error.emptyPhonenumber',
          },
          {
            guard: 'isBankAccountEmpty',
            target: 'editing.bankAccount.error.emptyBankAccount',
          },
          

          {
            target: 'submitting',
          },
        ],
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            TOGGLE: {
              actions: assign({
                isChecked: ({ context }) => !context.isChecked,
              }),
            },
            TAXI: {
              target: 'taxi',
            },

            CAR: 'car',
            OTHER: 'other',
          },
        },
        taxi: {
          tags: ['taxi', 'selected'],
          entry: 'cleanup',
          on: {
            CAR: 'car',
            OTHER: 'other',
            SET_TRANSPORT_MODE: {
              //guard: 'isTransportModeUndefined',
              actions: assign({
                transportMode: ({ event }) => event.transportMode,
              }),
            },
            SET_LINE: {
              actions: assign({
                line: ({ event }) => event.line,
              }),
            },
          },
        },
        car: {
          on: {
            TAXI: 'taxi',
            OTHER: 'other',
          },
          tags: ['car', 'selected'],
        },
        other: {
          on: {
            TAXI: 'taxi',
            CAR: 'car',
          },
          tags: ['other', 'selected'],
        },
        firstname: {
          initial: 'valid',
          type: 'parallel',

          states: {
            valid: {},
            error: {
              initial: 'empty',
              states: {
                empty: {
                  tags: ['selected', 'empty'],
                },
              },
            },
          },
        },
      },
    },

    submitting: {
      on: {
        RESOLVE: 'success',
        FAILIURE: 'editing',
      },
    },

    success: {
      type: 'final',
    },
  },
});

*/
