import { setup } from 'xstate';

export const formMachine = setup({}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEMoCcxgLZgHYBcBGAOgEsIAbMAYlQzEIG0AGAXUVAAcB7WU-Ut1wcQAD0SFmJAJwAOACzzmAVmWEA7MvWzCAJgA0IAJ6IAtIRLKd0+XOYA2WbvvTCAZgC+Hw3Uw4CJL7YePi61BCksEFMbCI8fAJCIuIIkjKysm4W6vaa2nqGJqmEssSEjipS0lnqbszSXj7ofiGBzcEEumSUYGFBuizsSCDx-ILCwyluOsTOGrbOeTqFiOryxK6ylYTVGnUN3iBB-kTExyFdAGbcaFjhkf2DcbxjSZOIburMxPL29RUaLTLYwSZTfewVME7GpZRpHdonNr0E5XG5YYiXUgUCjUWAAVwARlh+E9hqNEhNQCl7G57MQcvNpIsgYQVqllHSIVsobtaoQvIdcNwIHAROcAs8EuNkmY3G5iGoObplGzzBZiJkdrYto5nK44eLTuQqJLXpSxBJ1vIFJ8VSCEOZ5XKtXZdS53AaEa0zl7OqaKTKELpdOlNRpciyDPbTLp1s6bK6nO7PIdDUiWp1ulRdP7pe8gy4NhksuGlqz7bViFztrz9p7kd7Dajbrm3lTEFDZvZGcz8myaWVIVUYfV6xnTk2MWiMViKK3zSllLYuz2I337YRVD8SjWYfzU76J4fm+j8UT+AJcFB54HNHSGWsmWvgUVN+Ch9C9vuvEA */
  id: 'agreement1',
  initial: 'idle',
  states: {
    idle: {
      on: {
        agree1: 'agreement2',
      },
    },

    agreement2: {
      initial: 'idle2',
      states: {
        idle2: {
          on: {
            agree2: 'form',
          },
        },

        form: {
          initial: 'fill',
          states: {
            fill: {
              on: {
                submit: 'submitting',
              },
            },

            submitting: {},
          },
          on: {
            disagree2: 'idle2',
          },
        },
      },

      on: {
        disagree1: 'idle',
      },
    },
  },
});
