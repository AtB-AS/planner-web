import { TransportModeType } from '@atb-as/config-specs';
import { assign, fromPromise, setup } from 'xstate';
import { Line } from '../server/journey-planner/validators';
import { machineEvents } from '../machineEvents';
import { InputErrorMessages, formInputValidator } from '../formInputValidator';
import { TranslatedString } from '@atb/translations';

export const fetchMachine = setup({
  types: {
    context: {} as {
      isIntialAgreementChecked: boolean;
      isBankAccountForeign: boolean;
      transportMode: TransportModeType | undefined;
      line: Line | undefined;
      fromStop: Line['quays'][0] | undefined;
      toStop: Line['quays'][0] | undefined;
      date: string;
      plannedDepartureTime: string;
      kilometersDriven: string;
      reasonForTransportFailure:
        | { id: string; name: TranslatedString }
        | undefined;
      feedback: string;
      firstName: string;
      lastName: string;
      email: string;
      address: string;
      postalCode: string;
      phoneNumber: string;
      city: string;
      bankAccountNumber: string;
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
    setIsBankAccountForeign: assign({
      isBankAccountForeign: ({ context }) => !context.isBankAccountForeign,
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
    setFromStop: assign({
      fromStop: ({ event }) =>
        (
          event as {
            type: 'SET_FROM_STOP';
            fromStop: Line['quays'][0];
          }
        ).fromStop,
    }),
    setArrivalLocation: assign({
      toStop: ({ event }) =>
        (
          event as {
            type: 'SET_TO_STOP';
            toStop: Line['quays'][0];
          }
        ).toStop,
    }),
    setDate: assign({
      date: ({ event }) =>
        (
          event as {
            type: 'SET_DATE';
            date: string;
          }
        ).date,
    }),
    setPlannedDepartureTime: assign({
      plannedDepartureTime: ({ event }) =>
        (
          event as {
            type: 'SET_PLANNED_DEPARTURE_TIME';
            plannedDepartureTime: string;
          }
        ).plannedDepartureTime,
    }),

    setReasonForTransportFailiure: assign({
      reasonForTransportFailure: ({ event }) =>
        (
          event as {
            type: 'SET_REASON_FOR_TRANSPORT_FAILIURE';
            reasonForTransportFailure: { id: string; name: TranslatedString };
          }
        ).reasonForTransportFailure,
    }),

    setKilometersDriven: assign({
      kilometersDriven: ({ event }) =>
        (event as { type: 'SET_KILOMETRES_DRIVEN'; kilometersDriven: string })
          .kilometersDriven,
    }),

    setFeedback: assign({
      feedback: ({ event }) =>
        (event as { type: 'SET_FEEDBACK'; feedback: string }).feedback,
    }),
    setFirstName: assign({
      firstName: ({ event }) =>
        (event as { type: 'SET_FIRSTNAME'; firstName: string }).firstName,
    }),
    setLastName: assign({
      lastName: ({ event }) =>
        (event as { type: 'SET_LASTNAME'; lastName: string }).lastName,
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
    setPhoneNumber: assign({
      phoneNumber: ({ event }) =>
        (event as { type: 'SET_PHONENUMBER'; phoneNumber: string }).phoneNumber,
    }),
    setBankAccountNumber: assign({
      bankAccountNumber: ({ event }) =>
        (
          event as {
            type: 'SET_BANK_ACCOUNT_NUMBER';
            bankAccountNumber: string;
          }
        ).bankAccountNumber,
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
        body: JSON.stringify({
          transportMode: context.transportMode,
          line: context.line,
          fromStop: context.fromStop,
          toStop: context.toStop,
          date: context.date,
          plannedDepartureTime: context.plannedDepartureTime,
          reasonForTransportFailure: context.reasonForTransportFailure,
          additionalInfo: context.feedback,
          firstName: context.firstName,
          lastName: context.lastName,
          address: context.address,
          postalCode: context.postalCode,
          city: context.city,
          email: context.email,
          phoneNumber: context.phoneNumber,
          bankAccountNumber: context.bankAccount,
          IBAN: context.IBAN,
          SWIFT: context.SWIFT,
          kilometersDriven: context.kilometersDriven,
          fromAddress: context.fromAddress,
          toAddress: context.toAddress,
        }),
      }).then((response) => {
        // throw an error to force onError
        if (!response.ok) throw new Error('Failed to call API');
      });
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiAZQFUAhAWQEkAVAbQAYBdRUAAcA9rFwAXXMPwCQAD0QBGAGzcSAZgCsATnXLlAJi2rN6gDQgAnkoDsmktxsAObstN7FN5eoC+Pi2hYeISk5FTU7ADyAOLRADIAojz8SCAiYpLSsgoIACyKJNpFxSUlFtYIRvZO6rUqBg3c3Fp+ARg4BMRklDTsAIIAGqzJsukSUjKpOSpqWrr6VSbmVojqueoaBk6K3AbOqjYGyq0ggR0hJJDj+FB0TGxcfKOi41lTiJqaBdyKmoaKTmcTkB2nKtnsjhcblqyk83hOZ2CXSukhudAS7AA+uwAEp9ABytAACpEcVjmJEACJJJ6pMaZSagHJ2NSKXKudnqGw7TSAsGVdTaEhOYpOTQ2ZqmZS5BHtJGkCjCdAQAi3CDSMBkfAAN2EAGtNYjOgqlSqbggCLrMOgGckRnSXgzsh8vg5fv9AcCQfztiRcsVnHpuO4bLKgsaSIrlarqGAAE5x4RxkiCCg2gBmSdQJCNFyjZqgFp1wmttr49qEjomzoQn2+7oMAKB3pWlQM9nF20cn20nj8-hA+GEEDgslzxGeGWr7wQAFplA4mkvl8ubPz52Hzl0wmBJ69GfIPkLcgZtMpudovmze6DW7UbH7FGzT9wnA12TKB+PSCjVXunTO2wPq47anmK3DaGKuT8msBS5M4EFit4Ng2OoBifm04Z5qaf4OlObxMqsmi5H6TjrGRhwoV4wb8r8BgOAh5FNCo56bvKJCwAArpgmBwPAeH7jWQEOIYmhgZoiHEbRzQkKY2jBl83C5GKnihv2QA */
  initial: 'editing',
  context: {
    isIntialAgreementChecked: false,
    isBankAccountForeign: false,
    transportMode: undefined,
    line: undefined,
    fromStop: undefined,
    toStop: undefined,
    date: new Date().toISOString().split('T')[0],
    plannedDepartureTime: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
    reasonForTransportFailure: undefined,
    kilometersDriven: '',
    feedback: '',
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    postalCode: '',
    phoneNumber: '',
    city: '',
    bankAccountNumber: '',
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
          actions: 'setFirstName',
        },
        SET_LASTNAME: {
          actions: 'setLastName',
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
          actions: 'setPhoneNumber',
        },
        SET_BANK_ACCOUNT_NUMBER: {
          actions: 'setBankAccountNumber',
        },
        SET_IBAN: {
          actions: 'setIBAN',
        },
        SET_SWIFT: {
          actions: 'setSWIFT',
        },
        SET_BANK_ACCOUNT_FOREIGN: {
          actions: 'setIsBankAccountForeign',
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
            SET_FROM_STOP: {
              actions: 'setFromStop',
            },
            SET_ARRIVAL_LOCATION: {
              actions: 'setArrivalLocation',
            },
            SET_DATE: {
              actions: 'setDate',
            },
            SET_PLANNED_DEPARTURE_TIME: {
              actions: 'setPlannedDepartureTime',
            },
            SET_REASON_FOR_TRANSPORT_FAILIURE: {
              actions: 'setReasonForTransportFailiure',
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
            SET_KILOMETRES_DRIVEN: {
              actions: 'setKilometersDriven',
            },
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
