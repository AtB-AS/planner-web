import { PageText, TranslatedString } from '@atb/translations';

const removeWhitespace = (value: string): string => value.replace(/\s+/g, '');

const isNotEmptyOrUndefined = (value: string | undefined): boolean =>
  value !== undefined && removeWhitespace(value) !== '';

const isDigitsOnly = (value: string): boolean => /^\d+$/.test(value);

const hasExpectedLength =
  (expectedLength: number) => (value: string | undefined) =>
    value?.length === expectedLength;

const isValidBankAccount = (value: string): boolean => {
  if (value.includes('.')) {
    if (value[4] !== '.' && value[8] !== '.') return false;
  }

  const cleaned = removeWhitespace(value.replace(/\./g, ''));

  if (!isDigitsOnly(cleaned)) return false;
  return hasExpectedLength(11)(cleaned);
};

const containsAtLeastOneLetter = (value: string): boolean =>
  /[a-zA-ZæøåÆØÅ]/.test(value);

type ValidationRule = {
  validate: (value: any) => boolean;
  errorMessage: TranslatedString;
};

const rulesFirstName: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.firstName.errorMessages.empty,
  },
  {
    validate: containsAtLeastOneLetter,
    errorMessage: PageText.Contact.input.firstName.errorMessages.empty,
  },
];

const rulesLastName: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.lastName.errorMessages.empty,
  },
  {
    validate: containsAtLeastOneLetter,
    errorMessage: PageText.Contact.input.lastName.errorMessages.empty,
  },
];

const rulesEmail: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.email.errorMessages.empty,
  },
];

const rulesAddress: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.address.errorMessages.empty,
  },
  {
    validate: containsAtLeastOneLetter,
    errorMessage: PageText.Contact.input.address.errorMessages.empty,
  },
];

const rulesPostalCode: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.postalCode.errorMessages.empty,
  },
  {
    validate: hasExpectedLength(4),
    errorMessage: PageText.Contact.input.postalCode.errorMessages.invalidFormat,
  },
];

const rulesCity: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.city.errorMessages.empty,
  },
  {
    validate: containsAtLeastOneLetter,
    errorMessage: PageText.Contact.input.city.errorMessages.empty,
  },
];

const rulesPhoneNumber: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.phoneNumber.errorMessages.empty,
  },
];

const rulesBankAccountNumber: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage:
      PageText.Contact.input.bankInformation.bankAccountNumber.errorMessages
        .empty,
  },
  {
    validate: isValidBankAccount,
    errorMessage:
      PageText.Contact.input.bankInformation.bankAccountNumber.errorMessages
        .invalidFormat,
  },
];

const rulesIBAN: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage:
      PageText.Contact.input.bankInformation.IBAN.errorMessages.empty,
  },
];

const rulesSWIFT: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage:
      PageText.Contact.input.bankInformation.SWIFT.errorMessages.empty,
  },
];

const rulesTransportMode: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.transportMode.errorMessages.empty,
  },
];

const rulesLine: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.line.errorMessages.empty,
  },
];

const rulesFromStop: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.fromStop.errorMessages.empty,
  },
];

const rulesToStop: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.toStop.errorMessages.empty,
  },
];

const rulesDate: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.date.errorMessages.empty,
  },
];

const rulesDateOfTicketControl: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.date.ticketControl.errorMessages.empty,
  },
];

const rulesTimeOfTicketControl: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.time.ticketControl.errorMessages.empty,
  },
];

const rulesPlannedDepartureTime: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage:
      PageText.Contact.input.plannedDepartureTime.errorMessages.empty,
  },
];

const rulesReasonForTransportFailure: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage:
      PageText.Contact.input.reasonForTransportFailure.errorMessages.empty,
  },
];

const rulesFeeNumber: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.feeNumber.errorMessages.empty,
  },
  {
    validate: hasExpectedLength(4),
    errorMessage: PageText.Contact.input.feeNumber.errorMessages.invalidFormat,
  },
  {
    validate: isDigitsOnly,
    errorMessage: PageText.Contact.input.feeNumber.errorMessages.invalidFormat,
  },
];

const rulesInvoiceNumber: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.invoiceNumber.errorMessages.empty,
  },
];

const rulesFeedback: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.feedback.errorMessages.empty,
  },
];

const rulesKilometersDriven: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.kilometersDriven.errorMessages.empty,
  },
];

const rulesFromAddress: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.fromAddress.errorMessages.empty,
  },
];

const rulesToAddress: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.toAddress.errorMessages.empty,
  },
];

const rulesQuestion: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.question.errorMessages.empty,
  },
];

const rulesOrderId: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.orderId.errorMessages.empty,
  },
];

const rulesRefundReason: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.refundReason.errorMessages.empty,
  },
];

const rulesAmount: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.amount.errorMessages.empty,
  },
];

const rulesTicketType: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.ticketType.errorMessages.empty,
  },
];

const rulesAPurchasePlatform: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.purchasePlatform.errorMessages.empty,
  },
];

const rulesAttachments: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.components.fileinput.errorMessages.empty,
  },
];

const rulesAppPhoneNumber: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.appPhoneNumber.errorMessages.empty,
  },
];

const rulesCustomerNumber: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.customerNumber.errorMessages.empty,
  },
  {
    validate: isDigitsOnly,
    errorMessage:
      PageText.Contact.input.customerNumber.errorMessages.invalidFormat,
  },

  {
    validate: hasExpectedLength(7),
    errorMessage:
      PageText.Contact.input.customerNumber.errorMessages.invalidFormat,
  },
];

const rulesTravelCardNumber: ValidationRule[] = [
  {
    validate: isNotEmptyOrUndefined,
    errorMessage: PageText.Contact.input.travelCardNumber.errorMessages.empty,
  },
];

type ValidationRulesMap = {
  [inputName: string]: ValidationRule[];
};

export const validationRules: ValidationRulesMap = {
  firstName: rulesFirstName,
  lastName: rulesLastName,
  email: rulesEmail,
  address: rulesAddress,
  postalCode: rulesPostalCode,
  city: rulesCity,
  phoneNumber: rulesPhoneNumber,
  bankAccountNumber: rulesBankAccountNumber,
  IBAN: rulesIBAN,
  SWIFT: rulesSWIFT,
  transportMode: rulesTransportMode,
  line: rulesLine,
  fromStop: rulesFromStop,
  toStop: rulesToStop,
  date: rulesDate,
  dateOfTicketControl: rulesDateOfTicketControl,
  timeOfTicketControl: rulesTimeOfTicketControl,
  plannedDepartureTime: rulesPlannedDepartureTime,
  reasonForTransportFailure: rulesReasonForTransportFailure,
  feeNumber: rulesFeeNumber,
  invoiceNumber: rulesInvoiceNumber,
  feedback: rulesFeedback,
  kilometersDriven: rulesKilometersDriven,
  fromAddress: rulesFromAddress,
  toAddress: rulesToAddress,
  question: rulesQuestion,
  orderId: rulesOrderId,
  refundReason: rulesRefundReason,
  amount: rulesAmount,
  ticketType: rulesTicketType,
  purchasePlatform: rulesAPurchasePlatform,
  attachments: rulesAttachments,
  appPhoneNumber: rulesAppPhoneNumber,
  customerNumber: rulesCustomerNumber,
  travelCardNumber: rulesTravelCardNumber,
};
