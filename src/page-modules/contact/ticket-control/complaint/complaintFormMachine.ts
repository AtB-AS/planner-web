import { and, assign, or, setup } from 'xstate';

export const formMachine = setup({
  types: {
    context: {} as {
      subject: string;
      feeNumber: string;
      registeredMobile: string | undefined;
      customerNumber: string | undefined;
      travelcard: string | undefined;
      feedback: string;
      firstname: string;
      lastname: string;
      address: string;
      postalCode: string;
      city: string;
      email: string;
      phonenumber: string;
      bankAccount: string;
      ticketStorageMode: string | undefined;
    },
    input: {} as {
      subject: string;
    },
  },

  guards: {
    isFeedNumberEmpty: ({ context }) => context.feeNumber.length === 0,
    isTicketStorageModeUndefined: ({ context }) => !context.ticketStorageMode,
    isRegisteredMobileUndefined: ({ context }) => {
      return !context.registeredMobile && context.ticketStorageMode === 'App';
    },
    isCustomerNumberUndefined: ({ context }) => {
      return !context.customerNumber && context.ticketStorageMode === 'App';
    },
    isTravelcardUndefined: ({ context }) => {
      return !context.travelcard && context.ticketStorageMode === 'Travelcard';
    },
    isFeedbackEmpty: ({ context }) => context.feedback.length === 0,
    isFirstnameEmpty: ({ context }) => context.firstname.length === 0,
    isLastnameEmpty: ({ context }) => context.lastname.length === 0,
    isEmailEmpty: ({ context }) => context.email.length === 0,
    isAddressEmpty: ({ context }) => context.address.length === 0,
    isPostalCodeEmpty: ({ context }) => context.postalCode.length === 0,
    isCityEmpty: ({ context }) => context.city.length === 0,
    isPhonenumberEmpty: ({ context }) => context.phonenumber.length === 0,
    isBankAccountEmpty: ({ context }) => context.bankAccount.length === 0,
  },
  actions: {},
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDMxgMIHsC2AHANgIYCWAdgC4BimATtgHTLE2zkCCUNa2YFAxIU5pKzVhy5geFANoAGALqJQuTLGLlimUkpAAPRAEYAnAHYANCACeiAKxGDAJnoBmACzP7JgBwA2L668vAF8gi1QMHAISCmo6elgwAGMtCHFuXnI+CGJYQQkRFnYhSQy5RSQQFTUNLR19BC8HHxcHLwNGhxNnNqNXC2sEOx8nf27hmxM-G1cQsLQsPCIyKloGBOTSVOKpTLy0AGUklLSSmQUdKvVNbQr6g1dZWXofB59TB5s7bv7bZxf6L6mBxGBwOZwGEyzEDhBZRZaxBiQK6kKB8fYAUQAKgB9Sjo9HYgByAFUALIAIXRACUyhdVFdardfk9jCC3CYTA5ZHYvD8EH5XPR7rIfLI-gYPEZplCYZEljFVvQkRoUWisdjMQBJdAAaXV+0xAHkqWwAOIE0mGgAi6NpFUuNRuoHqARM9FMPmG90mjxsfJsXjdNmGrhMRiMoucYpmoWh8zl0RWcWVZFRGJxVPRps1Bup6Kt2Mt5M1ABlbed7fTHXVbLIDADPa5jG8TKG6+YrIhXEYnkZRsGo56DAYfM4ZfHFomEUrsiq0+r0MSDYbSdSiWTKTSK8oq9ca4M688XrJek0A64fAY+R5Ba8wWfgcZIbHZZP4YqU6r0xqTQA1dElugbBUlado7tUe5MoM4IuH2F6mHWLx2HywJuo0bSyF44Ygp0HLjhEb4Ksms6pmqOJ4vm5JsLqYGVLujLOrYDzupMorGAYsgOI4HYDFy9YON2fY2G4nzOAG+GwvKSaIiRX7qpQmpUgahJsKutEOpBjHQW6I5eI8UpNC8RjOP6rL0JMAZccMrQnhJCbvsRyLzjiJZsMpqnluU4EMk6ei-EY9CYUJXQjq4rjAqZYpCoGLYRvYI52YR0kzk5ZHYmwVpWpm+z7Op9G+fU0yCl4zhcgETRgnW-qPM0opSq24LTA4NiJXCREyal34AAqGgabAlti6DWp5dIQQxfmDM19BtM1rQCUFfx8t2HGBeCrg2CKl4hS1L4Tm1yWfs5g2apiACaeVjQVtijoFHrhsGI5cj4S1tM49Drc4pUmI8ekxnMBH7dOh1peipJsKWF0+funxus4JgbRK302PcDhLSYI7TfDXKfdMbhGK1UlA7JR1dQAEoahLoiSpIUtSkPVlByM2IF8HDoGNgCfcS3DE8qGyGG30isGO3-ZJU4fsTaVUYSOrpegQ3EoSmL05pE3I7DvQPRK63DDxXYc296NYcGsjwS8BPi45c5ZDkexgAUYjbKU250Zd+7DhzAKPCKoI+MjgR8hKnTun4rZdCeow+BbDkddb2S5MUhwbFsEg7Cr413N6Xs1b7-u8p2CCOPz5ntOjwn8yK+O7QDhMS51xLkqSJ3p1dCCgnrCBuG4Je9GFmGinYf1xjXlux6R+wN03ysGF5rtQ1B7eB10bro-Y4V2O0AZR9XYsxyl1sT43zcOLPGkZ4gi8FxCEb0FxIJC+8-PPqL9ntfv4+T83zin-l+6XwMI4wy32MPzLwW9wTRzfsDQ+U9pCuB-m7BenRA5gMFKvAwyMowTFbA4SBB1JYwObjYBB88tL-0QOCdoPcHjGSwu4KUeCib1yPsrHwJCGZkOQQXASvge4cWFO0UqjC64H0-srEw7DVb1HIYXP4b0uJYQEnYZqQthFWw-iw6QXhJHnzblw3ieknCr0Qnpbiaix5fjEdIIwOjW4yLhhtah3hvBNGCDvV++DmGwI4rYv++iuzdCMSA76fZ0HmPfpYzRw5fFII7q8Zoxi-jAm5N9Mc7ikpMNEVEk+o1SETRkRxUMwDAxI1CZxNxL8MkiI0d47+uSOH5P8W3CETwja9FbJhcpz9h67ygQQqx9wYlaQ9k4DaOczztHzgAjBboFEcm5GU1o4TYAAFcABG2B1DW2yoaEs-4W7u1MP6Hw31pr0JCmxLiyz1mbPINbSg-VNTEkzAcqCjg2guEcJ8J+EYTx9ALh8sZdZgT2DEk0KusZSCYAgHAHQr5AarHqVIww4I+QAFpmjeyxdilG4SmCFBODsJFuj7jrXep0Ec-NgSjjcIHUqXh3p+FDkOWayyjibEJRkYlrcRnZx9hMgOBcN5vWMB4UU3IejdPhbXdRKJuXuzDHyVsaD2iigFtyU229KkItlVARgaBCQrOwGssANB5WMylO6PmrFKWgmvHfahiMLxiq1T0jxmTUz6rAIa41pr6AADdCD4GIBAc1WkuiCk+KGME31Ojdj9AXT6xc77hROXDVsDD0k6osXq8IPqTU0CVDQGgtAw0TReG9EECEbWijtYm9kPc4aksvBgkWbqqm6q9fmv1pqS2FskLgcglhKAGqNQWst9Q3j1ird9GtnFUaJvcMzO+3QwpwwvCVcJh16AaESAAazAOQfY5BaCCDAKSaFYAJ22EtTO-mQ5a0LoAReQUCiQR0N6ObLNMqc07uIPuw9x7T0wAvTCgNQaQ3XoQN4J4gZjZRkDPGkyV9Pj1jaU2XomERyuulaPCJerd0HqPSemgZ7QNgCLX2qDFarXVoffOwOyjgE9gWc6v2bbcN723YRwDJGyOXso7QegKzNhgCYKQSAmJ-1EaA1wfjMLqP2Fo7O+jdaAFdAZXfTCwJ3BNHhlu4mf6APEeA+egTvahMiZheJyAVIwBQByOQU1kAL1rOIPgK9lZEFaSncp+9l5H1Lxvug+CAQ2hfu1T+-DRmZN8ZA+Z4tlnRM2YgOgFZrAcCmu7WarzeTJ1KbvXOtThgTkBWMe0YyHJ2hD0430pyMXeOmfI4J-teAh2YlI-6sA+BEiEBoKG3LDT8vTutapp9hgwHLuMFxE8uM-ZpMi3h7d4QIBrMIPuqDdhmaFbGyhHshsQFcQwR0Cp7bs3RZW2t-d4Hg0De8kNxAnI0L9zNh8dGe2lNabcPcKUekpV7Si8ttAq31t7pa9R9wfmivjc7mKNDoq-gZu7KGAz9XLug5a0qNrw7gdXb3YpkbdGAsMcTcOAKK7uwdP8Pp79S3DP4tYKQQgPBNu3tG8T4rej0Yl2NhCIyvgFtncB-T0Q5Amc8Bu5BwbyLoOtABFhXwOsOY9ivNwsS5OKsvHhjSqui2uMi8KOLijFmcv3ZlzRnbHOYdgnDD3Lpl5Aindq54ucjBRdG8xwOodDsxfM882b3RvnLe2ut66ZjpsITCXmjhgHdP6tEEZ371n232ch8DvcTTpcM2fE9CKVHruE++4l4G27UGnvumvuhUqmrnpXzBMzI2zj2l1jcPnz1hePcm4h5W1PgW6+TGKWA4wHNgzNTbyiegHe-ee+xyWQgieWfS8DwV3vJOAFyJ54r3oHgME1dj-r+rhAIAQC4LAeAS-W5bah7t7hAYV7sRSXfrC-2R4H9d0fk-cBYCS7u3PB7svCdWxm1Jh-AUITkptHc6wYY8Jac39PUP9T9v8u8L99wLdV9OcKUG8KswoRwg4Y9X86t39j9ECZ9B1LA2BiCv8Cdr8rcUI9J5EKsJgME9NAxx89UqhyAg0sAFMUCLUU8ic09E1hIsDe5-B3B2w98CCXdPUOCuCBMS8pcA9W4uhK1r4M0FdmoO4kkGCEJHhWguhgw2D6BZD8BuDjdEtTc-9zdIdg8+8Bg-gbpV5JgHg3BWgUdYDCCZDVBODTCEs+0scyCupvC5CeClDUCV8BC7CKF4Z+Jh9V1wQKUnd99PCJ9Eh1ABgwi+CaDBCBgmwTk7dXhQwOYX9elpDUj0if8y9k0LwOIDDPR4YjAlpmopsexhJRxHcDAjC0ih1wdeCfMbD0CYdwpLV0E+cwphiuiKiTcAih10B0jqDbC18AkSpmMJQRQxIXEjDJASB8Bk9siojO4h9G12jwp1oONkiyi9Vtj3NKi+iJp0YnB2J1pcIxRRQpkKFjINdKs-BPo9IkipCPUJ9rj8BejMj+ie9IiljO5TAytpt50wpwwIQtjsAdjSCh10QUT3MFjBiloRRZkKtWIMNvB-jSjAT2CAALLQXgMdU1PYxYznEqJwBRHmCMTeLoIw3ASkiTUgGkwtBQ3-M+ZQyHIOanToN4LiGHewWEwITkaYeGeGSQ0k6pCfTkqknk31ftCw7vfYqE35YpWKO-AMXXIXOPV3VU7k3ktEywLqLk6kjU7EyEznQpe-QMDiKUOsD2IwtbUgPdNgRIZIETcgOknEq+KUEQ14v4KNXwL0wgH0v0gMigW4sE+45ibsS8GhdwMMQMFCU2BgwIWo8YDYmMuM-0zAQM0EqwwPAYx063TCA7GU0MPwTCc4gE5UvVb0300s8s6Yr3SwckWMzshMoMu44bHUjAiEWIx3DkQeOGa5DZLZVMKDe4MSaaZGF4PI9Y-5AYHsQKRk0wLuJlTojw5KVZf0qgkcwwZgvlayP2SZY5U5E8HfSYQcfwEIEIIAA */
  id: 'feeComplaintForm',
  initial: 'firstAgreement',
  context: ({ input }) => ({
    subject: input.subject,
    feeNumber: '',
    registeredMobile: undefined,
    customerNumber: undefined,
    travelcard: undefined,
    feedback: '',
    firstname: '',
    lastname: '',
    address: '',
    postalCode: '',
    city: '',
    email: '',
    phonenumber: '',
    bankAccount: '',
    ticketStorageMode: undefined,
  }),
  states: {
    firstAgreement: {
      on: {
        agreeFirstAgreement: 'secondAgreement',
      },
      tags: ['firstAgreement'],
    },

    secondAgreement: {
      on: {
        disagreeFirstAgreement: 'firstAgreement',
        agreeSecondAgreement: 'editing',
      },
      tags: ['firstAgreement', 'secondAgreement'],
    },

    editing: {
      on: {
        SET_FEE_NUMBER: {
          actions: assign({
            feeNumber: ({ event }) => event.feeNumber,
          }),
        },
        SET_TICKET_STORAGE_MODE: {
          actions: assign({
            ticketStorageMode: ({ event }) => event.ticketStorageMode,
          }),
        },
        SET_REGISTERED_MOBILE: {
          actions: assign({
            registeredMobile: ({ event }) => event.registeredMobile,
          }),
        },
        SET_CUSTOMER_NUMBER: {
          actions: assign({
            customerNumber: ({ event }) => event.customerNumber,
          }),
        },
        SET_TRAVELCARD: {
          actions: assign({
            travelcard: ({ event }) => event.travelcard,
          }),
        },
        SET_FEEDBACK: {
          actions: assign({
            feedback: ({ event }) => event.feedback,
          }),
        },
        SET_FIRSTNAME: {
          actions: assign({
            firstname: ({ event }) => event.firstname,
          }),
        },
        SET_LASTNAME: {
          actions: assign({
            lastname: ({ event }) => event.lastname,
          }),
        },
        SET_ADDRESS: {
          actions: assign({
            address: ({ event }) => event.address,
          }),
        },
        SET_POSTAL_CODE: {
          actions: assign({
            postalCode: ({ event }) => event.postalCode,
          }),
        },
        SET_CITY: {
          actions: assign({
            city: ({ event }) => event.city,
          }),
        },
        SET_EMAIL: {
          actions: assign({
            email: ({ event }) => event.email,
          }),
        },
        SET_PHONENUMMBER: {
          actions: assign({
            phonenumber: ({ event }) => event.phonenumber,
          }),
        },
        SET_BANK_ACCOUNT: {
          actions: assign({
            bankAccount: ({ event }) => event.bankAccount,
          }),
        },

        disagreeFirstAgreement: {
          target: 'firstAgreement',
        },
        disagreeSecondAgreement: {
          target: 'secondAgreement',
        },
        SUBMIT: [
          {
            guard: 'isFeedNumberEmpty',
            target: 'editing.error.emptyFeeNumber',
          },
          {
            guard: 'isTicketStorageModeUndefined',
            target: 'editing.error.undefinedTicketStorageMode',
          },
          {
            guard: 'isRegisteredMobileUndefined',
            target: 'editing.error.undefinedRegisteredMobile',
          },
          {
            guard: 'isCustomerNumberUndefined',
            target: 'editing.error.undefinedCustomerNumber',
          },
          {
            guard: 'isTravelcardUndefined',
            target: 'editing.error.undefinedTravelcard',
          },
          {
            guard: 'isFeedbackEmpty',
            target: 'editing.error.emptyFeedback',
          },
          {
            guard: 'isFirstnameEmpty',
            target: 'editing.error.emptyFirstname',
          },
          {
            guard: 'isLastnameEmpty',
            target: 'editing.error.emptyLastname',
          },
          {
            guard: 'isAddressEmpty',
            target: 'editing.error.emptyAddress',
          },
          {
            guard: 'isPostalCodeEmpty',
            target: 'editing.error.emptyPostalCode',
          },
          {
            guard: 'isCityEmpty',
            target: 'editing.error.emptyCity',
          },
          {
            guard: 'isEmailEmpty',
            target: 'editing.error.emptyEmail',
          },
          {
            guard: 'isPhonenumberEmpty',
            target: 'editing.error.emptyPhonenumber',
          },
          {
            guard: 'isBankAccountEmpty',
            target: 'editing.error.emptyBankAccount',
          },
          {
            target: 'submitting',
          },
        ],
      },
      type: 'parallel',

      states: {
        error: {
          initial: 'valid',
          states: {
            valid: {},
            emptyFeeNumber: {
              tags: ['emptyFeeNumber'],
            },
            undefinedTicketStorageMode: {
              tags: ['undefinedTicketStorageMode'],
            },
            undefinedRegisteredMobile: {
              tags: ['undefinedRegisteredMobile'],
            },
            undefinedCustomerNumber: {
              tags: ['undefinedCustomerNumber'],
            },
            undefinedTravelcard: {
              tags: ['undefinedTravelcard'],
            },
            emptyFeedback: {
              tags: ['emptyFeedback'],
            },
            emptyFirstname: {
              tags: ['emptyFirstname'],
            },
            emptyLastname: {
              tags: ['emptyLastname'],
            },
            emptyAddress: {
              tags: ['emptyAddress'],
            },
            emptyPostalCode: {
              tags: ['emptyPostalCode'],
            },
            emptyCity: {
              tags: ['emptyCity'],
            },
            emptyEmail: {
              tags: ['emptyEmail'],
            },
            emptyPhonenumber: {
              tags: ['emptyPhonenumber'],
            },
            emptyBankAccount: {
              tags: ['emptyBankAccount'],
            },
          },
        },
      },

      tags: ['firstAgrreement', 'secondAgreement', 'editing'],
    },
    submitting: {
      on: {
        RESOLVE: 'success',
        FALIURE: {
          target: 'editing',
        },
      },
      tags: ['submitting'],
    },
    success: {
      type: 'final',
    },
  },
});
