import { PurchasePlatformType, TransportModeType } from '../types';
import { assign, fromPromise, setup } from 'xstate';
import { Line } from '../server/journey-planner/validators';
import { ReasonForTransportFailure, TicketType } from './events';
import { commonInputValidator, InputErrorMessages } from '../validation';
import {
  convertFilesToBase64,
  findFirstErrorMessage,
  scrollToFirstErrorMessage,
  setBankAccountStatusAndResetBankInformation,
  setLineAndResetStops,
  setTransportModeAndResetLineAndStops,
} from '../utils';
import { RefundFormEvents } from './events';

export enum FormCategory {
  RefundOfTicket = 'refundOfTicket',
  RefundAndTravelGuarantee = 'refundAndTravelGuarantee',
  ResidualValueOnTravelCard = 'residualValueOnTravelCard',
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
  ResidualValueOnTravelCard = 'residualValueOnTravelCard',
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
  customerNumber?: string;
  orderId?: string;
  ticketType?: string;
  travelCardNumber?: string;
  refundReason?: string;
  purchasePlatform?: string;
};

export type RefundContextProps = {
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
  customerNumber?: string;
  orderId?: string;
  ticketType?: TicketType;
  travelCardNumber?: string;
  refundReason?: string;
  purchasePlatform?: PurchasePlatformType | undefined;

  isInitialAgreementChecked: boolean;
  hasInternationalBankAccount: boolean;
  showInputTravelCardNumber: boolean;
  errorMessages: InputErrorMessages;
  firstIncorrectErrorMessage?: string;
};

const setFormTypeAndInitialContext = (
  context: RefundContextProps,
  formType: FormType,
) => {
  return {
    ...context,
    formType: formType,
    errorMessages: {},
  };
};
const setInitialAgreementAndFormType = (
  context: RefundContextProps,
  isChecked: boolean,
) => {
  return {
    ...context,
    isInitialAgreementChecked: isChecked,
    formType: undefined,
    errorMessages: {},
  };
};

const setInputToValidate = (context: RefundContextProps) => {
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
    customerNumber,
    orderId,
    ticketType,
    travelCardNumber,
    refundReason,
    purchasePlatform,
    showInputTravelCardNumber,
  } = context;

  const commonFields = {
    formType,
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

    case FormType.AppTicketRefund:
      return {
        formType,
        customerNumber,
        orderId,
        refundReason,
        purchasePlatform,
      };

    case FormType.OtherTicketRefund:
      return {
        formType,
        ticketType,
        refundReason,
        amount,
        firstName,
        lastName,
        address,
        postalCode,
        city,
        email,
        phoneNumber,
        orderId,
        ...(showInputTravelCardNumber
          ? { travelCardNumber }
          : { customerNumber }),
        ...(hasInternationalBankAccount
          ? { IBAN, SWIFT }
          : { bankAccountNumber }),
      };
  }
};

export const refundStateMachine = setup({
  types: {
    context: {} as RefundContextProps,
    events: RefundFormEvents,
  },
  guards: {
    isFormValid: ({ context }) => {
      const inputsToValidate = setInputToValidate(context);
      const errors = commonInputValidator(inputsToValidate);
      return Object.keys(errors).length === 0;
    },
    isRefundOfTicket: ({ event }) =>
      event.type === 'SELECT_FORM_CATEGORY' &&
      event.formCategory === FormCategory.RefundOfTicket,
    isRefundAndTravelGuarantee: ({ event }) =>
      event.type === 'SELECT_FORM_CATEGORY' &&
      event.formCategory === FormCategory.RefundAndTravelGuarantee,
    isResidualValueOnTravelCard: ({ event }) =>
      event.type === 'SELECT_FORM_CATEGORY' &&
      event.formCategory === FormCategory.ResidualValueOnTravelCard,
    isAppTicketRefund: ({ event }) =>
      event.type === 'SELECT_REFUND_TICKET_FORM' &&
      event.refundTicketForm === RefundTicketForm.AppTicketRefund,
    isOtherTicketRefund: ({ event }) =>
      event.type === 'SELECT_REFUND_TICKET_FORM' &&
      event.refundTicketForm === RefundTicketForm.OtherTicketRefund,
    isRefundCar: ({ event }) =>
      event.type === 'SELECT_REFUND_AND_TRAVEL_GUARANTEE_FORM' &&
      event.refundAndTravelGuarantee === RefundAndTravelGuarantee.RefundCar,
    isRefundTaxi: ({ event }) =>
      event.type === 'SELECT_REFUND_AND_TRAVEL_GUARANTEE_FORM' &&
      event.refundAndTravelGuarantee === RefundAndTravelGuarantee.RefundTaxi,
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

    setInitialAgreementAndFormType: assign(({ context }) => {
      return setInitialAgreementAndFormType(context, false);
    }),

    clearValidationErrors: assign({ errorMessages: {} }),

    setValidationErrors: assign(({ context, event }) => {
      if (event.type === 'SUBMIT') {
        const inputsToValidate = setInputToValidate(context);
        const errors = commonInputValidator(inputsToValidate);
        return {
          firstIncorrectErrorMessage: findFirstErrorMessage(
            event.orderedFormFieldNames,
            errors,
          ),
          errorMessages: { ...errors },
        };
      }
      return context;
    }),

    scrollToFirstErrorMessage: assign(({ context }) => {
      scrollToFirstErrorMessage(context.firstIncorrectErrorMessage);
      return context;
    }),

    onInputChange: assign(({ context, event }) => {
      if (event.type === 'ON_INPUT_CHANGE') {
        let { inputName, value } = event;

        if (inputName === 'formType')
          return setFormTypeAndInitialContext(context, value as FormType);

        if (inputName === 'isInitialAgreementChecked')
          return setInitialAgreementAndFormType(context, value as boolean);

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

    onPurchasePlatformChange: assign(({ context, event }) => {
      if (event.type === 'ON_PURCHASE_PLATFORM_CHANGE')
        return {
          ...context,
          purchasePlatform: event.value,
          errorMessages: {
            ...context.errorMessages,
          },
        };
      return context;
    }),
  },

  actors: {
    submit: fromPromise(async ({ input }: { input: SubmitInput }) => {
      const base64EncodedAttachments = await convertFilesToBase64(
        input.attachments || [],
      );
      return await fetch('/api/contact/refund', {
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
  id: 'refundStateMachine',
  initial: 'editing',
  context: {
    isInitialAgreementChecked: false,
    hasInternationalBankAccount: false,
    showInputTravelCardNumber: true,
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

    ON_PURCHASE_PLATFORM_CHANGE: {
      actions: 'onPurchasePlatformChange',
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
      entry: 'setInitialAgreementAndFormType',
      always: [
        {
          guard: 'isRefundOfTicket',
          target: `#${FormCategory.RefundOfTicket}`,
        },
        {
          guard: 'isRefundAndTravelGuarantee',
          target: `#${FormCategory.RefundAndTravelGuarantee}`,
        },
        {
          guard: 'isResidualValueOnTravelCard',
          target: `#${FormCategory.ResidualValueOnTravelCard}`,
        },
      ],
    },

    refundTicketFormHandler: {
      id: 'refundTicketFormHandler',
      always: [
        {
          guard: 'isAppTicketRefund',
          target: `#${RefundTicketForm.AppTicketRefund}`,
        },
        {
          guard: 'isOtherTicketRefund',
          target: `#${RefundTicketForm.OtherTicketRefund}`,
        },
      ],
    },

    refundAndTravelGuaranteeFormHandler: {
      id: 'refundAndTravelGuaranteeFormHandler',
      always: [
        {
          guard: 'isRefundCar',
          target: `#${RefundAndTravelGuarantee.RefundCar}`,
        },
        {
          guard: 'isRefundTaxi',
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
        residualValueOnTravelCard: {
          id: 'residualValueOnTravelCard',
          entry: assign({
            formType: () => FormType.ResidualValueOnTravelCard,
          }),
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
        input: ({ context }: { context: RefundContextProps }) => ({
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
          customerNumber: context?.customerNumber,
          orderId: context?.orderId,
          ticketType: context?.ticketType?.name.no,
          travelCardNumber: context?.travelCardNumber,
          refundReason: context?.refundReason,
          purchasePlatform: context?.purchasePlatform,
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
