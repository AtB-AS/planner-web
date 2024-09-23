import { PageText } from '@atb/translations';
import { addErrorMessage, InputErrorMessages } from './utils';

export const commonFieldValidator = (context: any) => {
  const inputErrorMessages: InputErrorMessages = {};
  const inputFieldRules = [
    {
      field: 'firstName',
      validCondition:
        context.firstName ||
        context.formType === 'driver' ||
        context.formType === 'transportation' ||
        context.formType === 'delay' ||
        context.formType === 'stop' ||
        context.formType === 'serviceOffering' ||
        context.formType === 'injury',
      errorMessage: PageText.Contact.inputFields.firstName.errorMessages.empty,
    },
    {
      field: 'lastName',
      validCondition:
        context.lastName ||
        context.formType === 'driver' ||
        context.formType === 'transportation' ||
        context.formType === 'delay' ||
        context.formType === 'stop' ||
        context.formType === 'serviceOffering' ||
        context.formType === 'injury',
      errorMessage: PageText.Contact.inputFields.lastName.errorMessages.empty,
    },
    {
      field: 'email',
      validCondition:
        context.email ||
        context.formType === 'driver' ||
        context.formType === 'transportation' ||
        context.formType === 'delay' ||
        context.formType === 'stop' ||
        context.formType === 'serviceOffering' ||
        context.formType === 'injury' ||
        context.wantsToBeContacted === false,
      errorMessage: PageText.Contact.inputFields.email.errorMessages.empty,
    },
    {
      field: 'address',
      validCondition: context.address,
      errorMessage: PageText.Contact.inputFields.address.errorMessages.empty,
    },
    {
      field: 'postalCode',
      validCondition: context.postalCode,
      errorMessage: PageText.Contact.inputFields.postalCode.errorMessages.empty,
    },
    {
      field: 'city',
      validCondition: context.city,
      errorMessage: PageText.Contact.inputFields.city.errorMessages.empty,
    },
    {
      field: 'phoneNumber',
      validCondition: context.phoneNumber,
      errorMessage:
        PageText.Contact.inputFields.phoneNumber.errorMessages.empty,
    },
    {
      field: 'bankAccountNumber',
      validCondition:
        context.bankAccountNumber || context.IBAN || context.SWIFT,
      errorMessage:
        PageText.Contact.inputFields.bankAccountNumber.errorMessages.empty,
    },
    {
      field: 'area',
      validCondition: context.area,
      errorMessage: PageText.Contact.inputFields.area.errorMessages.empty,
    },
    {
      field: 'transportMode',
      validCondition: context.transportMode,
      errorMessage:
        PageText.Contact.inputFields.transportMode.errorMessages.empty,
    },
    {
      field: 'line',
      validCondition: context.line,
      errorMessage: PageText.Contact.inputFields.line.errorMessages.empty,
    },
    {
      field: 'fromStop',
      validCondition: context.fromStop,
      errorMessage: PageText.Contact.inputFields.fromStop.errorMessages.empty,
    },
    {
      field: 'toStop',
      validCondition: context.toStop,
      errorMessage: PageText.Contact.inputFields.toStop.errorMessages.empty,
    },
    {
      field: 'reasonForTransportFailure',
      validCondition: context.reasonForTransportFailure,
      errorMessage:
        PageText.Contact.inputFields.reasonForTransportFailure.errorMessages
          .empty,
    },
    {
      field: 'feeNumber',
      validCondition: context.feeNumber,
      errorMessage: PageText.Contact.inputFields.feeNumber.errorMessages.empty,
    },
    {
      field: 'feeNumber',
      validCondition: context.feeNumber && context.feeNumber.length === 4,
      errorMessage:
        PageText.Contact.inputFields.feeNumber.errorMessages.notFourDigits,
    },
    {
      field: 'invoiceNumber',
      validCondition: context.invoiceNumber,
      errorMessage:
        PageText.Contact.inputFields.invoiceNumber.errorMessages.empty,
    },
    {
      field: 'appPhoneNumber',
      validCondition: context.appPhoneNumber || context.travelCardNumber,
      errorMessage:
        PageText.Contact.inputFields.ticketStorage.app.appPhoneNumber
          .errorMessages.empty,
    },
    {
      field: 'customerNumber',
      validCondition: context.customerNumber || context.travelCardNumber,
      errorMessage:
        PageText.Contact.inputFields.ticketStorage.app.customerNumber
          .errorMessages.empty,
    },
    {
      field: 'travelCardNumber',
      validCondition:
        context.travelCardNumber ||
        (context.appPhoneNumber && context.customerNumber),
      errorMessage:
        PageText.Contact.inputFields.ticketStorage.travelCardNumber
          .errorMessages.empty,
    },
    {
      field: 'feedback',
      validCondition: context.feedback,
      errorMessage: PageText.Contact.inputFields.feedback.errorMessages.empty,
    },
  ];

  // Iterate over each field and apply validation
  inputFieldRules.forEach(({ field, validCondition, errorMessage }) =>
    addErrorMessage(
      context,
      field,
      validCondition,
      inputErrorMessages,
      errorMessage,
    ),
  );

  // Populate context.errorMessages
  context.errorMessages = inputErrorMessages;

  console.log(context.errorMessages);

  // Return false if any error
  return Object.keys(context.errorMessages).length > 0 ? false : true;
};

export default commonFieldValidator;
