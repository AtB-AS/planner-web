import type { GetServerSideProps, NextPage } from 'next';
import { DEV_MODE_COOKIE_NAME } from '@atb/modules/cookies/constants';

// One year, in seconds.
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const DEFAULT_DESTINATION = '/dev/trip-pattern';

/**
 * Convenience route for sharing dev tools: hitting `/dev/enable` sets the
 * `dev-mode-enabled` cookie and redirects to the dev trip-pattern page (or to
 * `?to=/dev/...`). Lets teammates turn on dev mode from a single link instead
 * of setting the cookie by hand. Never renders — `getServerSideProps` always
 * redirects.
 */
const DevEnablePage: NextPage = () => null;

export default DevEnablePage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Only redirect to internal dev paths, so the link can't be used as an open
  // redirect to another site.
  const to = typeof ctx.query.to === 'string' ? ctx.query.to : '';
  const destination = /^\/dev\/[\w\-/]*$/.test(to) ? to : DEFAULT_DESTINATION;

  const isHttps = String(ctx.req.headers['x-forwarded-proto'] ?? '').includes(
    'https',
  );

  ctx.res.setHeader(
    'Set-Cookie',
    [
      `${DEV_MODE_COOKIE_NAME}=true`,
      'Path=/',
      `Max-Age=${COOKIE_MAX_AGE}`,
      'SameSite=Lax',
      isHttps ? 'Secure' : '',
    ]
      .filter(Boolean)
      .join('; '),
  );

  return { redirect: { destination, permanent: false } };
};
