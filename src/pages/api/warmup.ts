import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Startup warmup endpoint — intended as the target of the k8s `startupProbe`.
 *
 * The first call renders the hot SSR routes once (via loopback to this server) so
 * V8 loads + compiles their modules and the shared render pipeline before the pod
 * serves real traffic. It returns 503 until that one pass is done, then 200.
 *
 * While the startupProbe hasn't succeeded, k8s keeps the pod un-Ready (no traffic,
 * and the HPA excludes the warmup/cold-start CPU) and liveness is disabled (no
 * restart mid-warmup). On the first 200 the startupProbe succeeds once and stops.
 *
 * Readiness + liveness stay on /api/healthz (always 200). One render per route is
 * enough: the dominant cold cost is one-time module load/compile (~first render);
 * the small remaining JIT tail warms under real traffic.
 */

const WARMUP_ROUTES = ['/assistant', '/departures'];
const FETCH_TIMEOUT_MS = 10_000;

type State = 'cold' | 'warming' | 'ready';
let state: State = 'cold';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (state === 'ready') {
    res.status(200).json({ status: 'ready' });
    return;
  }

  // First call kicks off the single warm pass; the probe keeps getting 503 until
  // it finishes, then 200 (startupProbe succeeds once and stops polling).
  if (state === 'cold') {
    state = 'warming';
    void warmup();
  }

  res.status(503).json({ status: 'warming' });
}

async function warmup() {
  const started = Date.now();
  const base = `http://127.0.0.1:${process.env.PORT ?? '3000'}`;
  try {
    await Promise.all(
      WARMUP_ROUTES.map((path) =>
        fetch(base + path, {
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        }).catch(() => undefined),
      ),
    );
    console.log(`warmup: completed in ${Date.now() - started}ms`);
  } catch (error) {
    console.error('warmup: error', error);
  } finally {
    // Always finish, even on error/timeout, so the startupProbe can't be stuck
    // failing forever (which would eventually restart the pod).
    state = 'ready';
  }
}
