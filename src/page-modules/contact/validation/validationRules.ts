import { PageText, TranslatedString } from '@atb/translations';
import { Line } from '..';
import { TransportModeType } from '../types';

const isDefined = <T>(value: T | undefined): value is T => value !== undefined;

const removeWhitespace = (value: string): string => {
  return value.replace(/\s+/g, '');
};

const isNonEmptyString = (value: string): boolean =>
  typeof value === 'string' && removeWhitespace(value) !== '';

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

// phone number can optionally start with [+] and must consist of [0-9]. Whitespaces are ignored.
const isValidMobilNumber = (value: string): boolean =>
  /^[+]?\d+$/.test(removeWhitespace(value));

type ValidationRule = {
  validate: (value: any) => boolean;
  errorMessage: TranslatedString;
};

const rulesFirstName: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage: PageText.Contact.input.firstName.errorMessages.empty,
  },
  {
    validate: containsAtLeastOneLetter,
    errorMessage: PageText.Contact.input.firstName.errorMessages.empty,
  },
];

const rulesLastName: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage: PageText.Contact.input.lastName.errorMessages.empty,
  },
  {
    validate: containsAtLeastOneLetter,
    errorMessage: PageText.Contact.input.lastName.errorMessages.empty,
  },
];

const rulesEmail: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage: PageText.Contact.input.email.errorMessages.empty,
  },
];

const rulesAddress: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage: PageText.Contact.input.address.errorMessages.empty,
  },
  {
    validate: containsAtLeastOneLetter,
    errorMessage: PageText.Contact.input.address.errorMessages.empty,
  },
];

const rulesPostalCode: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage: PageText.Contact.input.postalCode.errorMessages.empty,
  },
  {
    validate: hasExpectedLength(4),
    errorMessage: PageText.Contact.input.postalCode.errorMessages.invalidFormat,
  },
];

const rulesCity: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage: PageText.Contact.input.city.errorMessages.empty,
  },
  {
    validate: containsAtLeastOneLetter,
    errorMessage: PageText.Contact.input.city.errorMessages.empty,
  },
];

const rulesPhoneNumber: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage: PageText.Contact.input.phoneNumber.errorMessages.empty,
  },
  {
    validate: isValidMobilNumber,
    errorMessage:
      PageText.Contact.input.phoneNumber.errorMessages.invalidFormat,
  },
];

const rulesBankAccountNumber: ValidationRule[] = [
  {
    validate: isNonEmptyString,
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
    validate: isNonEmptyString,
    errorMessage:
      PageText.Contact.input.bankInformation.IBAN.errorMessages.empty,
  },
];

const rulesSWIFT: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage:
      PageText.Contact.input.bankInformation.SWIFT.errorMessages.empty,
  },
];

const rulesTransportMode: ValidationRule[] = [
  {
    validate: (_transportMode: TransportModeType) => isDefined(_transportMode),
    errorMessage: PageText.Contact.input.transportMode.errorMessages.empty,
  },
];

const rulesLine: ValidationRule[] = [
  {
    validate: (_line: Line) => isDefined(_line),
    errorMessage: PageText.Contact.input.line.errorMessages.empty,
  },
];

const rulesFromStop: ValidationRule[] = [
  {
    validate: (_fromStop: Line['quays'][0]) => isDefined(_fromStop),
    errorMessage: PageText.Contact.input.fromStop.errorMessages.empty,
  },
];

const rulesToStop: ValidationRule[] = [
  {
    validate: (_toStop: Line['quays'][0]) => isDefined(_toStop),
    errorMessage: PageText.Contact.input.toStop.errorMessages.empty,
  },
];

const rulesDate: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage: PageText.Contact.input.date.errorMessages.empty,
  },
];

const rulesDateOfTicketControl: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage: PageText.Contact.input.date.ticketControl.errorMessages.empty,
  },
];

const rulesTimeOfTicketControl: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage: PageText.Contact.input.time.ticketControl.errorMessages.empty,
  },
];

const rulesPlannedDepartureTime: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage:
      PageText.Contact.input.plannedDepartureTime.errorMessages.empty,
  },
];

const rulesReasonForTransportFailure: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage:
      PageText.Contact.input.reasonForTransportFailure.errorMessages.empty,
  },
];

const rulesFeeNumber: ValidationRule[] = [
  {
    validate: isNonEmptyString,
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
    validate: isNonEmptyString,
    errorMessage: PageText.Contact.input.invoiceNumber.errorMessages.empty,
  },
];

const rulesFeedback: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage: PageText.Contact.input.feedback.errorMessages.empty,
  },
];

const rulesKilometersDriven: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage: PageText.Contact.input.kilometersDriven.errorMessages.empty,
  },
];

const rulesFromAddress: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage: PageText.Contact.input.fromAddress.errorMessages.empty,
  },
];

const rulesToAddress: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage: PageText.Contact.input.toAddress.errorMessages.empty,
  },
];

const rulesQuestion: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage: PageText.Contact.input.question.errorMessages.empty,
  },
];

const rulesOrderId: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage: PageText.Contact.input.orderId.errorMessages.empty,
  },
  {
    validate: (_orderId: string) => {
      if (_orderId.includes(',')) return true; // Possibly multiple orderIds. If so, skip to next rule.
      const cleanedOrderId = removeWhitespace(_orderId);
      return hasExpectedLength(8)(cleanedOrderId);
    },
    errorMessage:
      PageText.Contact.input.orderId.errorMessages.invalidFormat.singleId,
  },
  {
    validate: (_orderIdsString: string) => {
      const orderIds = removeWhitespace(_orderIdsString).split(',');
      return orderIds.every((orderId) => hasExpectedLength(8)(orderId));
    },
    errorMessage:
      PageText.Contact.input.orderId.errorMessages.invalidFormat.multipleIds,
  },
];

const rulesRefundReason: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage: PageText.Contact.input.refundReason.errorMessages.empty,
  },
];

const rulesAmount: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage: PageText.Contact.input.amount.errorMessages.empty,
  },
];

const rulesTicketType: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage: PageText.Contact.input.ticketType.errorMessages.empty,
  },
];

const rulesAPurchasePlatform: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage: PageText.Contact.input.purchasePlatform.errorMessages.empty,
  },
];

const rulesAttachments: ValidationRule[] = [
  {
    validate: (_fileInput: File[]) => isDefined(_fileInput),
    errorMessage: PageText.Contact.components.fileinput.errorMessages.empty,
  },
];

const rulesAppPhoneNumber: ValidationRule[] = [
  {
    validate: isNonEmptyString,
    errorMessage: PageText.Contact.input.appPhoneNumber.errorMessages.empty,
  },
];

const rulesCustomerNumber: ValidationRule[] = [
  {
    validate: isNonEmptyString,
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
    validate: isNonEmptyString,
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
