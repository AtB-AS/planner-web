import { assign, setup } from 'xstate';

export const formMachine = setup({
  types: {
    context: {} as {
      feeNumber: string;
      invoiceNumber: string;
      firstname: string;
      lastname: string;
      email: string;
    },
  },

  guards: {
    isFeedNumberEmpty: ({ context }) => context.feeNumber.length === 0,
    isInvoiceNumberEmpty: ({ context }) => context.invoiceNumber.length === 0,
    isFirstnameEmpty: ({ context }) => context.firstname.length === 0,
    isLastnameEmpty: ({ context }) => context.lastname.length === 0,
    isEmailEmpty: ({ context }) => context.email.length === 0,
  },
  actions: {},
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDMxgMIHsC2AHANgIYCWAdgC4BimATtgHTLE2zkCCUNa2YFAxIU5pKzVhy5geFANoAGALqJQuTLGLlimUkpAAPRAEYAnAHYANCACeiAKxGDAJnoBmACzP7JgBwA2L668vAF8gi1QMHAISCmo6elgwAGMtCHFuXnI+CGJYQQkRFnYhSQy5RSQQFTUNLR19BC8HHxcHLwNGhxNnNqNXC2sEOx8nf27hmxM-G1cQsLQsPCIyKloGBOTSVOKpTLy0AGUklLSSmQUdKvVNbQr6g1dZWXofB59TB5s7bv7bZxf6L6mBxGBwOZwGEyzEDhBZRZaxBiQK6kKB8fYAUQAKgB9Sjo9HYgByAFUALIAIXRACUyhdVFdardfk9jCC3CYTA5ZHYvD8EH5XPR7rIfLI-gYPEZplCYZEljFVvQkRoUWisdjMQBJdAAaXV+0xAHkqWwAOIE0mGgAi6NpFUuNRuoHqARM9FMPmG90mjxsfJsXjdNmGrhMRiMoucYpmoWh8zl0RWcWVZFRGJxVPRps1Bup6Kt2Mt5M1ABlbed7fTHXVbLIDADPa5jG8TKG6+YrIhXEYnkZRsGo56DAYfM4ZfHFomEUrsiq0+r0MSDYbSdSiWTKTSK8oq9ca4M688XrJek0A64fAY+R5Ba8wWfgcZIbHZZP4YqU6r0xqTQA1dElugbBUlado7tUe5MoM4IuH2F6mHWLx2HywJuo0bSyF44Ygp0HLjhEb4Ksms6pmqOJ4vm5JsLqYGVLujLOrYDzupMorGAYsgOI4HYDFy9YON2fY2G4nzOAG+GwvKSaIiRX7qpQmpUgahJsKutEOpBjHQW6I5eI8UpNC8RjOP6rL0JMAZccMrQnhJCbvsRyLzjiJZsMpqnluU4EMk6ei-EY9CYUJXQjq4rjAqZYpCoGLYRvYI52YR0kzk5ZHYmwVpWpm+z7Op9G+fU0yCl4zhcgETRgnW-qPM0opSq24LTA4NiJXCREyal34AAqGgabAlti6DWp5dIQQxfmDM19BtM1rQCUFfx8t2HGBeCrg2CKl4hS1L4Tm1yWfs5g2apiACaeVjQVtijoFHrhsGI5cj4S1tM49Drc4pUmI8ekxnMBH7dOh1peipJsKWF0+funxus4JgbRK302PcDhLSYI7TfDXKfdMbhGK1UlA7JR1dQAEoahLoiSpIUtSkPVlByM2IF8HDoGNgCfcS3DE8qGyGG30isGO3-ZJU4fsTaVUYSOrpegQ3EoSmL05pE3I7DvQPRK63DDxXYc296NYcGsjwS8BPi45c5ZDkexgAUYjbKU250Zd+7DhzAKPCKoI+MjgR8hKnTun4rZdCeow+BbDkddb2S5MUhwbFsEg7Cr413N6Xs1b7-u8p2CCOPz5ntOjwn8yK+O7QDhMS51xLkqSJ3p1dCCgnrCBuG4Je9GFmGinYf1xjXlux6R+wN03ysGF5rtQ1B7eB10bro-Y4V2O0AZR9XYsxyl1sT43zcOLPGkZ4gi8FxCEb0FxIJC+8-PPqL9ntfv4+T83zin-l+6XwMI4wy32MPzLwW9wTRzfsDQ+U9pCuB-m7BenRA5gMFKvAwyMowTFbA4SBB1JYwObjYBB88tL-0QOCdoPcHjGSwu4KUeCib1yPsrHwJCGZkOQQXASvge4cWFO0UqjC64H0-srEw7DVb1HIYXP4b0uJYQEnYZqQthFWw-iw6QXhJHnzblw3ieknCr0Qnpbiaix5fjEdIIwOjW4yLhhtah3hvBNGCDvV++DmGwI4rYv++iuzdCMSA76fZ0HmPfpYzRw5fFII7q8Zoxi-jAm5N9Mc7ikpMNEVEk+o1SETRkRxUMwDAxI1CZxNxL8MkiI0d47+uSOH5P8W3CETwja9FbJhcpz9h67ygQQqx9wYlaQ9k4DaOczztHzgAjBboFEcm5GU1o4TYAAFcABG2B1DW2yoaEs-4W7u1MP6Hw31pr0JCmxLiyz1mbPINbSg-VNTEkzAcqCjg2guEcJ8J+EYTx9ALh8sZdZgT2DEk0KusZSCYAgHAHQr5AarHqVIww4I+QAFpmjeyxdilG4SmCFBODsJFuj7jrXep0Ec-NgSjjcIHUqXh3p+FDkOWayyjibEJRkYlrcRnZx9hMgOBcN5vWMB4UU3IejdPhbXdRKJuXuzDHyVsaD2iigFtyU229KkItlVARgaBCQrOwGssANB5WMylO6PmrFKWgmvHfahiMLxiq1T0jxmTUz6rAIa41pr6AADdCD4GIBAc1WkuiCk+KGME31Ojdj9AXT6xc77hROXDVsDD0k6osXq8IPqTU0CVDQGgtAw0TReG9EECEbWijtYm9kPc4aksvBgkWbqqm6q9fmv1pqS2FskLgcglhKAGqNQWst9Q3j1ird9GtnFUaJvcMzO+3QwpwwvCVcJh16AaESAAazAOQfY5BaCCDAKSaFYAJ22EtTO-mQ5a0LoAReQUCiQR0N6ObLNMqc07uIPuw9x7T0wAvTCgNQaQ3XoQN4J4gZjZRkDPGkyV9Pj1jaU2XomERyuulaPCJerd0HqPSemgZ7QNgCLX2qDFarXVoffOwOyjgE9gWc6v2bbcN723YRwDJGyOXso7QegKzNhgCYKQSAmJ-1EaA1wfjMLqP2Fo7O+jdaAFdAZXfTCwJ3BNHhlu4mf6APEeA+egTvahMiZheJyAVIwBQByOQU1kAL1rOIPgK9lZEFaSncp+9l5H1Lxvug+CAQ2hfu1T+-DRmZN8ZA+Z4tlnRM2YgOgFZrAcCmu7WarzeTJ1KbvXOtThgTkBWMe0YyHJ2hD0430pyMXeOmfI4J-teAh2YlI-6sA+BEiEBoKG3LDT8vTutapp9hgwHLuMFxE8uM-ZpMi3h7d4QIBrMIPuqDdhmaFbGyhHshsQFcQwR0Cp7bs3RZW2t-d4Hg0De8kNxAnI0L9zNh8dGe2lNabcPcKUekpV7Si8ttAq31t7pa9R9wfmivjc7mKNDoq-gZu7KGAz9XLug5a0qNrw7gdXb3YpkbdGAsMcTcOAKK7uwdP8Pp79S3DP4tYKQQgPBNu3tG8T4rej0Yl2NhCIyvgFtncB-T0Q5Amc8Bu5BwbyLoOtABFhXwOsOY9ivNwsS5OKsvHhjSqui2uMi8KOLijFmcv3ZlzRnbHOYdgnDD3Lpl5Aindq54ucjBRdG8xwOodDsxfM882b3RvnLe2ut66ZjpsITCXmjhgHdP6tEEZ371n232ch8DvcTTpcM2fE9CKVHruE++4l4G27UGnvumvuhUqmrnpXzBMzI2zj2l1jcPnz1hePcm4h5W1PgW6+TGKWA4wHNgzNTbyiegHe-ee+xyWQgieWfS8DwV3vJOAFyJ54r3oHgME1dj-r+rhAIAQC4LAeAS-W5bah7t7hAYV7sRSXfrC-2R4H9d0fk-cBYCS7u3PB7svCdWxm1Jh-AUITkptHc6wYY8Jac39PUP9T9v8u8L99wLdV9OcKUG8KswoRwg4Y9X86t39j9ECZ9B1LA2BiCv8Cdr8rcUI9J5EKsJgME9NAxx89UqhyAg0sAFMUCLUU8ic09E1hIsDe5-B3B2w98CCXdPUOCuCBMS8pcA9W4uhK1r4M0FdmoO4kkGCEJHhWguhgw2D6BZD8BuDjdEtTc-9zdIdg8+8Bg-gbpV5JgHg3BWgUdYDCCZDVBODTCEs+0scyCupvC5CeClDUCV8BC7CKF4Z+Jh9V1wQKUnd99PCJ9Eh1ABgwi+CaDBCBgmwTk7dXhQwOYX9elpDUj0if8y9k0LwOIDDPR4YjAlpmopsexhJRxHcDAjC0ih1wdeCfMbD0CYdwpLV0E+cwphiuiKiTcAih10B0jqDbC18AkSpmMJQRQxIXEjDJASB8Bk9siojO4h9G12jwp1oONkiyi9Vtj3NKi+iJp0YnB2J1pcIxRRQpkKFjINdKs-BPo9IkipCPUJ9rj8BejMj+ie9IiljO5TAytpt50wpwwIQtjsAdjSCh10QUT3MFjBiloRRZkKtWIMNvB-jSjAT2CAALLQXgMdU1PYxYznEqJwBRHmCMTeLoIw3ASkiTUgGkwtBQ3-M+ZQyHIOanToN4LiGHewWEwITkaYeGeGSQ0k6pCfTkqknk31ftCw7vfYqE35YpWKO-AMXXIXOPV3VU7k3ktEywLqLk6kjU7EyEznQpe-QMDiKUOsD2IwtbUgPdNgRIZIETcgOknEq+KUEQ14v4KNXwL0wgH0v0gMigW4sE+45ibsS8GhdwMMQMFCU2BgwIWo8YDYmMuM-0zAQM0EqwwPAYx063TCA7GU0MPwTCc4gE5UvVb0300s8s6Yr3SwckWMzshMoMu44bHUjAiEWIx3DkQeOGa5DZLZVMKDe4MSaaZGF4PI9Y-5AYHsQKRk0wLuJlTojw5KVZf0qgkcwwZgvlayP2SZY5U5E8HfSYQcfwEIEIIAA */
  id: 'postponePaymentForm',
  initial: 'editing',
  context: {
    feeNumber: '',
    invoiceNumber: '',
    firstname: '',
    lastname: '',
    email: '',
  },
  states: {
    editing: {
      on: {
        SET_FEE_NUMBER: {
          actions: assign({
            feeNumber: ({ event }) => event.feeNumber,
          }),
        },
        SET_INVOICE_NUMBER: {
          actions: assign({
            invoiceNumber: ({ event }) => event.invoiceNumber,
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
        SET_EMAIL: {
          actions: assign({
            email: ({ event }) => event.email,
          }),
        },

        SUBMIT: [
          {
            guard: 'isFeedNumberEmpty',
            target: 'editing.feeNumber.error.emptyFeeNumber',
          },
          {
            guard: 'isInvoiceNumberEmpty',
            target: 'editing.invoiceNumber.error.emptyInvoiceNumber',
          },
          {
            guard: 'isFirstnameEmpty',
            target: 'editing.firstname.error.emptyFirstname',
          },
          {
            guard: 'isLastnameEmpty',
            target: 'editing.lastname.error.emptyLastname',
          },

          {
            guard: 'isEmailEmpty',
            target: 'editing.email.error.emptyEmail',
          },

          {
            target: 'submitting',
          },
        ],
      },
      type: 'parallel',

      states: {
        feeNumber: {
          initial: 'valid',
          states: {
            valid: {},
            error: {
              initial: 'emptyFeeNumber',
              states: {
                emptyFeeNumber: {},
              },
            },
          },
        },
        invoiceNumber: {
          initial: 'valid',
          states: {
            valid: {},
            error: {
              initial: 'emptyInvoiceNumber',
              states: {
                emptyInvoiceNumber: {},
              },
            },
          },
        },
        firstname: {
          initial: 'valid',
          states: {
            valid: {},
            error: {
              initial: 'emptyFirstname',
              states: {
                emptyFirstname: {},
              },
            },
          },
        },
        lastname: {
          initial: 'valid',
          states: {
            valid: {},
            error: {
              initial: 'emptyLastname',
              states: {
                emptyLastname: {},
              },
            },
          },
        },
        email: {
          initial: 'valid',
          states: {
            valid: {},
            error: {
              initial: 'emptyEmail',
              states: {
                emptyEmail: {},
              },
            },
          },
        },
      },
    },
    submitting: {
      on: {
        RESOLVE: 'success',
        FALIURE: {
          target: 'editing',
        },
      },
    },
    success: {
      type: 'final',
    },
  },
});
