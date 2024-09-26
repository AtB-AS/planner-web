import { TransportModeType } from '@atb-as/config-specs';
import { assign, fromPromise, setup } from 'xstate';
import { Line } from '../server/journey-planner/validators';
import { ReasonForTransportFailure } from './events';
import {
  InputErrorMessages,
  travelGuaranteeInputValidator,
} from '../validation';
import { getCurrentDateString, getCurrentTimeString } from '../utils';
import { TravelGuaranteeFormEvents } from './events';

type APIParams = {
  transportMode: TransportModeType | undefined;
  line: Line | undefined;
  fromStop: Line['quays'][0] | undefined;
  toStop: Line['quays'][0] | undefined;
  date: string;
  plannedDepartureTime: string;
  kilometersDriven: string;
  reasonForTransportFailure: ReasonForTransportFailure | undefined;
  feedback: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  postalCode: string;
  city: string;
  phoneNumber: string;
  bankAccountNumber: string;
  IBAN: string;
  SWIFT: string;
};

type ContextProps = {
  isIntialAgreementChecked: boolean;
  hasInternationalBankAccount: boolean;
  travelGuaranteeStateWhenSubmitted: 'car' | 'taxi' | 'other' | undefined;
  errorMessages: InputErrorMessages;
} & APIParams;

export const fetchMachine = setup({
  types: {
    context: {} as ContextProps,
    events: TravelGuaranteeFormEvents,
  },
  guards: {
    validateInputs: ({ context }) => {
      context.errorMessages = travelGuaranteeInputValidator(context);
      return Object.keys(context.errorMessages).length > 0 ? false : true;
    },
  },
  actions: {
    setCurrentStateWhenSubmitted: assign({
      travelGuaranteeStateWhenSubmitted: ({ event }) => {
        switch (event.type) {
          case 'TAXI':
            return 'taxi';
          case 'CAR':
            return 'car';
          case 'OTHER':
            return 'other';
          default:
            return undefined; // In case of an unexpected event type
        }
      },
    }),

    navigateToErrorPage: () => {
      window.location.href = '/contact/error';
    },
    navigateToSuccessPage: () => {
      window.location.href = '/contact/success';
    },

    onInputChange: assign(({ context, event }) => {
      if (event.type === 'ON_INPUT_CHANGE') {
        let { inputName, value } = event;
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
          kilometersDriven: kilometersDriven,
          reasonForTransportFailure,
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
        },
      }: {
        input: APIParams;
      }) => {
        return await fetch('/contact/travel-guarantee', {
          method: 'POST',
          body: JSON.stringify({
            transportMode: transportMode,
            line: line,
            fromStop: fromStop,
            toStop: toStop,
            date: date,
            plannedDepartureTime: plannedDepartureTime,
            reasonForTransportFailure: reasonForTransportFailure,
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
            kilometersDriven: kilometersDriven,
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
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiAZQFUAhAWQEkAVAbQAYBdRUAAcA9rFwAXXMPwCQAD0QBGAGzcSAZgCsATnXLlAJi2rN6gDQgAnkoDsmktxsAObstN7FN5eoC+Pi2hYeISk5FTU7ADyAOLRADIAojz8SCAiYpLSsgoIACyKJNpFxSUlFtYIRvZO6rUqBg3c3Fp+ARg4BMRklDTsAIIAGqzJsukSUjKpOSpqWrr6VSbmVojqueoaBk6K3AbOqjYGyq0ggR0hJJDj+FB0TGxcfKOi41lTiJqaBdyKmoaKTmcTkB2nKtnsjhcblqyk83hOZ2CXSukhudAS7AA+uwAEp9ABytAACpEcVjmJEACJJJ6pMaZSagHJ2NSKXKudnqGw7TSAsGVdTaEhOYpOTQ2ZqmZS5BHtJGkCjCdAQAi3CDSMBkfAAN2EAGtNYjOgqlSqbggCLrMOgGckRnSXgzsh8vg5fv9AcCQfztiRcsVnHpuO4bLKgsaSIrlarqGAAE5x4RxkiCCg2gBmSdQJCNFyjZqgFp1wmttr49qEjomzoQn2+7oMAKB3pWlQM9nF20cn20nj8-hA+GEEDgslzxGeGWr7wQAFplA4mkvl8ubPz52Hzl0wmBJ69GfIPkLcgZtMpudovmze6DW7UbH7FGzT9wnA12TKB+PSCjVXunTO2wPq47anmK3DaGKuT8msBS5M4EFit4Ng2OoBifm04Z5qaf4OlObxMqsmi5H6TjrGRhwoV4wb8r8BgOAh5FNCo56bvKJCwAArpgmBwPAeH7jWQEOIYmhgZoiHEbRzQkKY2jBl83C5GKnihv2QA */
  initial: 'editing',
  context: {
    isIntialAgreementChecked: false,
    hasInternationalBankAccount: false,
    travelGuaranteeStateWhenSubmitted: undefined,
    transportMode: undefined,
    line: undefined,
    fromStop: undefined,
    toStop: undefined,
    date: getCurrentDateString(),
    plannedDepartureTime: getCurrentTimeString(),
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
        taxi: {
          entry: ['cleanErrorMessages', 'setCurrentStateWhenSubmitted'],
          tags: ['taxi', 'selected'],
        },

        car: {
          entry: ['cleanErrorMessages', 'setCurrentStateWhenSubmitted'],
          tags: ['car', 'selected'],
        },

        other: {
          entry: ['cleanErrorMessages', 'setCurrentStateWhenSubmitted'],
          tags: ['other', 'selected'],
        },
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
        src: 'callAPI',
        input: ({ context }) => ({
          transportMode: context.transportMode,
          line: context.line,
          fromStop: context.fromStop,
          toStop: context.toStop,
          date: context.date,
          plannedDepartureTime: context.plannedDepartureTime,
          kilometersDriven: context.kilometersDriven,
          reasonForTransportFailure: context.reasonForTransportFailure,
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
