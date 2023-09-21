import { HttpClient } from '@atb/modules/api-server';
import { HttpEndpoints } from '@atb/modules/api-server/utils';
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next/types';
import { Assertion, expect } from 'vitest';

export async function expectProps<T>(
  potential: GetServerSidePropsResult<T>,
): Promise<Assertion<Awaited<T>>> {
  if (!('props' in potential)) {
    expect.unreachable();
  }

  const props = await potential.props;
  return expect(props);
}

export async function getServerSidePropsWithClient<
  U extends HttpEndpoints,
  M,
  T extends { [key: string]: any } = { [key: string]: any },
>(
  client: HttpClient<U, M>,
  propsHandler: GetServerSideProps<T>,
  context?: GetServerSidePropsContext<T>,
) {
  return propsHandler({ ...context, client } as GetServerSidePropsContext<T>);
}
