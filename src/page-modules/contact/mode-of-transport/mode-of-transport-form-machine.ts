import { TransportModeType } from '@atb-as/config-specs';
import { assign, fromPromise, setup } from 'xstate';
import { Line } from '../server/journey-planner/validators';
import {
  machineEvents,
  ReasonForTransportFailure,
  RouteArea,
} from '../machineEvents';
import {
  InputErrorMessages,
  travelGuaranteeFieldValidator,
} from '../validation';

type APIParams = {
  routeArea: RouteArea | undefined;
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
};

type ContextProps = {
  modeOfTransportStateWhenSubmitted:
    | 'driverCrewFeedback'
    | 'transportFeedback'
    | 'delayEarlyCancellationReport'
    | 'stopDockFeedback'
    | 'routeOfferFeedback'
    | 'incidentReport'
    | undefined;
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
          case 'DRIVER_CREW_FEEDBACK':
            return 'driverCrewFeedback';
          case 'TRANSPORT_FEEDBACK':
            return 'transportFeedback';
          case 'DELAY_EARLY_CANCELLATION_REPORT':
            return 'delayEarlyCancellationReport';
          case 'STOP_DOCK_FEEDBACK':
            return 'stopDockFeedback';
          case 'ROUTE_OFFER_FEEDBACK':
            return 'routeOfferFeedback';
          case 'INCIDENT_REPORT':
            return 'incidentReport';
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
          firstName,
          lastName,
          email,
        },
      }: {
        input: APIParams;
      }) => {
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
    errorMessages: {},
  },
  states: {
    editing: {
      initial: 'idle',
      on: {
        DRIVER_CREW_FEEDBACK: {
          target: 'editing.driverCrewFeedback',
        },
        TRANSPORT_FEEDBACK: {
          target: 'editing.transportFeedback',
        },
        DELAY_EARLY_CANCELLATION_REPORT: {
          target: 'editing.delayEarlyCancellationReport',
        },
        STOP_DOCK_FEEDBACK: {
          target: 'editing.stopDockFeedback',
        },
        ROUTE_OFFER_FEEDBACK: {
          target: 'editing.routeOfferFeedback',
        },
        INCIDENT_REPORT: {
          target: 'editing.incidentReport',
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
        driverCrewFeedback: {
          entry: ['cleanErrorMessages', 'setCurrentStateWhenSubmitted'],
          tags: ['driverCrewFeedback', 'selected'],
        },

        transportFeedback: {
          entry: ['cleanErrorMessages', 'setCurrentStateWhenSubmitted'],
          tags: ['transportFeedback', 'selected'],
        },

        delayEarlyCancellationReport: {
          entry: ['cleanErrorMessages', 'setCurrentStateWhenSubmitted'],
          tags: ['delayEarlyCancellationReport', 'selected'],
        },

        stopDockFeedback: {
          entry: ['cleanErrorMessages', 'setCurrentStateWhenSubmitted'],
          tags: ['stopDockFeedback', 'selected'],
        },

        routeOfferFeedback: {
          entry: ['cleanErrorMessages', 'setCurrentStateWhenSubmitted'],
          tags: ['routeOfferFeedback', 'selected'],
        },

        incidentReport: {
          entry: ['cleanErrorMessages', 'setCurrentStateWhenSubmitted'],
          tags: ['incidentReport', 'selected'],
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
