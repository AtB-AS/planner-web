# Module for generating external communication clients

This intends to create an uniform way of communicating with external services.
This is to:

- Add automatic logging and tracing
- Ensure that each requests has proper metadata such as correlation ID and ET
  client name.
- Make it easier to make consistant APIs for both HTTP handlers and
  `getServersideProps`.
- Ensure that all external communication happens through same API.
- Try to enforce similar pattern / architecture everywhere.

## Examples

```ts
// Create a HTTP API to use for getServerSideProps

const myHttpApiCreator = createExternalClient('http-bff', function (request) {
  return {
    myFunction: (a: string) => request(`/geocoder?q=${a}`),
  };
});

export const ssrHttpClientDecorator =
  createWithExternalClientDecorator(myHttpApiCreator);

// inside Page

// This will be removed to the client, only executed on SSR
export const getServerSideProps = ssrHttpClientDecorator(async function ({
  client,
}) {
  const result = await client.myFunction('Kongens gate');

  return {
    props: {
      autocompleteFeatures: result,
    },
  };
});
```

```ts
// Inside API modules we create the API

const myGraphQL = createExternalClient(
  'graphql-journeyPlanner3',
  function (client) {
    return {
      myFunction: async (a: string) => a,
      myGraphQLQuery: (input: string) => client.query(`MY QUERY HERE ${input}`),
    };
  },
);

// Export the decorator
export const graphQlApiHandler =
  createWithExternalClientDecoratorForHttpHandlers(myGraphQL);

// inside /api/demo.ts
export default graphQlApiHandler<string>(function (req, res, { client, ok }) {
  ok(client.myFunction('Hello, World!'));
});
```

```ts
// Combining external resources

const myHttpApiCreator = createExternalClient('http-bff', function (request) {
  return {
    myFunction: (a: string) => request(`/geocoder?q=${a}`),
  };
});

const myGraphQL = createExternalClient(
  'graphql-journeyPlanner3',
  function (client) {
    return {
      myGraphQLQuery: (input: string) => client.query(`MY QUERY HERE ${input}`),
    };
  },
);

const combinedFactories = composeClientFactories(myHttpApiCreator, myGraphQL);

export const ssrHttpClientDecorator =
  createWithExternalClientDecorator(combinedFactories);

// inside Page

// This will be removed to the client, only executed on SSR
export const getServerSideProps = ssrHttpClientDecorator(async function ({
  client,
}) {
  const result = await client.myFunction('Kongens gate');
  const result2 = await client.myGraphQLQuery('Kongens gate');

  return {
    props: {
      autocompleteFeatures: result,
      data: result2,
    },
  };
});
```

See tests for more examples.
