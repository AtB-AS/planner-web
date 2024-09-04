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
  /** @xstate-layout N4IgpgJg5mDOIC5QDMxgMIHsC2AHANgIYCWAdgC4BimATtgHTLE2zkCCUNa2YFAxIU5pKzVhy5geFANoAGALqJQuTLGLlimUkpAAPRACYAjEfqyDAZgAsFgOwBWADQgAnoiMWDAXy-PUGHAISCmo6elgwAGMtCHFuXnI+CGJYQQkRFnYhSQS5RSQQFTUNLR19BGNTc2s7J1dEAA5Tex8-NCw8IjIqWgYI6NJY7KlyemIIfDAAZSiYuJz+NLQZgaGJEbydIvVNbQLyhvsreitbBysDK3sANiuG22c3BCMbelsATguL6+uDI4NZC1fCB-B0gt1Qn1ZoN5iNGL0kikltNoWt4jIFFtVDtSvtGkcTmd-ldbvZ7o9EO8LPQDJ9LgYfn8LoDWiD2oEuiFeuFUbCEvCwhpIgBrMDkKbkWiCMAAWUwEDAYwmYAAKsQRWKJbQwDA5Qq+BFJpFRoRcLhNgVtiU9qByi9bLIaeZZA1TlTbLcKQgLPZ3vRrrYrEZA8z3rYLO9WaCOcEemF+nNhvzkNyhaLxZKaNK9YrxpM1RqM9rdfKwAawEbRuQswA3CuRQg0CAW5TY61ldynR0AgGuj52T31Z6fMyyBxj84WMcMqPszqxyE81Z8igChhpzWZ7Ol+im3Dlyv0auEOv4BtNluFNu7DvPWz3E7vBrvX39j1WL1GBoNE6XYNWUNw2-WcAnnCFuQTGEk1XFNBXVdMtSzEsFSPWt60bCADyiE0zUvK0bzxO8HysJ8XzDd1ByeSwf3eP8QwBMMLGA1lSFLeACmjMCuToLFigI21EAAWmuL1BKMa5mgcQM6QsDwbm8YFOPBbiGCYTIV3IXicRtPREAuL0HzJCxjJM0zjJAsFOTjKFl2gzTLWvXEBIQMl7DeH0fRIm47geIdBMDMwpPsKdwwZAxwwsmNwPjXk7KVSYVkTdYEi09tCOuYz3OCo4X1Jckh3eP07CCwqyQcCxrkirjrKXJL0VGWDsFS-jdOeIx7FMP4A1sAxaQHD8hw8X8vk8D0JNkL8rCq5SasgtEFga1N4M3KVkLAZqnNakxCppG4zl6iiBqeIxZEdWjmW-Kx7lo2QLGmqzFzmjS1yPZaiyQ2UdzzVU3sQnVPoVDadLtS5bF27qDv6r0ATOuiAIYoCGnuhcINi5KYKWwtEO3FC9yB28jDDAwTm62RyKhoc-3oc7-0ApikcUucZsetH6pejd3pxxVj1Pc8IHxwjxPsNzgxdaw30o9wR3sMcZaJGxp0qnwvCAA */
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
