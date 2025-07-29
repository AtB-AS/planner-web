import { TransportModeType } from '../types';
import { assign, fromPromise, setup } from 'xstate';
import { Line } from '../server/journey-planner/validators';
import { commonInputValidator, InputErrorMessages } from '../validation';
import {
  convertFilesToBase64,
  findFirstErrorMessage,
  scrollToFirstErrorMessage,
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

type SubmitInput = {
  formType?: string;
  transportMode?: string;
  line?: string;
  fromStop?: string;
  toStop?: string;
  stop?: string;
  date?: string;
  departureTime?: string;
  feedback?: string;
  attachments?: File[];
  firstName?: string;
  lastName?: string;
  isResponseWanted?: boolean;
  email?: string;
};

export type MeansOfTransportContextProps = {
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
  isResponseWanted?: boolean;
  errorMessages: InputErrorMessages;
  firstErrorMessage?: string;
};

const setInputsToValidate = (context: MeansOfTransportContextProps) => {
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
    firstName,
    lastName,
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
        isResponseWanted,
        ...(isResponseWanted && { firstName, lastName, email }),
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
        isResponseWanted,
        ...(isResponseWanted && { firstName, lastName, email }),
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
        isResponseWanted,
        ...(isResponseWanted && { firstName, lastName, email }),
      };

    case FormType.Stop:
      return {
        transportMode,
        line,
        stop,
        date,
        feedback,
        isResponseWanted,
        ...(isResponseWanted && { firstName, lastName, email }),
      };

    case FormType.ServiceOffering:
      return {
        transportMode,
        line,
        feedback,
        isResponseWanted,
        ...(isResponseWanted && { firstName, lastName, email }),
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
        isResponseWanted,
        ...(isResponseWanted && { firstName, lastName, email }),
      };
  }
};

export const meansOfTransportFormMachine = setup({
  types: {
    context: {} as MeansOfTransportContextProps,
    events: meansOfTransportFormEvents,
  },
  guards: {
    isFormValid: ({ context }) => {
      const inputsToValidate = setInputsToValidate(context);
      const errors = commonInputValidator(inputsToValidate);
      return Object.keys(errors).length === 0;
    },
    isDriverForm: ({ event }) =>
      event.type === 'SELECT_FORM_TYPE' && event.formType === FormType.Driver,
    isTransportationForm: ({ event }) =>
      event.type === 'SELECT_FORM_TYPE' &&
      event.formType === FormType.Transportation,
    isDelayForm: ({ event }) =>
      event.type === 'SELECT_FORM_TYPE' && event.formType === FormType.Delay,
    isStopForm: ({ event }) =>
      event.type === 'SELECT_FORM_TYPE' && event.formType === FormType.Stop,
    isServiceOfferingForm: ({ event }) =>
      event.type === 'SELECT_FORM_TYPE' &&
      event.formType === FormType.ServiceOffering,
    isInjuryForm: ({ event }) =>
      event.type === 'SELECT_FORM_TYPE' && event.formType === FormType.Injury,
  },
  actions: {
    clearValidationErrors: assign({ errorMessages: {} }),

    setValidationErrors: assign(({ context, event }) => {
      if (event.type === 'SUBMIT') {
        const inputsToValidate = setInputsToValidate(context);
        const errors = commonInputValidator(inputsToValidate);
        return {
          firstErrorMessage: findFirstErrorMessage(
            event.orderedFormFieldNames,
            errors,
          ),
          errorMessages: { ...errors },
        };
      }
      return context;
    }),

    scrollToFirstErrorMessage: assign(({ context }) => {
      scrollToFirstErrorMessage(context.firstErrorMessage);
      return context;
    }),

    onInputChange: assign(({ context, event }) => {
      if (event.type === 'ON_INPUT_CHANGE') {
        const { inputName, value } = event;

        context.errorMessages[inputName] = [];

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
    submit: fromPromise(async ({ input }: { input: SubmitInput }) => {
      const base64EncodedAttachments = await convertFilesToBase64(
        input.attachments || [],
      );

      return await fetch('/api/contact/means-of-transport', {
        method: 'POST',
        body: JSON.stringify({
          ...input,
          attachments: base64EncodedAttachments,
        }),
      }).then((response) => {
        // throw an error to force onError
        if (!response.ok) throw new Error('Failed to call API');
        return response.ok;
      });
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiAZQFUAhAWQEkAVAbQAYBdRUAAcA9rFwAXXMPwCQAD0QBGAGzcSAZgCsATnXLlAJi2rN6gDQgAnkoDsmktxsAObstN7FN5eoC+Pi2hYeISk5FTU7ADyAOLRADIAojz8SCAiYpLSsgoIACyKJNpFxSUlFtYIRvZO6rUqBg3c3Fp+ARg4BMRklDTsAIIAGqzJsukSUjKpOSpqWrr6VSbmVojqueoaBk6K3AbOqjYGyq0ggR0hJJDj+FB0TGxcfKOi41lTiJqaBdyKmoaKTmcTkB2nKtnsjhcblqyk83hOZ2CXSukhudAS7AA+uwAEp9ABytAACpEcVjmJEACJJJ6pMaZSagHJ2NSKXKudnqGw7TSAsGVdTaEhOYpOTQ2ZqmZS5BHtJGkCjCdAQAi3CDSMBkfAAN2EAGtNYjOgqlSqbggCLrMOgGckRnSXgzsh8vg5fv9AcCQfztiRcsVnHpuO4bLKgsaSIrlarqGAAE5x4RxkiCCg2gBmSdQJCNFyjZqgFp1wmttr49qEjomzoQn2+7oMAKB3pWlQM9nF20cn20nj8-hA+GEEDgslzxGeGWr7wQAFplA4mkvl8ubPz52Hzl0wmBJ69GfIPkLcgZtMpudovmze6DW7UbH7FGzT9wnA12TKB+PSCjVXunTO2wPq47anmK3DaGKuT8msBS5M4EFit4Ng2OoBifm04Z5qaf4OlObxMqsmi5H6TjrGRhwoV4wb8r8BgOAh5FNCo56bvKJCwAArpgmBwPAeH7jWQEOIYmhgZoiHEbRzQkKY2jBl83C5GKnihv2QA */
  initial: 'editing',
  context: {
    isResponseWanted: undefined,
    errorMessages: {},
  },
  on: {
    ON_INPUT_CHANGE: {
      actions: 'onInputChange',
    },

    SELECT_FORM_TYPE: {
      target: '#formTypeHandler',
    },

    ON_TRANSPORTMODE_CHANGE: {
      actions: 'onTransportModeChange',
    },

    ON_LINE_CHANGE: {
      actions: 'onLineChange',
    },

    SUBMIT: { target: '#validating' },
  },
  states: {
    formTypeHandler: {
      id: 'formTypeHandler',
      always: [
        {
          guard: 'isDriverForm',
          target: `#${FormType.Driver}`,
        },
        {
          guard: 'isTransportationForm',
          target: `#${FormType.Transportation}`,
        },
        {
          guard: 'isDelayForm',
          target: `#${FormType.Delay}`,
        },
        {
          guard: 'isStopForm',
          target: `#${FormType.Stop}`,
        },
        {
          guard: 'isServiceOfferingForm',
          target: `#${FormType.ServiceOffering}`,
        },
        {
          guard: 'isInjuryForm',
          target: `#${FormType.Injury}`,
        },
      ],
    },
    editing: {
      initial: 'selectFormType',
      states: {
        selectFormType: {},
        driver: {
          id: 'driver',
          entry: assign({
            formType: () => FormType.Driver,
          }),
          exit: 'clearValidationErrors',
        },
        transportation: {
          id: 'transportation',
          entry: assign({
            formType: () => FormType.Transportation,
          }),
          exit: 'clearValidationErrors',
        },
        delay: {
          id: 'delay',
          entry: assign({
            formType: () => FormType.Delay,
          }),
          exit: 'clearValidationErrors',
        },
        stop: {
          id: 'stop',
          entry: assign({
            formType: () => FormType.Stop,
          }),
          exit: 'clearValidationErrors',
        },
        serviceOffering: {
          id: 'serviceOffering',
          entry: assign({
            formType: () => FormType.ServiceOffering,
          }),
          exit: 'clearValidationErrors',
        },
        injury: {
          id: 'injury',
          entry: assign({
            formType: () => FormType.Injury,
          }),
          exit: 'clearValidationErrors',
        },
        history: {
          type: 'history',
          history: 'deep',
        },
      },
    },

    validating: {
      id: 'validating',
      always: [
        {
          guard: 'isFormValid',
          target: '#submitting',
        },
        {
          actions: ['setValidationErrors', 'scrollToFirstErrorMessage'],
          target: 'editing.history',
        },
      ],
    },

    submitting: {
      id: 'submitting',
      invoke: {
        src: 'submit',
        input: ({ context }: { context: MeansOfTransportContextProps }) => {
          return {
            formType: context.formType,
            transportMode: context.transportMode,
            line: context.line?.name,
            fromStop: context.fromStop?.name,
            toStop: context.toStop?.name,
            stop: context.stop?.name,
            date: context.date,
            departureTime: context.plannedDepartureTime,
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
