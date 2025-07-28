import { getGlobalCookies } from '@atb/modules/cookies';
import type { GetServerSideProps } from 'next';
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ParsedUrlQuery } from 'node:querystring';
import { AllData, WithGlobalData } from './types.ts';

/**
 * Higher order function to wrap default getServerSideProps to provide default
 * data with shared data
 *
 * Used in relation with ./layouts/default to provide with global data,
 **/
export function withGlobalData<
  P extends {} = {},
  Params extends ParsedUrlQuery = ParsedUrlQuery,
>(propGetter?: GetServerSideProps<P, Params>) {
  return async function inside(
    ctx: GetServerSidePropsContext<Params>,
  ): Promise<GetServerSidePropsResult<WithGlobalData<P>>> {
    const initialData = getGlobalCookies(ctx.req);

    const composedProps: GetServerSidePropsResult<P> | undefined =
      await propGetter?.(ctx);

    if (!composedProps) {
      return { props: initialData as WithGlobalData<P> };
    }

    if ('notFound' in composedProps || 'redirect' in composedProps) {
      return composedProps;
    }

    if (!('props' in composedProps)) {
      return {
        props: initialData as WithGlobalData<P>,
      };
    }

    return {
      ...composedProps,
      props: {
        ...(composedProps.props as P),
        ...(initialData as AllData),
      },
    };
  };
}
