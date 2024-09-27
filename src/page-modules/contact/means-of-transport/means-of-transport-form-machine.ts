import { TransportModeType } from '@atb-as/config-specs';
import { assign, fromPromise, setup } from 'xstate';
import { Line } from '../server/journey-planner/validators';
import { commonInputValidator, InputErrorMessages } from '../validation';
import {
  convertFilesToBase64,
  getCurrentDateString,
  getCurrentTimeString,
  setLineAndResetStops,
  setTransportModeAndResetLineAndStops,
} from '../utils';
import { Area, meansOfTransportFormEvents } from './events';

export enum FormType {
  Driver = 'driver',
  Transportation = 'transportation',
  Delay = 'delay',
  Stop = 'stop',
  ServiceOffering = 'serviceOffering',
  Injury = 'injury',
}

type submitInput = {
  formType: string;
  areaName: string;
  transportMode: string;
  lineName: string;
  fromStopName: string;
  toStopName: string;
  date: string;
  plannedDepartureTime: string;
  feedback: string;
  attachments?: File[];
  firstName: string;
  lastName: string;
  email: string;
};

export type ContextProps = {
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
  target?: string;
  isContactInfoOptional: boolean;
  wantsToBeContacted: boolean;
  errorMessages: InputErrorMessages;
};

export const meansOfTransportFormMachine = setup({
  types: {
    context: {} as ContextProps,
    events: meansOfTransportFormEvents,
  },
  guards: {
    validateInputs: ({ context }) => {
      context.errorMessages = commonInputValidator(context);
      return Object.keys(context.errorMessages).length > 0 ? false : true;
    },
  },
  actions: {
    onInputChange: assign(({ context, event }) => {
      if (event.type === 'ON_INPUT_CHANGE') {
        const { inputName, value } = event;

        // Remove all errorMessages if changing form type.
        // Else, remove errorMessages related to type.
        if (inputName === 'formType') {
          context.errorMessages = {};
        } else {
          context.errorMessages[inputName] = [];
        }

        if (inputName === 'transportMode')
          return setTransportModeAndResetLineAndStops(context, value);

        if (inputName === 'line') return setLineAndResetStops(context, value);

        return {
          ...context,
          [inputName]: value,
        };
      }
      return context;
    }),
    navigateToErrorPage: () => {
      window.location.href = '/contact/error';
    },
    navigateToSuccessPage: () => {
      window.location.href = '/contact/success';
    },
  },
  actors: {
    submit: fromPromise(
      async ({
        input: {
          formType,
          areaName,
          transportMode,
          lineName,
          fromStopName,
          toStopName,
          date,
          plannedDepartureTime,
          feedback,
          attachments,
          firstName,
          lastName,
          email,
        },
      }: {
        input: submitInput;
      }) => {
        const base64EncodedAttachments = await convertFilesToBase64(
          attachments || [],
        );
        return await fetch('api/contact/means-of-transport', {
          method: 'POST',
          body: JSON.stringify({
            formType: formType,
            area: areaName,
            transportMode: transportMode,
            line: lineName,
            fromStop: fromStopName,
            toStop: toStopName,
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
        src: 'submit',
        input: ({ context }) => {
          const {
            formType,
            area,
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
          } = context;
          if (
            !formType ||
            !area ||
            !transportMode ||
            !line ||
            !fromStop ||
            !toStop
          ) {
            throw new Error(`Missing required field(s)`);
          }
          return {
            formType: formType,
            areaName: area.name.no,
            transportMode: transportMode,
            lineName: line.name,
            fromStopName: fromStop.name,
            toStopName: toStop.name,
            date: date,
            plannedDepartureTime: plannedDepartureTime,
            feedback: feedback,
            firstName: firstName,
            lastName: lastName,
            email: email,
          };
        },

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
