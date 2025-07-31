import { ParsedUrlQuery } from 'querystring';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { GetServerSidePropsResult } from 'next/types';
import { Timer } from '@atb/modules/logging/timer.ts';
import { logPageAccess } from '@atb/modules/logging/log-page-access.ts';

export function withAccessLogging<
  P extends {} = {},
  Params extends ParsedUrlQuery = ParsedUrlQuery,
>(propGetter?: GetServerSideProps<P, Params>) {
  return async function inside(
    ctx: GetServerSidePropsContext<Params>,
  ): Promise<GetServerSidePropsResult<P>> {
    const timer = new Timer();
    const propsResult: GetServerSidePropsResult<P> | undefined =
      await propGetter?.(ctx);
    logPageAccess({
      url: ctx.resolvedUrl,
      method: ctx.req?.method,
      requestHeaders: ctx.req?.headers,
      duration: timer.getElapsedMs(),
      propsResult,
    });
    return propsResult ?? { props: {} as P };
  };
}
