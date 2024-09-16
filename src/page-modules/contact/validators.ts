import { PageText, TranslatedString } from '@atb/translations';

export type InputErrorMessages = {
  [key: string]: TranslatedString[]; // Error messages indexed by field name
};

export const validateInputFields = (context: any) => {
  const inputErrorMessages: InputErrorMessages = {};

  if (!context.firstname) {
    if (!inputErrorMessages['firstname']) {
      inputErrorMessages['firstname'] = []; // Initialize the array if it doesn't exist
    }
    inputErrorMessages['firstname'].push(
      PageText.Contact.aboutYouInfo.lastname,
    );
  }

  if (!context.lastname) {
    if (!inputErrorMessages['lastname']) {
      inputErrorMessages['lastname'] = []; // Initialize the array if it doesn't exist
    }
    inputErrorMessages['lastname'].push(PageText.Contact.aboutYouInfo.lastname);
  }

  // Check for Email
  if (!context.email) {
    if (!inputErrorMessages['email']) {
      inputErrorMessages['email'] = []; // Initialize the array if it doesn't exist
    }
    inputErrorMessages['email'].push(PageText.Contact.aboutYouInfo.email);
  }

  // Check for Address
  if (!context.address) {
    if (!inputErrorMessages['address']) {
      inputErrorMessages['address'] = []; // Initialize the array if it doesn't exist
    }
    inputErrorMessages['address'].push(PageText.Contact.aboutYouInfo.address);
  }

  // Check for Postal Code
  if (!context.postalCode) {
    if (!inputErrorMessages['postalCode']) {
      inputErrorMessages['postalCode'] = []; // Initialize the array if it doesn't exist
    }
    inputErrorMessages['postalCode'].push(
      PageText.Contact.aboutYouInfo.postalCode,
    );
  }

  // Check for City
  if (!context.city) {
    if (!inputErrorMessages['city']) {
      inputErrorMessages['city'] = []; // Initialize the array if it doesn't exist
    }
    inputErrorMessages['city'].push(PageText.Contact.aboutYouInfo.city);
  }

  // Check for Phone Number
  if (!context.phonenumber) {
    if (!inputErrorMessages['phonenumber']) {
      inputErrorMessages['phonenumber'] = []; // Initialize the array if it doesn't exist
    }
    inputErrorMessages['phonenumber'].push(
      PageText.Contact.aboutYouInfo.phonenumber,
    );
  }

  // Check for Bank Account
  if (!context.bankAccount) {
    if (!inputErrorMessages['bankAccount']) {
      inputErrorMessages['bankAccount'] = []; // Initialize the array if it doesn't exist
    }
    inputErrorMessages['bankAccount'].push(
      PageText.Contact.aboutYouInfo.phonenumber,
    );
  }

  // Check for IBAN
  if (!context.IBAN) {
    if (!inputErrorMessages['IBAN']) {
      inputErrorMessages['IBAN'] = []; // Initialize the array if it doesn't exist
    }
    inputErrorMessages['IBAN'].push(PageText.Contact.aboutYouInfo.phonenumber);
  }

  // Check for SWIFT
  if (!context.SWIFT) {
    if (!inputErrorMessages['SWIFT']) {
      inputErrorMessages['SWIFT'] = []; // Initialize the array if it doesn't exist
    }
    inputErrorMessages['SWIFT'].push(PageText.Contact.aboutYouInfo.phonenumber);
  }

  // Check for transportMode
  if (!context.transportMode) {
    if (!inputErrorMessages['transportMode']) {
      inputErrorMessages['transportMode'] = []; // Initialize the array if it doesn't exist
    }
    inputErrorMessages['transportMode'].push(
      PageText.Contact.aboutYouInfo.phonenumber,
    );
  }

  // Check for line
  if (!context.line) {
    if (!inputErrorMessages['line']) {
      inputErrorMessages['line'] = []; // Initialize the array if it doesn't exist
    }
    inputErrorMessages['line'].push(PageText.Contact.aboutYouInfo.phonenumber);
  }

  // Check for departureLocation
  if (!context.line) {
    if (!inputErrorMessages['departureLocation']) {
      inputErrorMessages['departureLocation'] = []; // Initialize the array if it doesn't exist
    }
    inputErrorMessages['departureLocation'].push(
      PageText.Contact.aboutYouInfo.phonenumber,
    );
  }
  // Check for arrivalLocation
  if (!context.line) {
    if (!inputErrorMessages['arrivalLocation']) {
      inputErrorMessages['arrivalLocation'] = []; // Initialize the array if it doesn't exist
    }
    inputErrorMessages['arrivalLocation'].push(
      PageText.Contact.aboutYouInfo.phonenumber,
    );
  }

  // Populate context.errorMessages
  context.errorMessages = inputErrorMessages;

  // Return false if any error
  return Object.keys(inputErrorMessages).length > 0 ? false : true;
};
