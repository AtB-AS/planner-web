import { TransportModeType } from '@atb-as/config-specs';
import { assign, fromPromise, setup } from 'xstate';
import { Line } from '../server/journey-planner/validators';
import { machineEvents, Area } from '../machineEvents';
import { InputErrorMessages, commonFieldValidator } from '../validation';
import {
  convertFilesToBase64,
  getCurrentDateString,
  getCurrentTimeString,
} from '../utils';

export enum FormType {
  Driver = 'driver',
  Transportation = 'transportation',
  Delay = 'delay',
  Stop = 'stop',
  ServiceOffering = 'serviceOffering',
  Injury = 'injury',
}

type APIParams = {
  formType: FormType | undefined;
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
  target?: string;
  isContactInfoOptional: boolean;
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
    updateField: assign(({ context, event }) => {
      if (event.type === 'UPDATE_FIELD') {
        const { field, value } = event;

        // Remove all errorMessages if changing form type.
        // Else, remove errorMessages related to type.
        if (field === 'formType') {
          context.errorMessages = {};
        } else {
          context.errorMessages[field] = [];
        }
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
    date: getCurrentDateString(),
    plannedDepartureTime: getCurrentTimeString(),
    feedback: '',
    firstName: '',
    lastName: '',
    email: '',
    isContactInfoOptional: true,
    wantsToBeContacted: false,
    errorMessages: {},
  },
  states: {
    editing: {
      initial: 'idle',
      on: {
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