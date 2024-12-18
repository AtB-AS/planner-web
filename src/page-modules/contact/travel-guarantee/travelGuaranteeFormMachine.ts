import { TransportModeType } from '../types';
import { assign, fromPromise, setup } from 'xstate';
import { Line } from '../server/journey-planner/validators';
import { ReasonForTransportFailure } from './events';
import { commonInputValidator, InputErrorMessages } from '../validation';
import {
  convertFilesToBase64,
  setBankAccountStatusAndResetBankInformation,
  setLineAndResetStops,
  setTransportModeAndResetLineAndStops,
} from '../utils';
import { TravelGuaranteeFormEvents } from './events';

export enum FormCategory {
  RefundOfTicket = 'refundOfTicket',
  RefundAndTravelGuarantee = 'refundAndTravelGuarantee',
}

export enum RefundTicketForm {
  AppTicketRefund = 'appTicketRefund',
  OtherTicketRefund = 'otherTicketRefund',
}

export enum RefundAndTravelGuarantee {
  RefundTaxi = 'refundTaxi',
  RefundCar = 'refundCar',
}
export enum FormType {
  RefundTaxi = 'refundTaxi',
  RefundCar = 'refundCar',
  AppTicketRefund = 'appTicketRefund',
  OtherTicketRefund = 'otherTicketRefund',
}

type SubmitInput = {
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
  line?: string;
  fromStop?: string;
  toStop?: string;
  date?: string;
  plannedDepartureTime?: string;
  kilometersDriven?: string;
  fromAddress?: string;
  toAddress?: string;
  reasonForTransportFailure?: string;
  amount?: string;
};

export type TravelGuaranteeContextProps = {
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
  date?: string;
  plannedDepartureTime?: string;
  kilometersDriven?: string;
  fromAddress?: string;
  toAddress?: string;
  reasonForTransportFailure?: ReasonForTransportFailure;
  amount?: string;

  isInitialAgreementChecked: boolean;
  hasInternationalBankAccount: boolean;
  errorMessages: InputErrorMessages;
};

const setFormTypeAndInitialContext = (
  context: TravelGuaranteeContextProps,
  formType: FormType,
) => {
  return {
    ...context,
    formType: formType,
    errorMessages: {},
  };
};
const setInitialAgreementAndFormType = (
  context: TravelGuaranteeContextProps,
  isChecked: boolean,
) => {
  return {
    ...context,
    isInitialAgreementChecked: isChecked,
    formType: undefined,
    errorMessages: {},
  };
};

const setInputToValidate = (context: TravelGuaranteeContextProps) => {
  const {
    formType,
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    postalCode,
    city,
    hasInternationalBankAccount,
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
    amount,
    attachments,
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
    ...(hasInternationalBankAccount ? { IBAN, SWIFT } : { bankAccountNumber }),
  };

  switch (formType) {
    case FormType.RefundTaxi:
      return {
        ...commonFields,
        attachments,
        amount,
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

export const travelGuaranteeStateMachine = setup({
  types: {
    context: {} as TravelGuaranteeContextProps,
    events: TravelGuaranteeFormEvents,
  },
  guards: {
    isFormValid: ({ context }) => {
      const inputsToValidate = setInputToValidate(context);
      const errors = commonInputValidator(inputsToValidate);
      return Object.keys(errors).length === 0;
    },
  },
  actions: {
    navigateToErrorPage: () => {
      window.location.href = '/contact/error';
    },
    navigateToSuccessPage: () => {
      window.location.href = '/contact/success';
    },

    setFormTypeToUndefined: assign({
      formType: () => undefined,
    }),

    clearValidationErrors: assign({ errorMessages: {} }),

    setValidationErrors: assign(({ context }) => {
      const inputsToValidate = setInputToValidate(context);
      const errors = commonInputValidator(inputsToValidate);
      return { errorMessages: { ...errors } };
    }),

    onInputChange: assign(({ context, event }) => {
      if (event.type === 'ON_INPUT_CHANGE') {
        let { inputName, value } = event;

        if (inputName === 'formType')
          return setFormTypeAndInitialContext(context, value as FormType);

        console.log('inputName: ', inputName);

        if (inputName === 'isInitialAgreementChecked')
          return setInitialAgreementAndFormType(context, value);

        if (inputName === 'hasInternationalBankAccount') {
          return setBankAccountStatusAndResetBankInformation(
            context,
            value as boolean,
          );
        }

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
    submit: fromPromise(async ({ input }: { input: SubmitInput }) => {
      const base64EncodedAttachments = await convertFilesToBase64(
        input.attachments || [],
      );
      return await fetch('/api/contact/travel-guarantee', {
        method: 'POST',
        body: JSON.stringify({
          ...input,
          attachments: base64EncodedAttachments,
        }),
      })
        .then((response) => {
          if (!response.ok) throw new Error('Failed to call API');
          return response.ok;
        })
        .catch((error) => {
          throw error;
        });
    }),
  },
}).createMachine({
  id: 'travelGuaranteeStateMachine',
  initial: 'editing',
  context: {
    isInitialAgreementChecked: false,
    hasInternationalBankAccount: false,
    errorMessages: {},
  },
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

    SELECT_FORM_CATEGORY: {
      target: '#formCategoryHandler',
    },

    SELECT_REFUND_TICKET_FORM: {
      target: '#refundTicketFormHandler',
    },

    SELECT_REFUND_AND_TRAVEL_GUARANTEE_FORM: {
      target: '#refundAndTravelGuaranteeFormHandler',
    },

    SUBMIT: { target: '#validating' },
  },
  states: {
    formCategoryHandler: {
      id: 'formCategoryHandler',
      always: [
        {
          guard: ({ event }) =>
            event.type === 'SELECT_FORM_CATEGORY' &&
            event.formCategory === FormCategory.RefundOfTicket,
          target: `#${FormCategory.RefundOfTicket}`,
        },
        {
          guard: ({ event }) =>
            event.type === 'SELECT_FORM_CATEGORY' &&
            event.formCategory === FormCategory.RefundAndTravelGuarantee,
          target: `#${FormCategory.RefundAndTravelGuarantee}`,
        },
      ],
    },
    refundTicketFormHandler: {
      id: 'refundTicketFormHandler',
      always: [
        {
          guard: ({ event }) =>
            event.type === 'SELECT_REFUND_TICKET_FORM' &&
            event.refundTicketForm === RefundTicketForm.AppTicketRefund,
          target: `#${RefundTicketForm.AppTicketRefund}`,
        },
        {
          guard: ({ event }) =>
            event.type === 'SELECT_REFUND_TICKET_FORM' &&
            event.refundTicketForm === RefundTicketForm.OtherTicketRefund,
          target: `#${RefundTicketForm.OtherTicketRefund}`,
        },
      ],
    },

    refundAndTravelGuaranteeFormHandler: {
      id: 'refundAndTravelGuaranteeFormHandler',
      always: [
        {
          guard: ({ event }) =>
            event.type === 'SELECT_REFUND_AND_TRAVEL_GUARANTEE_FORM' &&
            event.refundAndTravelGuarantee ===
              RefundAndTravelGuarantee.RefundCar,
          target: `#${RefundAndTravelGuarantee.RefundCar}`,
        },
        {
          guard: ({ event }) =>
            event.type === 'SELECT_REFUND_AND_TRAVEL_GUARANTEE_FORM' &&
            event.refundAndTravelGuarantee ===
              RefundAndTravelGuarantee.RefundTaxi,
          target: `#${RefundAndTravelGuarantee.RefundTaxi}`,
        },
      ],
    },

    editing: {
      initial: 'selectFormCategory',
      states: {
        selectFormCategory: {},
        refundOfTicket: {
          id: 'refundOfTicket',
          initial: 'selectRefundOfTicketForm',
          entry: 'setFormTypeToUndefined',
          exit: 'clearValidationErrors',
          states: {
            selectRefundOfTicketForm: {},
            appTicketRefund: {
              id: 'appTicketRefund',
              entry: assign({
                formType: () => FormType.AppTicketRefund,
              }),
              exit: 'clearValidationErrors',
            },
            otherTicketRefund: {
              id: 'otherTicketRefund',
              entry: assign({
                formType: () => FormType.OtherTicketRefund,
              }),
              exit: 'clearValidationErrors',
            },
          },
        },
        refundAndTravelGuarantee: {
          id: 'refundAndTravelGuarantee',
          initial: 'selectRefundAndTravelGuaranteeForm',
          entry: 'setFormTypeToUndefined',
          exit: 'clearValidationErrors',
          states: {
            selectRefundAndTravelGuaranteeForm: {},
            refundCar: {
              id: 'refundCar',
              entry: assign({
                formType: () => FormType.RefundCar,
              }),
              exit: 'clearValidationErrors',
            },
            refundTaxi: {
              id: 'refundTaxi',
              entry: assign({
                formType: () => FormType.RefundTaxi,
              }),
              exit: 'clearValidationErrors',
            },
          },
        },

        //readyForSubmit: {
        //  type: 'final',
        //},
        history: {
          type: 'history',
          history: 'deep',
        },
      },

      //onDone: {
      //  target: 'submitting',
      //},
    },

    validating: {
      id: 'validating',
      always: [
        {
          guard: 'isFormValid',
          target: '#submitting',
        },
        {
          actions: 'setValidationErrors',
          target: 'editing.history',
        },
      ],
    },

    submitting: {
      id: 'submitting',
      invoke: {
        src: 'submit',
        input: ({ context }: { context: TravelGuaranteeContextProps }) => ({
          transportMode: context?.transportMode,
          line: context.line?.name,
          fromStop: context.fromStop?.name,
          toStop: context.toStop?.name,
          date: context?.date,
          plannedDepartureTime: context?.plannedDepartureTime,
          kilometersDriven: context?.kilometersDriven,
          fromAddress: context?.fromAddress,
          toAddress: context?.toAddress,
          reasonForTransportFailure:
            context?.reasonForTransportFailure?.name.no,
          additionalInfo: context?.feedback,
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
          amount: context?.amount,
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
