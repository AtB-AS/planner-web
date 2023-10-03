import type { GetServerSidePropsResult } from 'next/types';
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
