import { useEffect, useRef } from 'react';

const RETRY_INTERVAL_CAP_IN_SECONDS = 10;

export type SubscriptionProps = {
  onMessage?: (event: MessageEvent) => void;
  onClose?: (event: CloseEvent) => void;
  onOpen?: (ws: WebSocket) => void;
  url: string | null;
  enabled: boolean;
};

/**
 * Subscribe to a WebSocket URL, reconnecting with capped exponential backoff
 * when the connection closes. Ported from the mobile app's useSubscription.
 *
 * Note that the listeners are part of the effect dependencies, so they should
 * be wrapped in useCallback to avoid reconnecting on every render.
 */
export function useSubscription({
  url,
  onMessage,
  onClose,
  onOpen,
  enabled,
}: SubscriptionProps) {
  const webSocket = useRef<WebSocket | null>(null);
  const retryCount = useRef<number>(0);

  useEffect(() => {
    if (!url || !enabled) return;

    let retryTimeout: ReturnType<typeof setTimeout> | null = null;
    let resetRetryCountTimeout: ReturnType<typeof setTimeout> | null = null;
    const connect = () => {
      const ws = new WebSocket(url);

      ws.onmessage = (event) => {
        onMessage?.(event);
      };

      ws.onclose = (event) => {
        if (resetRetryCountTimeout) clearTimeout(resetRetryCountTimeout);

        // 1000: normal closure. The purpose for the connection has been
        //       fulfilled.
        // 1001: "going away", such as a server going down or a browser having
        //       navigated away from a page.
        // 1006: The connection was closed abnormally, but not by the server,
        //       e.g. on network errors.
        const expectedCodes = [1000, 1001, 1006];

        if (event.code && !expectedCodes.includes(event.code)) {
          console.error(
            `WebSocket closed with code ${event.code} (${event.reason})`,
          );
        }
        retryTimeout = retryWithCappedBackoff(retryCount, connect);
        onClose?.(event);
      };

      ws.onopen = () => {
        if (onOpen) onOpen(ws);

        // If setup or authentication fails, the connection might be closed
        // after a slight delay, so we reset the retry count only when we can
        // assume the connection is stable.
        resetRetryCountTimeout = setTimeout(() => {
          retryCount.current = 0;
        }, 1000);
      };

      webSocket.current = ws;
    };
    connect();

    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
      if (resetRetryCountTimeout) clearTimeout(resetRetryCountTimeout);
      if (webSocket.current) {
        // Detach the close listener so an intentional close doesn't reconnect.
        webSocket.current.onclose = null;
        webSocket.current.close();
      }
      webSocket.current = null;
    };
  }, [url, enabled, onMessage, onClose, onOpen]);
}

/**
 * Exponential backoff, capped at RETRY_INTERVAL_CAP_IN_SECONDS between
 * retries.
 */
const retryWithCappedBackoff = (
  retryCount: React.MutableRefObject<number>,
  retry: () => void,
): ReturnType<typeof setTimeout> => {
  const delay = Math.min(
    Math.pow(2, retryCount.current) * 1000,
    RETRY_INTERVAL_CAP_IN_SECONDS * 1000,
  );
  return setTimeout(() => {
    retryCount.current = retryCount.current + 1;
    retry();
  }, delay);
};
