import { type GlobalCookiesData, getGlobalCookies } from '@atb/modules/cookies';
import type { GetServerSideProps } from 'next';
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

export type AllData = GlobalCookiesData;

export type WithGlobalData<T> = T & AllData;

/**
 * Higher order function to wrap default getServerSideProps to provide default
 * data with shared data
 *
 * Used in relation with ./layouts/default to provide with global data,
 **/
export function withGlobalData<P extends {} = {}>(
  propGetter?: GetServerSideProps<P>,
) {
  return async function inside(
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<WithGlobalData<P>>> {
    const initialData = getGlobalCookies(ctx.req);

    const composedProps: GetServerSidePropsResult<P> | undefined =
      await propGetter?.(ctx);

    if (!composedProps) {
      return { props: initialData as WithGlobalData<P> };
    }

    if ('props' in composedProps) {
      return {
        ...composedProps,
        props: {
          ...(composedProps.props as P),
          ...(initialData as AllData),
        },
      };
    } else {
      return {
        ...composedProps,
        props: initialData as WithGlobalData<P>,
      };
    }
  };
}
