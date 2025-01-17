import { EnvType } from '../types';

export const env: EnvType = {
  environments: {
    dev: {
      host: 'http://localhost:3000',
    },
    staging: {
      host: 'https://atb-staging.planner-web.mittatb.no',
    },
    prod: {
      host: 'https://atb.planner-web.mittatb.no',
    },
  },
};
