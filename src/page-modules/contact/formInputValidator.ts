import { PageText, TranslatedString } from '@atb/translations';

export type InputErrorMessages = {
  [key: string]: TranslatedString[];
};

export const formInputValidator = (context: any) => {
  const inputErrorMessages: InputErrorMessages = {};

  if (!context.firstname) {
    if (!inputErrorMessages['firstname']) {
      inputErrorMessages['firstname'] = [];
    }
    inputErrorMessages['firstname'].push(
      PageText.Contact.inputFields.firstname.errorMessages.empty,
    );
  }

  if (!context.lastname) {
    if (!inputErrorMessages['lastname']) {
      inputErrorMessages['lastname'] = [];
    }
    inputErrorMessages['lastname'].push(
      PageText.Contact.inputFields.lastname.errorMessages.empty,
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

  if (!context.phonenumber) {
    if (!inputErrorMessages['phonenumber']) {
      inputErrorMessages['phonenumber'] = [];
    }
    inputErrorMessages['phonenumber'].push(
      PageText.Contact.inputFields.phonenumber.errorMessages.empty,
    );
  }

  if (!context.bankAccount && !context.IBAN && !context.SWIFT) {
    if (!inputErrorMessages['bankAccount']) {
      inputErrorMessages['bankAccount'] = [];
    }
    inputErrorMessages['bankAccount'].push(
      PageText.Contact.inputFields.bankAccount.errorMessages.empty,
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

  if (!context.departureLocation) {
    if (!inputErrorMessages['departureLocation']) {
      inputErrorMessages['departureLocation'] = [];
    }
    inputErrorMessages['departureLocation'].push(
      PageText.Contact.inputFields.departureLocation.errorMessages.empty,
    );
  }

  if (!context.arrivalLocation) {
    if (!inputErrorMessages['arrivalLocation']) {
      inputErrorMessages['arrivalLocation'] = [];
    }
    inputErrorMessages['arrivalLocation'].push(
      PageText.Contact.inputFields.arrivalLocation.errorMessages.empty,
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
