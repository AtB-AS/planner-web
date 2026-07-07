import { useEffect, useLayoutEffect } from 'react';

// React logs a warning when useLayoutEffect is registered during SSR. The
// /assistant page can server-render <TripPattern> (SWR-seeded from a cached
// fallback in getServerSideProps), so any layout effect inside it would fire
// that warning on cache hits. This shim aliases useLayoutEffect on the client
// and useEffect on the server to silence it. Standard ecosystem pattern.
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
