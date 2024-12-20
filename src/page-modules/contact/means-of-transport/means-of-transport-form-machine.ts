import { TransportModeType } from '../types';
import { assign, fromPromise, setup } from 'xstate';
import { Line } from '../server/journey-planner/validators';
import { commonInputValidator, InputErrorMessages } from '../validation';
import {
  convertFilesToBase64,
  setLineAndResetStops,
  setTransportModeAndResetLineAndStops,
} from '../utils';
import { meansOfTransportFormEvents } from './events';

export enum FormType {
  Driver = 'driver',
  Transportation = 'transportation',
  Delay = 'delay',
  Stop = 'stop',
  ServiceOffering = 'serviceOffering',
  Injury = 'injury',
}

type submitInput = {
  formType?: string;
  transportMode?: string;
  lineName?: string;
  fromStopName?: string;
  toStopName?: string;
  stopName?: string;
  date?: string;
  plannedDepartureTime?: string;
  feedback?: string;
  attachments?: File[];
  firstName?: string;
  lastName?: string;
  isResponseWanted?: boolean;
  email?: string;
};

export type ContextProps = {
  formType?: FormType;
  transportMode?: TransportModeType;
  line?: Line;
  fromStop?: Line['quays'][0];
  toStop?: Line['quays'][0];
  stop?: Line['quays'][0];
  date?: string;
  plannedDepartureTime?: string;
  feedback?: string;
  attachments?: File[];
  firstName?: string;
  lastName?: string;
  email?: string;
  isResponseWanted: boolean;
  errorMessages: InputErrorMessages;
};

const setInputToValidate = (context: ContextProps) => {
  const {
    formType,
    transportMode,
    line,
    fromStop,
    toStop,
    stop,
    date,
    plannedDepartureTime,
    feedback,
    email,
    isResponseWanted,
  } = context;

  switch (formType) {
    case FormType.Driver:
      return {
        transportMode,
        line,
        fromStop,
        toStop,
        stop,
        date,
        plannedDepartureTime,
        feedback,
      };

    case FormType.Transportation:
      return {
        transportMode,
        line,
        fromStop,
        toStop,
        date,
        plannedDepartureTime,
        feedback,
        ...(isResponseWanted && { email }), // Include email if response is wanted.
      };

    case FormType.Delay:
      return {
        transportMode,
        line,
        fromStop,
        toStop,
        date,
        plannedDepartureTime,
        feedback,
      };

    case FormType.Stop:
      return {
        transportMode,
        line,
        stop,
        date,
        feedback,
      };

    case FormType.ServiceOffering:
      return {
        transportMode,
        line,
        feedback,
      };

    case FormType.Injury:
      return {
        transportMode,
        line,
        fromStop,
        toStop,
        date,
        plannedDepartureTime,
        feedback,
      };
  }
};

export const meansOfTransportFormMachine = setup({
  types: {
    context: {} as ContextProps,
    events: meansOfTransportFormEvents,
  },
  guards: {
    validateInputs: ({ context }) => {
      const inputToValidate = setInputToValidate(context);
      context.errorMessages = commonInputValidator(inputToValidate);
      return Object.keys(context.errorMessages).length > 0 ? false : true;
    },
  },
  actions: {
    onInputChange: assign(({ context, event }) => {
      if (event.type === 'ON_INPUT_CHANGE') {
        const { inputName, value } = event;

        if (inputName === 'formType') {
          context.errorMessages = {};
        } else {
          context.errorMessages[inputName] = [];
        }

        return {
          ...context,
          [inputName]: value,
        };
      }
      return context;
    }),

    onTransportModeChange: assign(({ context, event }) => {
      if (event.type === 'ON_TRANSPORTMODE_CHANGE')
        return setTransportModeAndResetLineAndStops(context, event.value);
      return context;
    }),

    onLineChange: assign(({ context, event }) => {
      if (event.type === 'ON_LINE_CHANGE')
        return setLineAndResetStops(context, event.value);
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
          transportMode,
          lineName,
          fromStopName,
          toStopName,
          stopName,
          date,
          plannedDepartureTime,
          feedback,
          attachments,
          firstName,
          lastName,
          email,
          isResponseWanted,
        },
      }: {
        input: submitInput;
      }) => {
        const base64EncodedAttachments = await convertFilesToBase64(
          attachments || [],
        );

        return await fetch('/api/contact/means-of-transport', {
          method: 'POST',
          body: JSON.stringify({
            formType: formType,
            transportMode: transportMode,
            line: lineName,
            fromStop: fromStopName,
            toStop: toStopName,
            stop: stopName,
            date: date,
            departureTime: plannedDepartureTime,
            feedback: feedback,
            attachments: base64EncodedAttachments,
            firstName: firstName,
            lastName: lastName,
            email: email,
            isResponseWanted: isResponseWanted,
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
    isResponseWanted: false,
    errorMessages: {},
  },
  states: {
    editing: {
      initial: 'idle',
      on: {
        ON_INPUT_CHANGE: {
          actions: 'onInputChange',
        },
        ON_TRANSPORTMODE_CHANGE: {
          actions: 'onTransportModeChange',
        },
        ON_LINE_CHANGE: {
          actions: 'onLineChange',
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
        input: ({ context }: { context: ContextProps }) => {
          return {
            formType: context.formType,
            transportMode: context.transportMode,
            lineName: context.line?.name,
            fromStopName: context.fromStop?.name,
            toStopName: context.toStop?.name,
            stopName: context.stop?.name,
            date: context.date,
            plannedDepartureTime: context.plannedDepartureTime,
            feedback: context.feedback,
            firstName: context.firstName,
            lastName: context.lastName,
            email: context.email,
            isResponseWanted: context.isResponseWanted,
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
