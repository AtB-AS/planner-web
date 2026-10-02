import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Startup warmup endpoint — target of the k8s `startupProbe`.
 *
 * On the first call it renders the hot SSR route once (loopback to this server)
 * so V8 compiles/JITs the shared render pipeline before the pod serves real
 * traffic, then returns 200. It **blocks** until warm — the probe waits — so the
 * startupProbe needs a generous `timeoutSeconds`. Warmup runs at most once (shared
 * promise); if a probe times out mid-warmup, a later probe just catches the
 * completion.
 *
 * While the startupProbe hasn't succeeded, k8s keeps the pod un-Ready (no traffic,
 * and the HPA excludes its cold-start CPU) and liveness is disabled (no restart
 * mid-warmup). Readiness + liveness use /api/healthz (always 200).
 *
 * Warming only /assistant is intentional: it warms the shared render pipeline
 * (the dominant one-time cost) plus the heaviest route; other routes then pay only
 * their small per-route module load on first hit.
 */

const WARMUP_ROUTES = ['/assistant'];
const FETCH_TIMEOUT_MS = 20_000;

let warmupPromise: Promise<void> | null = null;

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader('Cache-Control', 'no-store');
  await (warmupPromise ??= warmup());
  res.status(200).json({ status: 'ready' });
}

async function warmup() {
  const started = Date.now();
  const base = `http://127.0.0.1:${process.env.PORT ?? '3000'}`;
  for (const path of WARMUP_ROUTES) {
    await fetch(base + path, {
      redirect: 'manual',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    }).catch(() => undefined);
  }
  console.log(`warmup: completed in ${Date.now() - started}ms`);
}
