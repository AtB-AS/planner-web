import { assign, setup } from 'xstate';

export const formMachine = setup({
  types: {
    context: {} as { title: string },
  },
  actions: {
    setTitle: assign({
      title: ({ event }) => event.title,
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SzAGzAYwC4DED2ATgLYB0sWAhgVgMQYAWeeKJAZmGAMJ5EAOqFAJYA7XISIBtAAwBdRKF7NBWQXmHyQAD0QBaAMwB2AKwkAnAA4DAFgBsNqwdOmHAJgA0IAJ6IpAX18eKOjY+MRklNR0jMxgJARgrACuwhChkrIairDKqupIWrpWAIxWJNZFehZFBlKVLkZ6Ht4IVoYkVuY2ejbmVla1RlIV-oFomGJh5FS0DEws7JAARhQYANZp0nL5WTlqGtoIOkZF5mVSLi5FRqbGRVKm7l6INgan5kavBl1SRvVSViMQEFxmk2BxuHwBCIJkQonNYvEkikNhltkoVHt8gcdEUbC4SFcjA5rp0PgYXFYmohiqZ2kSXN0GlJXi5TDZAcCQuIwVwePwhKI0nCYjyIMs1iitgp0bl9j4qQg-AEgWMuWEFhD+dDQaxBARyABBKDxMBEMCiGgUY0cHB6w3W03mrCbTIyzGgA5SBVK0bBGE8zVQwXclAYNQQI0ms0WiCCWBWk22-VYSMcaPO1HS7IYvIe3S9dqmPS2IqmX7mEoWBU6Vo2EhGGwnKxGcy9arVDmq-0avlB-2h8Opx2iEiCCDoADKmEHDvTlodU7DKSH6ZdaOzsqxiBcrZI5wMRVLUnMUmZVkezROJE69hsZecDeqRk7fp14N7Av70+Xs6dbHENCxvGC7fhGv6iGuWa7LmBQINc+I1FIPQPH0ZZXNWrL4uYlzVOYFgdHeuIviC3I9pCn6ggOP5Rn+rDcioaxgFgE5YIQVpgAAsngECxGO6AACqCIxzGsfEMBcTxNCclgJAULwvCQSAOw5nKCCHv8ZwnMYRbvN0BjVqWBjXpcDSvB8PxksRaqkGRWrBpMoErrR9FCasTEsWx4ncbx45gIJwkeWJnHeVJXYkFgBAUAAbmgGBUBAinKZueZqXcpQ1Fp1x6LpLwGTcxlXIY7w1EYlnKtJb68uR2oho54EyXRYQMW5ImecFPGyfJoV+uFkUxagcUEAlmZKW6MEHOp6VDJYWU5fpTyHIZBWmcVFkGAYVndu+1X2aQVFgTRI6NaQzXuaJ7ESbEEXRbF8XdeMnUKSNSXurBk2aTNOkNLlC04vl2GFWZJVlb6JFhIiySpABswirZfaSq6G6vRNpVlCUeLff82VGAqzanHoLg-Ccp5aYem2ghDyLQ9E8wcGKKzrOIiVjap9R6O0rR9BWZY9FzCoGATHO2DYSHmATYsbeVXaVfTErU-CAYfjVxDM0j43UoeZQNpctT3D0B42LjLYkAT-ydLYFzrc+UuvqRdPiozxDCiwlNQyrz0s1uhz1KcDKnseNjHHU83NBWUgEuZbLNmljj+MqwjefA+QVeIiPQapRx2GcFxXDcxz3Be+bVASjiloHrbHOY5MhhEWBpypXs6PURmdBS3SHrnDLVpUpxEg2jh6KebKmCU1fqttdkwvXyWwU37wlw8vy2MYQyG795K0i8I9sq2FSNnoY82RP8OkXaKb1dPyO6AyRnVIvFIvIMuLVl0dYnkvItFtldiH4rO1fkuA6aYnSX3VmpPCJALgdD0IMc8J4LiNF+vYfEd9DLVHPP8SWoNrJ-0npROqh0ZJ8TAIuGchDQGszaFAsWsCdznC7r9YkJsGh4T6L8UqRZ2Q2zBkfKqeDaqAKckdVO6505ezuMeD62lsZ6WrKVUoW9DLL0waYX+cMKICLIcA4RTVXJnTapdCh4ifh1gyp9GRP1mg1heAvE4DZA5FBcGo4+GiHKCPqv+XRAVzpeQ6sQ-yLVApgF8WAIxKVHF3jpKYAOBcnCtG7o4EgW9CY3CQv0aw1tsFbT4SfNxWjhwNRct4gx3lHphLemlKRs1voh0QILF4vQOgMmwv0Fw9hnE5NcXtAh2jCleMCT49qV0+q3SGuUialSzHSLmgqXEt9Xicz0Es769Rf6uzSOM6+2UyjnkcBcWojJjAKjJASB4BN86klHtwnB6zuTEIAEoJEhhs0RDcUp-XDtYFwezCZLMDkchadgFEPDab8CkJROgdNlo7IgmzDiWEgS8PQqCYFDFMAqM5ZQUkOGPKyVsqjrnZOhaCYhOB7YMxeVBN5s9KiIoFiip+6KFp3E1jnXWHwKiuDjr4IAA */
  id: 'selectForm',
  initial: 'start',
  context: {
    title: '',
  },
  states: {
    start: {
      on: {
        'choose.feeComplaintForm': {
          target: 'feeComplaintForm',
          actions: 'setTitle',
        },
        'choose.refundForm': {
          target: 'refundForm',
          actions: 'setTitle',
        },
        'choose.feedbackForm': {
          target: 'feedbackForm',
          actions: 'setTitle',
        },
      },
    },

    feeComplaintForm: {
      initial: 'firstAgreement',
      on: {
        'choose.refundForm': {
          target: 'refundForm',
          actions: 'setTitle',
        },
        'choose.feedbackForm': {
          target: 'feedbackForm',
          actions: 'setTitle',
        },
      },
      states: {
        firstAgreement: {
          on: {
            agreeFirstAgreement: 'secondAgreement',
          },
        },

        secondAgreement: {
          initial: 'idleSecondAgreement',
          states: {
            idleSecondAgreement: {
              on: {
                agreeSecondAgreement: 'form',
              },
            },

            form: {
              initial: 'ticketStorageMode',
              states: {
                ticketStorageMode: {
                  initial: 'idleTicketStoregeMode',
                  states: {
                    idleTicketStoregeMode: {
                      on: {
                        'select.app': {
                          target: 'app',
                        },
                        'select.travelcard': {
                          target: 'travelcard',
                        },
                      },
                    },

                    app: {
                      on: {
                        'select.travelcard': { target: 'travelcard' },
                      },
                    },

                    travelcard: {
                      on: {
                        'select.app': { target: 'app' },
                      },
                    },
                  },
                },
              },
              on: {
                disagreeSecondAgreement: 'idleSecondAgreement',
              },
            },
          },
          on: {
            disagreeFirstAgreement: 'firstAgreement',
          },
        },
      },
    },

    refundForm: {
      initial: 'idleRefundForm',
      on: {
        'choose.feeComplaintForm': {
          target: 'feeComplaintForm',
          actions: 'setTitle',
        },
        'choose.feedbackForm': {
          target: 'feedbackForm',
          actions: 'setTitle',
        },
      },
      states: {
        idleRefundForm: {},
      },
    },

    feedbackForm: {
      initial: 'idleFeedbackForm',
      on: {
        'choose.feeComplaintForm': {
          target: 'feeComplaintForm',
          actions: 'setTitle',
        },
        'choose.refundForm': {
          target: 'refundForm',
          actions: 'setTitle',
        },
      },
      states: {
        idleFeedbackForm: {},
      },
    },
  },
});
