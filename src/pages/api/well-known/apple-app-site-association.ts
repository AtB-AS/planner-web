import type { NextApiRequest, NextApiResponse } from 'next';
import { getAppLinks } from '@atb/modules/org-data';

/**
 * Served at `/.well-known/apple-app-site-association`, see `next.config.js`.
 * Paths opened in the app, see `use-deep-links.ts` in mittatb-app.
 */
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const appLinks = getAppLinks();
  if (!appLinks) return res.status(404).end();

  res.status(200).json({
    applinks: {
      details: [
        {
          appIDs: appLinks.iosAppIds,
          components: [
            { '/': '/departures/details/*', exclude: true },
            { '/': '/departures/*' },
          ],
        },
      ],
    },
  });
}
