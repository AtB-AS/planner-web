import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: {
    'https://api.entur.io/journey-planner/v3/graphql': {
      headers: {
        'ET-Client-Name': 'atb-planner-web',
      },
    },
  },
  documents: 'src/**/journey-gql/*.gql',
  generates: {
    'src/modules/graphql-types/journeyplanner-types_v3.generated.ts': {
      plugins: ['typescript'],
    },
    'src/modules/graphql-types/': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.ts',
        baseTypesPath: 'journeyplanner-types_v3.generated.ts',
      },
      config: {
        skipTypename: true,
        // This causes some types to be wrong (e.g. in departure query dates are any type)
        // but it makes using the types waay easier. Necessary evil in my mind.
        preResolveTypes: true,
        exportFragmentSpreadSubTypes: true,
        // Looks like almost all types in the GraphQL server is optional but actually are set. The Maybe combinator
        // is a pain to work with when traversing the types.
        maybeValue: 'T',
        scalars: {
          DateTime: 'string',
          Long: 'number',
        },
      },
      plugins: ['typescript-operations', 'typescript-generic-sdk'],
    },
  },
};
export default config;
