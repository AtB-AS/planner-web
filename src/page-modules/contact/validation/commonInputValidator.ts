import { PageText } from '@atb/translations';
import { addErrorMessage, InputErrorMessages } from './utils';

export const commonInputValidator = (context: any) => {
  const inputErrorMessages: InputErrorMessages = {};
  const inputRules = [
    {
      inputName: 'firstName',
      validCondition: context.firstName || context.isContactInfoOptional,

      errorMessage: PageText.Contact.inputFields.firstName.errorMessages.empty,
    },
    {
      inputName: 'lastName',
      validCondition: context.lastName || context.isContactInfoOptional,
      errorMessage: PageText.Contact.inputFields.lastName.errorMessages.empty,
    },
    {
      inputName: 'email',
      validCondition: context.email || context.isContactInfoOptional,
      errorMessage: PageText.Contact.inputFields.email.errorMessages.empty,
    },
    {
      inputName: 'address',
      validCondition: context.address,
      errorMessage: PageText.Contact.inputFields.address.errorMessages.empty,
    },
    {
      inputName: 'postalCode',
      validCondition: context.postalCode,
      errorMessage: PageText.Contact.inputFields.postalCode.errorMessages.empty,
    },
    {
      inputName: 'city',
      validCondition: context.city,
      errorMessage: PageText.Contact.inputFields.city.errorMessages.empty,
    },
    {
      inputName: 'phoneNumber',
      validCondition: context.phoneNumber,
      errorMessage:
        PageText.Contact.inputFields.phoneNumber.errorMessages.empty,
    },
    {
      inputName: 'bankAccountNumber',
      validCondition:
        context.bankAccountNumber || context.IBAN || context.SWIFT,
      errorMessage:
        PageText.Contact.inputFields.bankAccountNumber.errorMessages.empty,
    },
    {
      inputName: 'area',
      validCondition: context.area,
      errorMessage: PageText.Contact.inputFields.area.errorMessages.empty,
    },
    {
      inputName: 'transportMode',
      validCondition: context.transportMode,
      errorMessage:
        PageText.Contact.inputFields.transportMode.errorMessages.empty,
    },
    {
      inputName: 'line',
      validCondition: context.line,
      errorMessage: PageText.Contact.inputFields.line.errorMessages.empty,
    },
    {
      inputName: 'fromStop',
      validCondition: context.fromStop,
      errorMessage: PageText.Contact.inputFields.fromStop.errorMessages.empty,
    },
    {
      inputName: 'toStop',
      validCondition: context.toStop,
      errorMessage: PageText.Contact.inputFields.toStop.errorMessages.empty,
    },
    {
      inputName: 'reasonForTransportFailure',
      validCondition: context.reasonForTransportFailure,
      errorMessage:
        PageText.Contact.inputFields.reasonForTransportFailure.errorMessages
          .empty,
    },
    {
      inputName: 'feeNumber',
      validCondition: context.feeNumber,
      errorMessage: PageText.Contact.inputFields.feeNumber.errorMessages.empty,
    },
    {
      inputName: 'feeNumber',
      validCondition: context.feeNumber && context.feeNumber.length === 4,
      errorMessage:
        PageText.Contact.inputFields.feeNumber.errorMessages.notFourDigits,
    },
    {
      inputName: 'invoiceNumber',
      validCondition: context.invoiceNumber,
      errorMessage:
        PageText.Contact.inputFields.invoiceNumber.errorMessages.empty,
    },
    {
      inputName: 'appPhoneNumber',
      validCondition: context.appPhoneNumber || context.travelCardNumber,
      errorMessage:
        PageText.Contact.inputFields.ticketStorage.app.appPhoneNumber
          .errorMessages.empty,
    },
    {
      inputName: 'customerNumber',
      validCondition: context.customerNumber || context.travelCardNumber,
      errorMessage:
        PageText.Contact.inputFields.ticketStorage.app.customerNumber
          .errorMessages.empty,
    },
    {
      inputName: 'travelCardNumber',
      validCondition:
        context.travelCardNumber ||
        (context.appPhoneNumber && context.customerNumber),
      errorMessage:
        PageText.Contact.inputFields.ticketStorage.travelCardNumber
          .errorMessages.empty,
    },
    {
      inputName: 'feedback',
      validCondition: context.feedback,
      errorMessage: PageText.Contact.inputFields.feedback.errorMessages.empty,
    },
  ];

  // Iterate over each field and apply validation
  inputRules.forEach(({ inputName, validCondition, errorMessage }) =>
    addErrorMessage(
      context,
      inputName,
      validCondition,
      inputErrorMessages,
      errorMessage,
    ),
  );

  // Populate context.errorMessages
  context.errorMessages = inputErrorMessages;

  // Return false if any error
  return Object.keys(context.errorMessages).length > 0 ? false : true;
};

export default commonInputValidator;
