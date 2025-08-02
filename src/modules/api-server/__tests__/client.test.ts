import {
  Mock,
  afterAll,
  assertType,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import {
  ExternalClient,
  GraphQlRequester,
  HttpRequester,
  composeClientFactories,
  createExternalClient,
  createWithExternalClientDecorator,
  createWithExternalClientDecoratorForHttpHandlers,
} from '..';
import { NextApiRequest, NextApiResponse } from 'next';

const initialFetch = global.fetch;
let mockFetch: Mock;

beforeEach(() => {
  mockFetch = vi.fn();
  global.fetch = mockFetch;
});
afterAll(() => {
  global.fetch = initialFetch;
});

describe('requester client', () => {
  it('should pass request with correct base url', () => {
    const clientCreator = createExternalClient('http-bff', function (request) {
      return {
        api: async () => {
          try {
            await request('/foo');
          } catch (e) {}
        },
      };
    });

    clientCreator().api();

    expect(mockFetch).toHaveBeenCalledWith('/bff/foo', expect.anything());
  });

  it('should return properly created API', () => {
    const mock = vi.fn();
    const clientCreator = createExternalClient('http-bff', function () {
      return {
        api: mock,
      };
    });

    clientCreator().api();
    expect(mock).toBeCalled();
  });

  it('should return properly created API for graphql endpoints', () => {
    const mock = vi.fn();
    const clientCreator = createExternalClient(
      'graphql-journeyPlanner3',
      function () {
        return {
          api: mock,
        };
      },
    );

    clientCreator().api();
    expect(mock).toBeCalled();
  });

  it('give type inference through apis', () => {
    const clientCreator = createExternalClient('http-bff', function () {
      return {
        api(n: number) {
          return n * 42;
        },
      };
    });

    assertType<number>(clientCreator().api(1));

    // @ts-expect-error answer is not a string
    assertType<string>(clientCreator().api(1));
  });

  it('give type inference through apis for GraphQL', () => {
    const clientCreator = createExternalClient(
      'graphql-journeyPlanner3',
      function () {
        return {
          api(n: number) {
            return n * 42;
          },
        };
      },
    );

    assertType<ExternalClient<'graphql-journeyPlanner3', any>>(clientCreator());
  });

  it('should be able to compose clients', () => {
    const mock1 = vi.fn();
    const clientCreator1 = createExternalClient('http-bff', function () {
      return {
        api1: mock1,
      };
    });

    const mock2 = vi.fn();
    const clientCreator2 = createExternalClient('http-bff', function () {
      return {
        api2: mock2,
      };
    });

    const properClientCreator = composeClientFactories(
      clientCreator1,
      clientCreator2,
    );
    const client = properClientCreator();

    client.api1();
    expect(mock1).toBeCalled();

    client.api2();
    expect(mock2).toBeCalled();
  });

  it('should be able to compose clients with proper type inference', () => {
    const clientCreator1 = createExternalClient('http-bff', function () {
      return {
        api1: (a: string) => a,
      };
    });

    const clientCreator2 = createExternalClient('http-bff', function () {
      return {
        api2: (a: number) => a,
        api3: (a: number) => a,
      };
    });

    const properClientCreator = composeClientFactories(
      clientCreator1,
      clientCreator2,
    );
    const client = properClientCreator();

    // @ts-expect-error answer is not a string
    assertType<number>(client.api1(1));
    assertType<string>(client.api1('test'));

    // @ts-expect-error answer is not a string
    assertType<string>(client.api2('test'));
    assertType<number>(client.api2(1));

    // @ts-expect-error answer is not a string
    assertType<string>(client.api3('test'));
    assertType<number>(client.api3(1));
  });

  it('should be able to compose clients with proper type inference with graphql and http', () => {
    const clientCreator1 = createExternalClient('http-bff', function () {
      return {
        api1: (a: string) => a,
      };
    });

    const clientCreator2 = createExternalClient(
      'graphql-journeyPlanner3',
      function () {
        return {
          api2: (a: number) => a,
          api3: (a: number) => a,
        };
      },
    );

    const properClientCreator = composeClientFactories(
      clientCreator1,
      clientCreator2,
    );
    const client = properClientCreator();

    // @ts-expect-error answer is not a string
    assertType<number>(client.api1(1));
    assertType<string>(client.api1('test'));

    // @ts-expect-error answer is not a string
    assertType<string>(client.api2('test'));
    assertType<number>(client.api2(1));

    // @ts-expect-error answer is not a string
    assertType<string>(client.api3('test'));
    assertType<number>(client.api3(1));
  });

  it('should work all from creating client to ssr decorator', () => {
    const myHttpApiCreator = createExternalClient(
      'http-bff',
      function (requester) {
        assertType<HttpRequester<'http-bff'>>(requester);

        return {
          myFunction: async (a: string) => a,
        };
      },
    );

    const ssrHttpClientDecorator =
      createWithExternalClientDecorator(myHttpApiCreator);

    // this would be inside Page like getServerSideProps
    const _getServerSideProps = ssrHttpClientDecorator(async function ({
      client,
    }) {
      assertType<Function>(client.myFunction);

      const result = await client.myFunction('Kongens gate');

      return {
        props: {
          autocompleteFeatures: result,
        },
      };
    });

    assertType<Function>(_getServerSideProps);
  });

  it('should work all from creating GraphQL client to ssr decorator', () => {
    const myGraphQL = createExternalClient(
      'graphql-journeyPlanner3',
      function (client) {
        assertType<GraphQlRequester<'graphql-journeyPlanner3'>>(client);

        return {
          myFunction: async (a: string) => a,
        };
      },
    );

    const ssrHttpClientDecorator = createWithExternalClientDecorator(myGraphQL);

    // this would be inside Page like getServerSideProps
    const _getServerSideProps = ssrHttpClientDecorator(async function ({
      client,
    }) {
      assertType<Function>(client.myFunction);

      const result = await client.myFunction('Kongens gate');

      return {
        props: {
          autocompleteFeatures: result,
        },
      };
    });

    assertType<Function>(_getServerSideProps);
  });

  it('should work all from creating GraphQL client to ssr decorator', () => {
    const myGraphQL = createExternalClient(
      'graphql-journeyPlanner3',
      function (client) {
        assertType<GraphQlRequester<'graphql-journeyPlanner3'>>(client);

        return {
          myFunction: async (a: string) => a,
        };
      },
    );

    const ssrHttpClientDecorator =
      createWithExternalClientDecoratorForHttpHandlers(myGraphQL);

    // this would be in /api/page-handler.ts in "export default"
    ssrHttpClientDecorator<string>(function (req, res, { client, ok }) {
      assertType<NextApiRequest>(req);
      assertType<NextApiResponse<string>>(res);
      assertType<Function>(client.myFunction);

      // Should return same as generic on decorator
      assertType<(a: string) => void>(ok);
    });
  });

  it('should work all from creating composed GraphQL and HTTP client to ssr', () => {
    const myGraphQL = createExternalClient(
      'graphql-journeyPlanner3',
      function () {
        return {
          myFunction1: async (a: string) => a,
        };
      },
    );
    const myHttp = createExternalClient('http-bff', function () {
      return {
        myFunction2: async (a: string) => a,
      };
    });

    const ssrHttpClientDecorator = createWithExternalClientDecorator(
      composeClientFactories(myGraphQL, myHttp),
    );

    // this would be inside Page like getServerSideProps
    const _getServerSideProps = ssrHttpClientDecorator(async function ({
      client,
    }) {
      assertType<Function>(client.myFunction1);
      assertType<Function>(client.myFunction2);

      // @ts-expect-error answer is not defined
      assertType<Function>(client.myFunction3);

      const result = await client.myFunction1('Kongens gate');

      return {
        props: {
          autocompleteFeatures: result,
        },
      };
    });

    assertType<Function>(_getServerSideProps);
  });
});
