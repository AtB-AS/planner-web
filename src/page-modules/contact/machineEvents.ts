import { TransportModeType } from '@atb-as/config-specs';
import { Line } from './server/journey-planner/validators';

export const machineEvents = {} as
  | { type: 'TOGGLE' }
  | { type: 'TAXI' }
  | { type: 'CAR' }
  | { type: 'OTHER' }
  | { type: 'VALIDATE' }
  | { type: 'SET_BANK_ACCOUNT_FOREIGN' }
  | { type: 'SET_TRANSPORT_MODE'; transportMode: TransportModeType }
  | { type: 'SET_LINE'; line: Line }
  | { type: 'SET_DEPARTURE_LOCATION'; departureLocation: Line['quays'][0] }
  | { type: 'SET_ARRIVAL_LOCATION'; arrivalLocation: Line['quays'][0] }
  | { type: 'SET_DATE'; date: string }
  | { type: 'SET_TIME'; time: string }
  | { type: 'SET_FEEDBACK'; feedback: string }
  | { type: 'SET_FIRSTNAME'; firstname: string }
  | { type: 'SET_LASTNAME'; lastname: string }
  | { type: 'SET_EMAIL'; email: string }
  | { type: 'SET_ADDRESS'; address: string }
  | { type: 'SET_POSTAL_CODE'; postalCode: string }
  | { type: 'SET_PHONENUMBER'; phonenumber: string }
  | { type: 'SET_CITY'; city: string }
  | { type: 'SET_BANK_ACCOUNT'; bankAccount: string }
  | { type: 'SET_IBAN'; IBAN: string }
  | { type: 'SET_SWIFT'; SWIFT: string };
