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
import { composeClientFactories, createHttpClient } from '..';

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
    const clientCreator = createHttpClient('entur', function (request) {
      return {
        api: async () => {
          try {
            await request('/foo');
          } catch (e) {}
        },
      };
    });

    clientCreator().api();

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.entur.io/foo',
      expect.anything(),
    );
  });

  it('should return properly created API', () => {
    const mock = vi.fn();
    const clientCreator = createHttpClient('entur', function () {
      return {
        api: mock,
      };
    });

    clientCreator().api();
    expect(mock).toBeCalled();
  });

  it('give type inference through apis', () => {
    const clientCreator = createHttpClient('entur', function () {
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

  it('should be able to compose clients', () => {
    const mock1 = vi.fn();
    const clientCreator1 = createHttpClient('entur', function () {
      return {
        api1: mock1,
      };
    });

    const mock2 = vi.fn();
    const clientCreator2 = createHttpClient('entur', function () {
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
    const clientCreator1 = createHttpClient('entur', function () {
      return {
        api1: (a: string) => a,
      };
    });

    const clientCreator2 = createHttpClient('entur', function () {
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
});
