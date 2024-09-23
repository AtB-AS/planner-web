import { TransportModeType } from '@atb-as/config-specs';
import { assign, fromPromise, setup } from 'xstate';
import { Line } from '../server/journey-planner/validators';
import { machineEvents, Area } from '../machineEvents';
import { InputErrorMessages, commonFieldValidator } from '../validation';
import { convertFilesToBase64 } from '../utils';

type APIParams = {
  formType:
    | 'driver'
    | 'transportation'
    | 'delay'
    | 'stop'
    | 'serviceOffering'
    | 'injury'
    | undefined;
  area: Area | undefined;
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

export type ContextProps = {
  wantsToBeContacted: boolean;
  errorMessages: InputErrorMessages;
} & APIParams;

export const meansOfTransportFormMachine = setup({
  types: {
    context: {} as ContextProps,
    events: machineEvents,
  },
  guards: {
    validateInputs: ({ context }) => commonFieldValidator(context),
  },
  actions: {
    setFormType: assign({
      formType: ({ event }) => {
        switch (event.type) {
          case 'DRIVER_FORM':
            return 'driver';
          case 'TRANSPORTATION_FORM':
            return 'transportation';
          case 'DELAY_FORM':
            return 'delay';
          case 'STOP_FORM':
            return 'stop';
          case 'SERVICE_OFFERING_FORM':
            return 'serviceOffering';
          case 'INJURY_FORM':
            return 'injury';
          default:
            return undefined;
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
          area,
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
        return await fetch('api/contact/means-of-transport', {
          method: 'POST',
          body: JSON.stringify({
            area: area,
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
            attachments: base64EncodedAttachments,
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
    formType: undefined,
    area: undefined,
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
        TRANSPORTATION_FORM: {
          target: 'editing.transportationForm',
        },
        DELAY_FORM: {
          target: 'editing.delayForm',
        },
        STOP_FORM: {
          target: 'editing.stopForm',
        },
        SERVICE_OFFERING_FORM: {
          target: 'editing.serviceOfferingForm',
        },
        INJURY_FORM: {
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
          entry: ['cleanErrorMessages', 'setFormType'],
          tags: 'driverForm',
        },

        transportationForm: {
          entry: ['cleanErrorMessages', 'setFormType'],
          tags: 'transportationForm',
        },

        delayForm: {
          entry: ['cleanErrorMessages', 'setFormType'],
          tags: 'delayForm',
        },

        stopForm: {
          entry: ['cleanErrorMessages', 'setFormType'],
          tags: 'stopForm',
        },

        serviceOfferingForm: {
          entry: ['cleanErrorMessages', 'setFormType'],
          tags: 'serviceOfferingForm',
        },

        injuryForm: {
          entry: ['cleanErrorMessages', 'setFormType'],
          tags: 'injuryForm',
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
          formType: context.formType,
          area: context.area,
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
