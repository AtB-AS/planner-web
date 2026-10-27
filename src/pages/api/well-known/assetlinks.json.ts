import type { NextApiRequest, NextApiResponse } from 'next';
import { getAppLinks } from '@atb/modules/org-data';

/**
 * Served at `/.well-known/assetlinks.json`, see `next.config.js`.
 * Paths opened in the app are set in the app's `AndroidManifest.xml`.
 */
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const appLinks = getAppLinks();
  if (!appLinks) return res.status(404).end();

  res.status(200).json(
    appLinks.androidApps.map((app) => ({
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: app.packageName,
        sha256_cert_fingerprints: app.sha256CertFingerprints,
      },
    })),
  );
}
