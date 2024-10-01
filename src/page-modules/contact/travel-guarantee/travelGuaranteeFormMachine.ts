import { TransportModeType } from '@atb-as/config-specs';
import { assign, fromPromise, setup } from 'xstate';
import { Line } from '../server/journey-planner/validators';
import { ReasonForTransportFailure } from './events';
import { commonInputValidator, InputErrorMessages } from '../validation';
import {
  convertFilesToBase64,
  getCurrentDateString,
  getCurrentTimeString,
  setLineAndResetStops,
  setTransportModeAndResetLineAndStops,
} from '../utils';
import { TravelGuaranteeFormEvents } from './events';

export enum FormType {
  RefundTaxi = 'refundTaxi',
  RefundCar = 'refundCar',
}

type submitInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  phoneNumber?: string;
  bankAccountNumber?: string;
  IBAN?: string;
  SWIFT?: string;
  feedback?: string;
  attachments?: File[];
  transportMode?: string;
  lineName?: string;
  fromStopName?: string;
  toStopName?: string;
  date?: string;
  plannedDepartureTime?: string;
  kilometersDriven?: string;
  fromAddress?: string;
  toAddress?: string;
  reasonForTransportFailureName?: string;
};

export type ContextProps = {
  formType?: FormType;
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  phoneNumber?: string;
  bankAccountNumber?: string;
  IBAN?: string;
  SWIFT?: string;
  feedback?: string;
  attachments?: File[];
  transportMode?: TransportModeType | undefined;
  line?: Line | undefined;
  fromStop?: Line['quays'][0] | undefined;
  toStop?: Line['quays'][0] | undefined;
  date: string;
  plannedDepartureTime: string;
  kilometersDriven?: string;
  fromAddress?: string;
  toAddress?: string;
  reasonForTransportFailure?: ReasonForTransportFailure;

  isIntialAgreementChecked: boolean;
  hasInternationalBankAccount: boolean;
  errorMessages: InputErrorMessages;
};

const setFormTypeAndInitialContext = (
  context: ContextProps,
  formType: FormType,
) => {
  return {
    ...context,
    formType: formType,
    errorMessages: {},
  };
};

const setInputToValidate = (context: ContextProps) => {
  const {
    formType,
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    postalCode,
    city,
    bankAccountNumber,
    IBAN,
    SWIFT,
    transportMode,
    line,
    fromStop,
    toStop,
    date,
    kilometersDriven,
    fromAddress,
    toAddress,
    plannedDepartureTime,
    reasonForTransportFailure,
  } = context;

  const commonFields = {
    transportMode,
    line,
    fromStop,
    toStop,
    date,
    plannedDepartureTime,
    reasonForTransportFailure,
    firstName,
    lastName,
    email,
    address,
    postalCode,
    city,
    phoneNumber,
    bankAccountNumber,
    IBAN,
    SWIFT,
  };

  switch (formType) {
    case FormType.RefundTaxi:
      return {
        ...commonFields,
      };

    case FormType.RefundCar:
      return {
        ...commonFields,
        kilometersDriven,
        fromAddress,
        toAddress,
      };
  }
};

export const fetchMachine = setup({
  types: {
    context: {} as ContextProps,
    events: TravelGuaranteeFormEvents,
  },
  guards: {
    validateInputs: ({ context }) => {
      const inputToValidate = setInputToValidate(context);
      context.errorMessages = commonInputValidator(inputToValidate);
      return Object.keys(context.errorMessages).length > 0 ? false : true;
    },
  },
  actions: {
    navigateToErrorPage: () => {
      window.location.href = '/contact/error';
    },
    navigateToSuccessPage: () => {
      window.location.href = '/contact/success';
    },

    onInputChange: assign(({ context, event }) => {
      if (event.type === 'ON_INPUT_CHANGE') {
        let { inputName, value } = event;

        if (inputName === 'formType')
          return setFormTypeAndInitialContext(context, value as FormType);

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
  },
  actors: {
    submit: fromPromise(
      async ({
        input: {
          transportMode,
          lineName,
          fromStopName,
          toStopName,
          date,
          plannedDepartureTime,
          kilometersDriven,
          fromAddress,
          toAddress,
          reasonForTransportFailureName,
          feedback,
          attachments,
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
        input: submitInput;
      }) => {
        const base64EncodedAttachments = await convertFilesToBase64(
          attachments || [],
        );
        return await fetch('/api/contact/travel-guarantee', {
          method: 'POST',
          body: JSON.stringify({
            attachments: base64EncodedAttachments,
            transportMode: transportMode,
            line: lineName,
            fromStop: fromStopName,
            toStop: toStopName,
            date: date,
            plannedDepartureTime: plannedDepartureTime,
            reasonForTransportFailure: reasonForTransportFailureName,
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
            fromAddress: fromAddress,
            toAddress: toAddress,
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
    date: getCurrentDateString(),
    plannedDepartureTime: getCurrentTimeString(),
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
        input: ({ context }: { context: ContextProps }) => ({
          transportMode: context?.transportMode,
          lineName: context.line?.name,
          fromStopName: context.fromStop?.name,
          toStopName: context.toStop?.name,
          date: context?.date,
          plannedDepartureTime: context?.plannedDepartureTime,
          kilometersDriven: context?.kilometersDriven,
          fromAddress: context?.fromAddress,
          toAddress: context?.toAddress,
          reasonForTransportFailureName:
            context?.reasonForTransportFailure?.name.no,
          feedback: context?.feedback,
          attachments: context.attachments,
          firstName: context?.firstName,
          lastName: context?.lastName,
          address: context?.address,
          postalCode: context?.postalCode,
          city: context?.city,
          email: context?.email,
          phoneNumber: context?.phoneNumber,
          bankAccountNumber: context?.bankAccountNumber,
          IBAN: context?.IBAN,
          SWIFT: context?.SWIFT,
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
