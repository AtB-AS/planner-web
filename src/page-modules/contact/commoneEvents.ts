import { TransportModeType } from './types';
import { Line } from '.';

export const commonEvents = {} as
  | { type: 'VALIDATE' }
  | {
      type: 'ON_INPUT_CHANGE';
      inputName:
        | 'address'
        | 'attachments'
        | 'bankAccountNumber'
        | 'city'
        | 'date'
        | 'email'
        | 'firstName'
        | 'feedback'
        | 'IBAN'
        | 'lastName'
        | 'phoneNumber'
        | 'postalCode'
        | 'SWIFT'
        | 'toStop'
        | 'fromStop'
        | 'plannedDepartureTime';
      value: any;
    }
  | {
      type: 'ON_TRANSPORTMODE_CHANGE';
      value: TransportModeType;
    }
  | {
      type: 'ON_LINE_CHANGE';
      value: Line | undefined;
    };
