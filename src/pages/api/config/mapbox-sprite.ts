import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerMapboxSpriteUrl } from '@atb/modules/firebase/server-config-store.ts';

/**
 * Serves the Mapbox sprite URL from the server config store instead of every
 * browser reading Firestore directly.
 */
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  const spriteUrl = await getServerMapboxSpriteUrl();
  // Only cache when we actually have a URL.
  res.setHeader(
    'Cache-Control',
    spriteUrl ? 'public, max-age=300, stale-while-revalidate=3600' : 'no-store',
  );
  res.status(200).json(spriteUrl ?? null);
}
