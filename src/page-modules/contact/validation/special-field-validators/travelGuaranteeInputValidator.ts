import { PageText } from '@atb/translations';
import { addErrorMessage, InputErrorMessages } from '../utils';

export const travelGuaranteeInputValidator = (context: any) => {
  const inputErrorMessages: InputErrorMessages = {};
  const inputRules = [
    {
      inputName: 'firstName',
      validCondition: context.firstName,
      errorMessage: PageText.Contact.inputFields.firstName.errorMessages.empty,
    },
    {
      inputName: 'lastName',
      validCondition: context.lastName,
      errorMessage: PageText.Contact.inputFields.lastName.errorMessages.empty,
    },
    {
      inputName: 'email',
      validCondition: context.email,
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
        PageText.Contact.inputFields.transportMode.errorMessages.empty,
    },

    {
      inputName: 'transportMode',
      validCondition:
        (context.transportMode &&
          context.travelGuaranteeStateWhenSubmitted !== 'other') ||
        context.travelGuaranteeStateWhenSubmitted === 'other',

      errorMessage:
        PageText.Contact.inputFields.transportMode.errorMessages.empty,
    },
    {
      inputName: 'line',
      validCondition:
        (context.line &&
          context.travelGuaranteeStateWhenSubmitted !== 'other') ||
        context.travelGuaranteeStateWhenSubmitted === 'other',
      errorMessage: PageText.Contact.inputFields.line.errorMessages.empty,
    },
    {
      inputName: 'fromStop',
      validCondition:
        (context.fromStop &&
          context.travelGuaranteeStateWhenSubmitted !== 'other') ||
        context.travelGuaranteeStateWhenSubmitted === 'other',
      errorMessage: PageText.Contact.inputFields.fromStop.errorMessages.empty,
    },
    {
      inputName: 'toStop',
      validCondition:
        (context.toStop &&
          context.travelGuaranteeStateWhenSubmitted !== 'other') ||
        context.travelGuaranteeStateWhenSubmitted === 'other',

      errorMessage: PageText.Contact.inputFields.toStop.errorMessages.empty,
    },
    {
      inputName: 'reasonForTransportFailure',
      validCondition:
        (context.reasonForTransportFailure &&
          context.travelGuaranteeStateWhenSubmitted !== 'other') ||
        context.travelGuaranteeStateWhenSubmitted === 'other',

      errorMessage:
        PageText.Contact.inputFields.reasonForTransportFailure.errorMessages
          .empty,
    },
    {
      inputName: 'kilometersDriven',
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

export default travelGuaranteeInputValidator;
