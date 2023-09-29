import type { IGraphQLConfig } from 'graphql-config';

const config: IGraphQLConfig = {
  schema: 'https://api.entur.io/journey-planner/v3/graphql',
  documents: 'src/**/*.gql',
  exclude: ['src/**/*.generated.ts'],
};

export default config;
