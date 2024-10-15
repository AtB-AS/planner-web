import { PageText } from '@atb/translations';
import { addErrorMessage, InputErrorMessages } from './utils';

export const commonInputValidator = (context: any) => {
  const inputErrorMessages: InputErrorMessages = {};
  const inputRules = [
    {
      inputName: 'firstName',
      validCondition: context.firstName,

      errorMessage: PageText.Contact.input.firstName.errorMessages.empty,
    },
    {
      inputName: 'lastName',
      validCondition: context.lastName,
      errorMessage: PageText.Contact.input.lastName.errorMessages.empty,
    },
    {
      inputName: 'email',
      validCondition: context.email,
      errorMessage: PageText.Contact.input.email.errorMessages.empty,
    },
    {
      inputName: 'address',
      validCondition: context.address,
      errorMessage: PageText.Contact.input.address.errorMessages.empty,
    },
    {
      inputName: 'postalCode',
      validCondition: context.postalCode,
      errorMessage: PageText.Contact.input.postalCode.errorMessages.empty,
    },
    {
      inputName: 'city',
      validCondition: context.city,
      errorMessage: PageText.Contact.input.city.errorMessages.empty,
    },
    {
      inputName: 'phoneNumber',
      validCondition: context.phoneNumber,
      errorMessage: PageText.Contact.input.phoneNumber.errorMessages.empty,
    },
    {
      inputName: 'bankAccountNumber',
      validCondition: context.bankAccountNumber,
      errorMessage:
        PageText.Contact.input.bankInformation.bankAccountNumber.errorMessages
          .empty,
    },
    {
      inputName: 'IBAN',
      validCondition: context.IBAN,
      errorMessage:
        PageText.Contact.input.bankInformation.IBAN.errorMessages.empty,
    },
    {
      inputName: 'SWIFT',
      validCondition: context.SWIFT,
      errorMessage:
        PageText.Contact.input.bankInformation.SWIFT.errorMessages.empty,
    },
    {
      inputName: 'area',
      validCondition: context.area,
      errorMessage: PageText.Contact.input.area.errorMessages.empty,
    },
    {
      inputName: 'transportMode',
      validCondition: context.transportMode,
      errorMessage: PageText.Contact.input.transportMode.errorMessages.empty,
    },
    {
      inputName: 'line',
      validCondition: context.line,
      errorMessage: PageText.Contact.input.line.errorMessages.empty,
    },
    {
      inputName: 'fromStop',
      validCondition: context.fromStop,
      errorMessage: PageText.Contact.input.fromStop.errorMessages.empty,
    },
    {
      inputName: 'toStop',
      validCondition: context.toStop,
      errorMessage: PageText.Contact.input.toStop.errorMessages.empty,
    },
    {
      inputName: 'date',
      validCondition: context.date,
      errorMessage: PageText.Contact.input.date.errorMessages.empty,
    },
    {
      inputName: 'plannedDepartureTime',
      validCondition: context.plannedDepartureTime,
      errorMessage:
        PageText.Contact.input.plannedDepartureTime.errorMessages.empty,
    },
    {
      inputName: 'reasonForTransportFailure',
      validCondition: context.reasonForTransportFailure,
      errorMessage:
        PageText.Contact.input.reasonForTransportFailure.errorMessages.empty,
    },
    {
      inputName: 'feeNumber',
      validCondition: context.feeNumber,
      errorMessage: PageText.Contact.input.feeNumber.errorMessages.empty,
    },
    {
      inputName: 'feeNumber',
      validCondition: context.feeNumber && context.feeNumber.length === 4,
      errorMessage:
        PageText.Contact.input.feeNumber.errorMessages.notFourDigits,
    },
    {
      inputName: 'invoiceNumber',
      validCondition: context.invoiceNumber,
      errorMessage: PageText.Contact.input.invoiceNumber.errorMessages.empty,
    },
    {
      inputName: 'appPhoneNumber',
      validCondition: context.appPhoneNumber || context.travelCardNumber,
      errorMessage: PageText.Contact.input.appPhoneNumber.errorMessages.empty,
    },
    {
      inputName: 'customerNumber',
      validCondition: context.customerNumber || context.travelCardNumber,
      errorMessage: PageText.Contact.input.customerNumber.errorMessages.empty,
    },
    {
      inputName: 'travelCardNumber',
      validCondition:
        context.travelCardNumber ||
        (context.appPhoneNumber && context.customerNumber),
      errorMessage: PageText.Contact.input.travelCardNumber.errorMessages.empty,
    },
    {
      inputName: 'feedback',
      validCondition: context.feedback && context.feedback.length > 0,
      errorMessage: PageText.Contact.input.feedback.errorMessages.empty,
    },
    {
      inputName: 'kilometersDriven',
      validCondition: context.kilometersDriven,
      errorMessage: PageText.Contact.input.kilometersDriven.errorMessages.empty,
    },
    {
      inputName: 'fromAddress',
      validCondition: context.fromAddress,
      errorMessage: PageText.Contact.input.fromAddress.errorMessages.empty,
    },
    {
      inputName: 'toAddress',
      validCondition: context.toAddress,
      errorMessage: PageText.Contact.input.toAddress.errorMessages.empty,
    },
    {
      inputName: 'question',
      validCondition: context.question,
      errorMessage: PageText.Contact.input.question.errorMessages.empty,
    },
    {
      inputName: 'orderId',
      validCondition: context.orderId,
      errorMessage: PageText.Contact.input.orderId.errorMessages.empty,
    },
    {
      inputName: 'refundReason',
      validCondition: context.refundReason,
      errorMessage: PageText.Contact.input.refundReason.errorMessages.empty,
    },
    {
      inputName: 'amount',
      validCondition: context.amount,
      errorMessage: PageText.Contact.input.amount.errorMessages.empty,
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

  return inputErrorMessages;
};

export default commonInputValidator;
