import { PageText, TranslatedString } from '@atb/translations';

export type InputErrorMessages = {
  [key: string]: TranslatedString[];
};

export const formInputValidator = (context: any) => {
  const inputErrorMessages: InputErrorMessages = {};

  if (!context.firstName) {
    if (!inputErrorMessages['firstName']) {
      inputErrorMessages['firstName'] = [];
    }
    inputErrorMessages['firstName'].push(
      PageText.Contact.inputFields.firstName.errorMessages.empty,
    );
  }

  if (!context.lastName) {
    if (!inputErrorMessages['lastName']) {
      inputErrorMessages['lastName'] = [];
    }
    inputErrorMessages['lastName'].push(
      PageText.Contact.inputFields.lastName.errorMessages.empty,
    );
  }

  if (!context.email) {
    if (!inputErrorMessages['email']) {
      inputErrorMessages['email'] = [];
    }
    inputErrorMessages['email'].push(
      PageText.Contact.inputFields.email.errorMessages.empty,
    );
  }

  if (!context.address) {
    if (!inputErrorMessages['address']) {
      inputErrorMessages['address'] = [];
    }
    inputErrorMessages['address'].push(
      PageText.Contact.inputFields.address.errorMessages.empty,
    );
  }

  if (!context.postalCode) {
    if (!inputErrorMessages['postalCode']) {
      inputErrorMessages['postalCode'] = [];
    }
    inputErrorMessages['postalCode'].push(
      PageText.Contact.inputFields.postalCode.errorMessages.empty,
    );
  }

  if (!context.city) {
    if (!inputErrorMessages['city']) {
      inputErrorMessages['city'] = [];
    }
    inputErrorMessages['city'].push(
      PageText.Contact.inputFields.city.errorMessages.empty,
    );
  }

  if (!context.phoneNumber) {
    if (!inputErrorMessages['phoneNumber']) {
      inputErrorMessages['phoneNumber'] = [];
    }
    inputErrorMessages['phoneNumber'].push(
      PageText.Contact.inputFields.phoneNumber.errorMessages.empty,
    );
  }

  if (!context.bankAccountNumber && !context.IBAN && !context.SWIFT) {
    if (!inputErrorMessages['bankAccountNumber']) {
      inputErrorMessages['bankAccountNumber'] = [];
    }
    inputErrorMessages['bankAccountNumber'].push(
      PageText.Contact.inputFields.bankAccountNumber.errorMessages.empty,
    );
  }

  if (!context.transportMode) {
    if (!inputErrorMessages['transportMode']) {
      inputErrorMessages['transportMode'] = [];
    }
    inputErrorMessages['transportMode'].push(
      PageText.Contact.inputFields.transportMode.errorMessages.empty,
    );
  }

  if (!context.line) {
    if (!inputErrorMessages['line']) {
      inputErrorMessages['line'] = [];
    }
    inputErrorMessages['line'].push(
      PageText.Contact.inputFields.line.errorMessages.empty,
    );
  }

  if (!context.fromStop) {
    if (!inputErrorMessages['fromStop']) {
      inputErrorMessages['fromStop'] = [];
    }
    inputErrorMessages['fromStop'].push(
      PageText.Contact.inputFields.fromStop.errorMessages.empty,
    );
  }

  if (!context.toStop) {
    if (!inputErrorMessages['toStop']) {
      inputErrorMessages['toStop'] = [];
    }
    inputErrorMessages['toStop'].push(
      PageText.Contact.inputFields.toStop.errorMessages.empty,
    );
  }

  if (!context.reasonForTransportFailure) {
    if (!inputErrorMessages['reasonForTransportFailure']) {
      inputErrorMessages['reasonForTransportFailure'] = [];
    }
    inputErrorMessages['reasonForTransportFailure'].push(
      PageText.Contact.inputFields.reasonForTransportFailure.errorMessages
        .empty,
    );
  }

  // Populate context.errorMessages
  context.errorMessages = inputErrorMessages;

  // Return false if any error
  return Object.keys(inputErrorMessages).length > 0 ? false : true;
};
