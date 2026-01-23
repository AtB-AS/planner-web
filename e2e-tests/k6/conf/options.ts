import { Options } from 'k6/options';

export const funcOptions: Options = {
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(75)', 'p(95)', 'count'],
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
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(75)', 'p(95)', 'count'],
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      vus: 5,
      iterations: 20,
      maxDuration: '10m',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {},
};
