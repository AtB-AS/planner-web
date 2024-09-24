export const commonEvents = {} as
  | { type: 'VALIDATE' }
  | {
      type: 'UPDATE_FIELD';
      field:
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
        | 'transportMode'
        | 'fromStop'
        | 'plannedDepartureTime';
      value: any;
    };
