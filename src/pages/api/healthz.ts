import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Lightweight health endpoint for Kubernetes.
 * It returns 200 as soon as the Next.js server is accepting HTTP,
 * to avoid causing cascading replicas as CPU spikes on startup.
 */
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ status: 'ok' });
}
