import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerTransportModeFilter } from '@atb/modules/firebase/server-config-store.ts';

/**
 * Serves the transport-mode filter from the server config store instead of every
 * browser reading Firestore directly.
 */
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  const transportModeFilter = await getServerTransportModeFilter();
  // Only cache a healthy (non-empty) response
  res.setHeader(
    'Cache-Control',
    transportModeFilter.length > 0
      ? 'public, max-age=300, stale-while-revalidate=3600'
      : 'no-store',
  );
  res.status(200).json(transportModeFilter);
}
