import { Options } from 'k6/options';

export const funcOptions: Options = {
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(95)', 'p(99)', 'count'],
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: 1,
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {},
};

export const perfOptions: Options = {
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(95)', 'p(99)', 'count'],
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      vus: 3,
      iterations: 10,
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {},
};
