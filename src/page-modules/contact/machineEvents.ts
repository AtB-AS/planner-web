import { TransportModeType } from '@atb-as/config-specs';
import { Line } from './server/journey-planner/validators';
import { TranslatedString } from '@atb/translations';

export type ReasonForTransportFailure = { id: string; name: TranslatedString };

export const machineEvents = {} as
  | { type: 'TOGGLE' }
  | { type: 'TAXI' }
  | { type: 'CAR' }
  | { type: 'OTHER' }
  | { type: 'VALIDATE' }
  | { type: 'SET_BANK_ACCOUNT_FOREIGN' }
  | { type: 'SET_STATE_SUBMITTED'; stateSubmitted: string | undefined }
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
        | 'firstName'
        | 'lastName'
        | 'email'
        | 'address'
        | 'postalCode'
        | 'phoneNumber'
        | 'city'
        | 'bankAccountNumber'
        | 'IBAN'
        | 'SWIFT';
      value:
        | string
        | number
        | Line
        | Line['quays'][0]
        | TransportModeType
        | ReasonForTransportFailure;
    };
