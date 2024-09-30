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
        | 'line'
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
      inputName: 'transportMode';
      value: any;
    };
