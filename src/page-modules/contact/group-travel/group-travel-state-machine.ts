import { assign, fromPromise, setup } from 'xstate';
import { Line } from '../server/journey-planner/validators';

export type GroupTravelContextType = {
  travelType: 'bus' | 'boat' | null;
  formData: {
    dateOfTravel: string;
    line: Line;
    fromStop: Line['quays'][0];
    departureTime: string;
    toStop: Line['quays'][0];

    returnLine?: Line;
    returnFromStop?: Line['quays'][0];
    returnDepartureTime?: string;
    returnToStop?: Line['quays'][0];

    groupSize: string;
    groupInfo: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
  };
  errors: {
    dateOfTravel: boolean;
    line: boolean;
    fromStop: boolean;
    departureTime: boolean;
    toStop: boolean;
    groupSize: boolean;
    groupInfo: boolean;
    firstName: boolean;
    lastName: boolean;
    phoneNumber: boolean;
    email: boolean;
  };
};

const defaultErrors: GroupTravelContextType['errors'] = {
  dateOfTravel: false,
  line: false,
  fromStop: false,
  departureTime: false,
  toStop: false,
  groupSize: false,
  groupInfo: false,
  firstName: false,
  lastName: false,
  phoneNumber: false,
  email: false,
};

type GroupTravelEvents =
  | { type: 'SELECT_TRAVEL_TYPE'; travelType: 'bus' | 'boat' | null }
  | { type: 'UPDATE_FORM_DATA'; formData: GroupTravelContextType['formData'] }
  | { type: 'SUBMIT' };

const getFormDataErrors = (formData: GroupTravelContextType['formData']) => {
  const errors: GroupTravelContextType['errors'] = defaultErrors;

  Object.keys(errors).forEach((key) => {
    errors[key as keyof GroupTravelContextType['errors']] =
      !formData[key as keyof GroupTravelContextType['formData']];
  });

  return errors;
};

export const groupTravelStateMachine = setup({
  types: {
    context: {} as GroupTravelContextType,
    events: {} as GroupTravelEvents,
  },
  guards: {
    isFormValid: ({ context }) => {
      const errors = getFormDataErrors(context.formData);
      return !Object.values(errors).some((isError) => isError);
    },
  },
  actions: {
    navigateToErrorPage: () => {
      window.location.href = '/contact/error';
    },
    navigateToSuccessPage: () => {
      window.location.href = '/contact/success';
    },
    selectTravelType: assign(({ context, event }) => {
      if (event.type !== 'SELECT_TRAVEL_TYPE') return context;
      return {
        travelType: event.travelType,
      };
    }),
    updateFormData: assign(({ context, event }) => {
      if (event.type !== 'UPDATE_FORM_DATA') return context;
      return {
        formData: {
          ...context.formData,
          ...event.formData,
        },
      };
    }),
    setValidationErrors: assign(({ context }) => {
      const errors = getFormDataErrors(context.formData);
      return { errors: { ...errors } };
    }),
    clearValidationErrors: assign({ errors: defaultErrors }),
  },
  actors: {
    submitForm: fromPromise(
      async ({ input }: { input: GroupTravelContextType['formData'] }) => {
        await fetch('/api/contact/group-travel', {
          method: 'POST',
          body: JSON.stringify({
            ...input,
            line: input.line.name,
            fromStop: input.fromStop.name,
            toStop: input.toStop.name,
            returnLine: input.returnLine?.name,
            returnFromStop: input.returnFromStop?.name,
            returnToStop: input.returnToStop?.name,
          }),
        })
          .then((response) => {
            if (!response.ok) throw new Error('Failed to submit form');
            return response.ok;
          })
          .catch((error) => {
            throw new Error('Failed to submit form');
          });
      },
    ),
  },
}).createMachine({
  id: 'ticketControlForm',
  initial: 'selectTravelType',
  context: {
    travelType: null,
    errors: defaultErrors,
  } as GroupTravelContextType,
  on: {
    SELECT_TRAVEL_TYPE: {
      target: '#travelTypeHandler',
      actions: 'selectTravelType',
    },
  },
  states: {
    selectTravelType: {},
    travelTypeHandler: {
      id: 'travelTypeHandler',
      always: [
        {
          guard: ({ context }) => context.travelType === 'boat',
          target: 'boatInfo',
        },
        {
          guard: ({ context }) => context.travelType === 'bus',
          target: 'busForm',
        },
        {
          guard: ({ context }) => context.travelType === null,
          target: 'selectTravelType',
        },
      ],
    },
    boatInfo: {},
    busForm: {
      initial: 'editing',
      states: {
        editing: {
          on: {
            UPDATE_FORM_DATA: {
              actions: 'updateFormData',
            },
            SUBMIT: {
              target: 'validating',
            },
          },
        },
        validating: {
          always: [
            {
              guard: 'isFormValid',
              target: 'submitting',
            },
            {
              target: 'editing',
              actions: 'setValidationErrors',
            },
          ],
        },
        submitting: {
          invoke: {
            src: 'submitForm',
            input: ({ context }) => context.formData,
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
    },
  },
});
