import { PageText } from '@atb/translations';
import { addErrorMessage, InputErrorMessages } from '../utils';

export const travelGuaranteeFieldValidator = (context: any) => {
  const inputErrorMessages: InputErrorMessages = {};
  const inputFieldRules = [
    {
      field: 'firstName',
      validCondition: context.firstName,
      errorMessage: PageText.Contact.inputFields.firstName.errorMessages.empty,
    },
    {
      field: 'lastName',
      validCondition: context.lastName,
      errorMessage: PageText.Contact.inputFields.lastName.errorMessages.empty,
    },
    {
      field: 'email',
      validCondition: context.email,
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
        PageText.Contact.inputFields.transportMode.errorMessages.empty,
    },

    {
      field: 'transportMode',
      validCondition:
        (context.transportMode &&
          context.travelGuaranteeStateWhenSubmitted !== 'other') ||
        context.travelGuaranteeStateWhenSubmitted === 'other',

      errorMessage:
        PageText.Contact.inputFields.transportMode.errorMessages.empty,
    },
    {
      field: 'line',
      validCondition:
        (context.line &&
          context.travelGuaranteeStateWhenSubmitted !== 'other') ||
        context.travelGuaranteeStateWhenSubmitted === 'other',
      errorMessage: PageText.Contact.inputFields.line.errorMessages.empty,
    },
    {
      field: 'fromStop',
      validCondition:
        (context.fromStop &&
          context.travelGuaranteeStateWhenSubmitted !== 'other') ||
        context.travelGuaranteeStateWhenSubmitted === 'other',
      errorMessage: PageText.Contact.inputFields.fromStop.errorMessages.empty,
    },
    {
      field: 'toStop',
      validCondition:
        (context.toStop &&
          context.travelGuaranteeStateWhenSubmitted !== 'other') ||
        context.travelGuaranteeStateWhenSubmitted === 'other',

      errorMessage: PageText.Contact.inputFields.toStop.errorMessages.empty,
    },
    {
      field: 'reasonForTransportFailure',
      validCondition:
        (context.reasonForTransportFailure &&
          context.travelGuaranteeStateWhenSubmitted !== 'other') ||
        context.travelGuaranteeStateWhenSubmitted === 'other',

      errorMessage:
        PageText.Contact.inputFields.reasonForTransportFailure.errorMessages
          .empty,
    },
    {
      field: 'kilometersDriven',
      validCondition:
        (context.kilometersDriven &&
          context.travelGuaranteeStateWhenSubmitted == 'car') ||
        context.travelGuaranteeStateWhenSubmitted == 'taxi' ||
        context.travelGuaranteeStateWhenSubmitted == 'other',
      errorMessage:
        PageText.Contact.inputFields.kilometersDriven.errorMessages.empty,
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

  // Return false if any error
  return Object.keys(context.errorMessages).length > 0 ? false : true;
};

export default travelGuaranteeFieldValidator;
