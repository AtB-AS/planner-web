import { TransportModeType } from '@atb-as/config-specs';
import { Line } from './server/journey-planner/validators';
import { TranslatedString } from '@atb/translations';

export const machineEvents = {} as
  | { type: 'TOGGLE' }
  | { type: 'TAXI' }
  | { type: 'CAR' }
  | { type: 'OTHER' }
  | { type: 'VALIDATE' }
  | { type: 'SET_BANK_ACCOUNT_FOREIGN' }
  | { type: 'SET_TRANSPORT_MODE'; transportMode: TransportModeType }
  | { type: 'SET_LINE'; line: Line }
  | { type: 'SET_FROM_STOP'; fromStop: Line['quays'][0] }
  | { type: 'SET_TO_STOP'; toStop: Line['quays'][0] }
  | {
      type: 'SET_REASON_FOR_TRANSPORT_FAILIURE';
      reasonForTransportFailure: { id: string; name: TranslatedString };
    }
  | {
      type: 'SET_KILOMETRES_DRIVEN';
      kilometersDriven: string;
    }
  | { type: 'SET_DATE'; date: string }
  | { type: 'SET_PLANNED_DEPARTURE_TIME'; plannedDepartureTime: string }
  | { type: 'SET_FEEDBACK'; feedback: string }
  | { type: 'SET_FIRSTNAME'; firstName: string }
  | { type: 'SET_LASTNAME'; lastName: string }
  | { type: 'SET_EMAIL'; email: string }
  | { type: 'SET_ADDRESS'; address: string }
  | { type: 'SET_POSTAL_CODE'; postalCode: string }
  | { type: 'SET_PHONENUMBER'; phoneNumber: string }
  | { type: 'SET_CITY'; city: string }
  | { type: 'SET_BANK_ACCOUNT_NUMBER'; bankAccountNumber: string }
  | { type: 'SET_IBAN'; IBAN: string }
  | { type: 'SET_SWIFT'; SWIFT: string };
