import { GlobalCookiesData, getGlobalCookies } from '@atb/modules/cookies';
import { IncomingHttpHeaders } from 'http';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

export type AllData = GlobalCookiesData;

export type WithGlobalData<T> = T & AllData;

async function getGlobalData(req: {
  cookies: NextApiRequestCookies;
  headers: IncomingHttpHeaders;
}): Promise<AllData> {
  return getGlobalCookies(req);
}

export type GlobalPropGetter<P extends {} = {}> = (
  context: GetServerSidePropsContext,
) => Promise<GetServerSidePropsResult<P>>;

/**
 * Higher order function to wrap default getServerSideProps to provide default
 * data with shared data
 *
 * Used in relation with ./layouts/default to provide with global data,
 **/
export function withGlobalData<P extends {} = {}>(
  propGetter?: GlobalPropGetter<P>,
) {
  return async function inside(
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<WithGlobalData<P>>> {
    const initialData = await getGlobalData(ctx.req);

    const composedProps: GetServerSidePropsResult<P> | undefined =
      await propGetter?.({
        ...ctx,
      });

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
