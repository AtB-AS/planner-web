import { TransportModeType } from '@atb-as/config-specs';
import { assign, fromPromise, setup } from 'xstate';
import { Line } from '../server/journey-planner/validators';
import { machineEvents, RouteArea } from '../machineEvents';
import {
  InputErrorMessages,
  travelGuaranteeFieldValidator,
} from '../validation';
import { convertFilesToBase64 } from '../utils';

type APIParams = {
  routeArea: RouteArea | undefined;
  transportMode: TransportModeType | undefined;
  line: Line | undefined;
  fromStop: Line['quays'][0] | undefined;
  toStop: Line['quays'][0] | undefined;
  date: string;
  plannedDepartureTime: string;
  feedback: string;
  attachments?: File[];
  firstName: string;
  lastName: string;
  email: string;
};

type ContextProps = {
  modeOfTransportStateWhenSubmitted:
    | 'driverForm'
    | 'transportationForm'
    | 'delayForm'
    | 'stopForm'
    | 'serviceOfferingForm'
    | 'injuryForm'
    | undefined;
  wantsToBeContacted: boolean;
  errorMessages: InputErrorMessages;
} & APIParams;

export const modeOfTransportFormMachine = setup({
  types: {
    context: {} as ContextProps,
    events: machineEvents,
  },
  guards: {
    validateInputs: ({ context }) => travelGuaranteeFieldValidator(context),
  },
  actions: {
    setCurrentStateWhenSubmitted: assign({
      modeOfTransportStateWhenSubmitted: ({ event }) => {
        switch (event.type) {
          case 'DRIVER_FORM':
            return 'driverForm';
          case 'TRANSPORTATION_FORM':
            return 'transportationForm';
          case 'DELAY_FORM':
            return 'delayForm';
          case 'STOP_FORM':
            return 'stopForm';
          case 'SERVICE_OFFERING_FORM':
            return 'serviceOfferingForm';
          case 'INJURY_FORM':
            return 'injuryForm';
          default:
            return undefined; // In case of an unexpected event type
        }
      },
    }),

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

    toggleField: assign(({ context, event }: any) => {
      if (event.type === 'TOGGLE') {
        const { field } = event;
        return {
          [field]: !context[field],
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
          routeArea,
          transportMode,
          line,
          fromStop,
          toStop,
          date,
          plannedDepartureTime,
          feedback,
          attachments,
          firstName,
          lastName,
          email,
        },
      }: {
        input: APIParams;
      }) => {
        const base64EncodedAttachments = await convertFilesToBase64(
          attachments || [],
        );
        return await fetch('/contact/mode-of-transport', {
          method: 'POST',
          body: JSON.stringify({
            routeArea: routeArea,
            transportMode: transportMode,
            line: line,
            fromStop: fromStop,
            toStop: toStop,
            date: date,
            plannedDepartureTime: plannedDepartureTime,
            additionalInfo: feedback,
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
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiAZQFUAhAWQEkAVAbQAYBdRUAAcA9rFwAXXMPwCQAD0QBGAGzcSAZgCsATnXLlAJi2rN6gDQgAnkoDsmktxsAObstN7FN5eoC+Pi2hYeISk5FTU7ADyAOLRADIAojz8SCAiYpLSsgoIACyKJNpFxSUlFtYIRvZO6rUqBg3c3Fp+ARg4BMRklDTsAIIAGqzJsukSUjKpOSpqWrr6VSbmVojqueoaBk6K3AbOqjYGyq0ggR0hJJDj+FB0TGxcfKOi41lTiJqaBdyKmoaKTmcTkB2nKtnsjhcblqyk83hOZ2CXSukhudAS7AA+uwAEp9ABytAACpEcVjmJEACJJJ6pMaZSagHJ2NSKXKudnqGw7TSAsGVdTaEhOYpOTQ2ZqmZS5BHtJGkCjCdAQAi3CDSMBkfAAN2EAGtNYjOgqlSqbggCLrMOgGckRnSXgzsh8vg5fv9AcCQfztiRcsVnHpuO4bLKgsaSIrlarqGAAE5x4RxkiCCg2gBmSdQJCNFyjZqgFp1wmttr49qEjomzoQn2+7oMAKB3pWlQM9nF20cn20nj8-hA+GEEDgslzxGeGWr7wQAFplA4mkvl8ubPz52Hzl0wmBJ69GfIPkLcgZtMpudovmze6DW7UbH7FGzT9wnA12TKB+PSCjVXunTO2wPq47anmK3DaGKuT8msBS5M4EFit4Ng2OoBifm04Z5qaf4OlObxMqsmi5H6TjrGRhwoV4wb8r8BgOAh5FNCo56bvKJCwAArpgmBwPAeH7jWQEOIYmhgZoiHEbRzQkKY2jBl83C5GKnihv2QA */
  initial: 'editing',
  context: {
    routeArea: undefined,
    modeOfTransportStateWhenSubmitted: undefined,
    transportMode: undefined,
    line: undefined,
    fromStop: undefined,
    toStop: undefined,
    date: new Date().toISOString().split('T')[0],
    plannedDepartureTime: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
    feedback: '',
    firstName: '',
    lastName: '',
    email: '',
    wantsToBeContacted: false,
    errorMessages: {},
  },
  states: {
    editing: {
      initial: 'idle',
      on: {
        DRIVER_FORM: {
          target: 'editing.driverForm',
        },
        TRANSPORT_FEEDBACK: {
          target: 'editing.transportationForm',
        },
        DELAY_FORM: {
          target: 'editing.delayForm',
        },
        STOP_FORM: {
          target: 'editing.stopForm',
        },
        ROUTE_OFFER_FEEDBACK: {
          target: 'editing.serviceOfferingForm',
        },
        INCIDENT_REPORT: {
          target: 'editing.injuryForm',
        },

        TOGGLE: {
          actions: 'toggleField',
        },

        UPDATE_FIELD: {
          actions: 'updateField',
        },
        VALIDATE: {
          guard: 'validateInputs',
          target: 'editing.readyForSubmit',
        },
      },

      states: {
        idle: {},
        driverForm: {
          entry: ['cleanErrorMessages', 'setCurrentStateWhenSubmitted'],
          tags: ['driverForm', 'selected'],
        },

        transportationForm: {
          entry: ['cleanErrorMessages', 'setCurrentStateWhenSubmitted'],
          tags: ['transportationForm', 'selected'],
        },

        delayForm: {
          entry: ['cleanErrorMessages', 'setCurrentStateWhenSubmitted'],
          tags: ['delayForm', 'selected'],
        },

        stopForm: {
          entry: ['cleanErrorMessages', 'setCurrentStateWhenSubmitted'],
          tags: ['stopForm', 'selected'],
        },

        serviceOfferingForm: {
          entry: ['cleanErrorMessages', 'setCurrentStateWhenSubmitted'],
          tags: ['serviceOfferingForm', 'selected'],
        },

        injuryForm: {
          entry: ['cleanErrorMessages', 'setCurrentStateWhenSubmitted'],
          tags: ['injuryForm', 'selected'],
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
          routeArea: context.routeArea,
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
