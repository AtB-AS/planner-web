/**
 * Next.js instrumentation hook — runs once when the server starts.
 *
 * We use it to pre-warm the Firestore config listeners so the very first request
 * is served from memory instead of paying a cold Firestore round-trip. The
 * dynamic import keeps the config store (and its Firestore listeners) out of the
 * Edge runtime bundle.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const { subscribeToServerConfig } =
    await import('@atb/modules/firebase/server-config-store');

  try {
    await subscribeToServerConfig();
  } catch (error) {
    // Don't block server startup on config warmup; readers fall back to empty
    // and the listeners keep retrying.
    console.error('instrumentation: failed to pre-warm server config', error);
  }
}

/**
 * Next.js calls this for every error thrown while handling a request (SSR, API
 * routes, app router), including ones Next would otherwise print itself as
 * unformatted text. We re-emit them as structured JSON matching the `severity`/
 * `message` field convention our other logs use. Edge-runtime routes can't use
 * bunyan, so fall back to a JSON console line there.
 */
export async function onRequestError(
  error: unknown,
  request: { path?: string; method?: string },
  context: { routerKind?: string; routePath?: string; routeType?: string },
) {
  const payload = {
    severity: 'ERROR',
    message: error instanceof Error ? error.message : 'request error',
    time: new Date().toISOString(),
    url: request?.path,
    method: request?.method,
    routerKind: context?.routerKind,
    routePath: context?.routePath,
    routeType: context?.routeType,
  };

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { logger } = await import('@atb/modules/logging');
    logger.error({ ...payload, err: error }, payload.message);
  } else {
    const err =
      error instanceof Error
        ? { message: error.message, name: error.name, stack: error.stack }
        : error;
    console.error(JSON.stringify({ ...payload, err }));
  }
}
