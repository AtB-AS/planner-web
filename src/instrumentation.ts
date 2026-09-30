/**
 * Next.js instrumentation hook — runs once when the server starts.
 *
 * We use it to pre-warm the Firestore config listeners so the very first request
 * is served from memory instead of paying a cold Firestore round-trip. The
 * dynamic import keeps firebase-admin out of the Edge runtime bundle.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const { subscribeToServerConfig } = await import(
    '@atb/modules/firebase/server-config-store'
  );

  try {
    await subscribeToServerConfig();
  } catch (error) {
    // Don't block server startup on config warmup; readers fall back to empty
    // and the listeners keep retrying.
    console.error('instrumentation: failed to pre-warm server config', error);
  }
}
