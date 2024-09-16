import { PageText, TranslatedString } from '@atb/translations';

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

export const formInputValidator = (context: any) => {
  const inputErrorMessages: InputErrorMessages = {};

  // List of fields and their corresponding error messages
  const fieldsToValidate = [
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
    {
      field: 'kilometersDriven',
      errorMessage:
        PageText.Contact.inputFields.kilometersDriven.errorMessages.empty,
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

  // Populate context.errorMessages
  context.errorMessages = inputErrorMessages;

  // Return false if any error
  return Object.keys(inputErrorMessages).length > 0 ? false : true;
};
