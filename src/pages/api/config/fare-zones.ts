import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerFareZones } from '@atb/modules/firebase/server-config-store.ts';

/**
 * Serves fare zones from the server config store (one in-process Firestore
 * listener) instead of every browser reading Firestore directly. Cached so the
 * CDN/browser can absorb repeat calls too.
 */
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  const fareZones = await getServerFareZones();
  // Only cache a healthy (non-empty) response.
  res.setHeader(
    'Cache-Control',
    fareZones.length > 0
      ? 'public, max-age=300, stale-while-revalidate=3600'
      : 'no-store',
  );
  res.status(200).json(fareZones);
}
