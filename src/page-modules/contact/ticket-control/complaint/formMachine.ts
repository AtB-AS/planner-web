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
  id: 'feeComplaintForm',
  initial: 'firstAgreement',
  context: {
    title: '',
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
});
