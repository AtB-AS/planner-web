import { PageText, TranslatedString } from '@atb/translations';
import { string } from 'zod';

export type InputErrorMessages = {
  [key: string]: TranslatedString[];
};

// Utility function to add error messages
const addErrorMessage = (
  context: any,
  field: string,
  errorMessages: InputErrorMessages,
  errorMessage: TranslatedString,
) => {
  if (!context[field]) {
    if (!errorMessages[field]) {
      errorMessages[field] = [];
    }
    errorMessages[field].push(errorMessage);
  }
};

// Helper function to set fields in travel guarantee machine, which only uses on statemachine for all three formes.
const setFieldsToValidateSpecialCase = (
  travelGuaranteeStateWhenSubmitted: string,
) => {
  const commonFields = [
    {
      field: 'firstName',
      errorMessage: PageText.Contact.inputFields.firstName.errorMessages.empty,
    },
    {
      field: 'lastName',
      errorMessage: PageText.Contact.inputFields.lastName.errorMessages.empty,
    },
    {
      field: 'email',
      errorMessage: PageText.Contact.inputFields.email.errorMessages.empty,
    },
    {
      field: 'address',
      errorMessage: PageText.Contact.inputFields.address.errorMessages.empty,
    },
    {
      field: 'postalCode',
      errorMessage: PageText.Contact.inputFields.postalCode.errorMessages.empty,
    },
    {
      field: 'city',
      errorMessage: PageText.Contact.inputFields.city.errorMessages.empty,
    },
    {
      field: 'phoneNumber',
      errorMessage:
        PageText.Contact.inputFields.phoneNumber.errorMessages.empty,
    },
  ];

  switch (travelGuaranteeStateWhenSubmitted) {
    case 'car':
      commonFields.push(
        {
          field: 'transportMode',
          errorMessage:
            PageText.Contact.inputFields.transportMode.errorMessages.empty,
        },
        {
          field: 'line',
          errorMessage: PageText.Contact.inputFields.line.errorMessages.empty,
        },
        {
          field: 'fromStop',
          errorMessage:
            PageText.Contact.inputFields.fromStop.errorMessages.empty,
        },
        {
          field: 'toStop',
          errorMessage: PageText.Contact.inputFields.toStop.errorMessages.empty,
        },
        {
          field: 'reasonForTransportFailure',
          errorMessage:
            PageText.Contact.inputFields.reasonForTransportFailure.errorMessages
              .empty,
        },
        {
          field: 'kilometersDriven',
          errorMessage:
            PageText.Contact.inputFields.kilometersDriven.errorMessages.empty,
        },
      );

    case 'taxi':
      commonFields.push(
        {
          field: 'transportMode',
          errorMessage:
            PageText.Contact.inputFields.transportMode.errorMessages.empty,
        },
        {
          field: 'line',
          errorMessage: PageText.Contact.inputFields.line.errorMessages.empty,
        },
        {
          field: 'fromStop',
          errorMessage:
            PageText.Contact.inputFields.fromStop.errorMessages.empty,
        },
        {
          field: 'toStop',
          errorMessage: PageText.Contact.inputFields.toStop.errorMessages.empty,
        },
        {
          field: 'reasonForTransportFailure',
          errorMessage:
            PageText.Contact.inputFields.reasonForTransportFailure.errorMessages
              .empty,
        },
      );
  }
  return commonFields;
};

export const formInputValidator = (context: any) => {
  const inputErrorMessages: InputErrorMessages = {};

  let fieldsToValidate;

  if (context.travelGuaranteeStateWhenSubmitted) {
    fieldsToValidate = setFieldsToValidateSpecialCase(
      String(context.travelGuaranteeStateWhenSubmitted),
    );

    // Iterate over each field and apply validation
    if (fieldsToValidate !== undefined) {
      fieldsToValidate.forEach(({ field, errorMessage }) =>
        addErrorMessage(context, field, inputErrorMessages, errorMessage),
      );

      // Special case for bank details
      if (!context.bankAccountNumber && !context.IBAN && !context.SWIFT) {
        addErrorMessage(
          context,
          'bankAccountNumber',
          inputErrorMessages,
          PageText.Contact.inputFields.bankAccountNumber.errorMessages.empty,
        );
      }
    }
  } else {
    fieldsToValidate = [
      {
        field: 'firstName',
        errorMessage:
          PageText.Contact.inputFields.firstName.errorMessages.empty,
      },
      {
        field: 'lastName',
        errorMessage: PageText.Contact.inputFields.lastName.errorMessages.empty,
      },
      {
        field: 'email',
        errorMessage: PageText.Contact.inputFields.email.errorMessages.empty,
      },
      {
        field: 'address',
        errorMessage: PageText.Contact.inputFields.address.errorMessages.empty,
      },
      {
        field: 'postalCode',
        errorMessage:
          PageText.Contact.inputFields.postalCode.errorMessages.empty,
      },
      {
        field: 'city',
        errorMessage: PageText.Contact.inputFields.city.errorMessages.empty,
      },
      {
        field: 'phoneNumber',
        errorMessage:
          PageText.Contact.inputFields.phoneNumber.errorMessages.empty,
      },
      {
        field: 'transportMode',
        errorMessage:
          PageText.Contact.inputFields.transportMode.errorMessages.empty,
      },
      {
        field: 'line',
        errorMessage: PageText.Contact.inputFields.line.errorMessages.empty,
      },
      {
        field: 'fromStop',
        errorMessage: PageText.Contact.inputFields.fromStop.errorMessages.empty,
      },
      {
        field: 'toStop',
        errorMessage: PageText.Contact.inputFields.toStop.errorMessages.empty,
      },
      {
        field: 'reasonForTransportFailure',
        errorMessage:
          PageText.Contact.inputFields.reasonForTransportFailure.errorMessages
            .empty,
      },
    ];

    // Iterate over each field and apply validation
    fieldsToValidate.forEach(({ field, errorMessage }) =>
      addErrorMessage(context, field, inputErrorMessages, errorMessage),
    );

    // Special case for bank details
    if (!context.bankAccountNumber && !context.IBAN && !context.SWIFT) {
      addErrorMessage(
        context,
        'bankAccountNumber',
        inputErrorMessages,
        PageText.Contact.inputFields.bankAccountNumber.errorMessages.empty,
      );
    }
  }

  // Populate context.errorMessages
  context.errorMessages = inputErrorMessages;


  // Return false if any error
  return Object.keys(context.errorMessages).length > 0 ? false : true;
};
