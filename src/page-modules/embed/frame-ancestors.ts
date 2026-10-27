import { getOrgData } from '@atb/modules/org-data';
import type { ServerResponse } from 'http';

const DEV_ORIGINS = ['http://localhost:*'];

// Browser enforced allow list of sites that can show embed pages in an iframe.
// 'self' keeps the demo on the /embed docs page working.
export function getFrameAncestorsPolicy(
  allowedOrigins: string[],
  isDev: boolean,
): string {
  const origins = ["'self'", ...allowedOrigins, ...(isDev ? DEV_ORIGINS : [])];
  return `frame-ancestors ${origins.join(' ')}`;
}

export function setEmbedFrameAncestors(res: ServerResponse) {
  res.setHeader(
    'Content-Security-Policy',
    getFrameAncestorsPolicy(
      getOrgData().embed?.allowedOrigins ?? [],
      process.env.NODE_ENV !== 'production',
    ),
  );
}
