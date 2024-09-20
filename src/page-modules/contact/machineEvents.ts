import { TransportModeType } from '@atb-as/config-specs';
import { Line } from './server/journey-planner/validators';
import { TranslatedString } from '@atb/translations';

export type ReasonForTransportFailure = { id: string; name: TranslatedString };

export const machineEvents = {} as
  | { type: 'VALIDATE' }
  | { type: 'SET_BANK_ACCOUNT_FOREIGN' }
  | {
      type: 'TOGGLE';
      field:
        | 'isAppTicketStorageMode'
        | 'agreesFirstAgreement'
        | 'agreesSecondAgreement'
        | 'hasInternationalBankAccount';
    }
  | {
      type: 'UPDATE_FIELD';
      field:
        | 'transportMode'
        | 'line'
        | 'fromStop'
        | 'toStop'
        | 'reasonForTransportFailure'
        | 'reasonForTransportFailure'
        | 'kilometersDriven'
        | 'date'
        | 'plannedDepartureTime'
        | 'feedback'
        | 'attachments'
        | 'firstName'
        | 'lastName'
        | 'email'
        | 'address'
        | 'postalCode'
        | 'phoneNumber'
        | 'city'
        | 'bankAccountNumber'
        | 'IBAN'
        | 'SWIFT'
        | 'feeNumber'
        | 'appPhoneNumber'
        | 'customerNumber'
        | 'travelCardNumber'
        | 'isAppTicketStorageMode';
      value:
        | string
        | number
        | Line
        | Line['quays'][0]
        | TransportModeType
        | ReasonForTransportFailure
        | File[];
    }

  // travel-guarantee
  | { type: 'TAXI' }
  | { type: 'CAR' }
  | { type: 'OTHER' }
  | { type: 'SET_STATE_SUBMITTED'; stateSubmitted: string | undefined };
