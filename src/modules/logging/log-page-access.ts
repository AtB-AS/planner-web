import { IncomingHttpHeaders } from 'http';
import { GetServerSidePropsResult } from 'next/types';
import { logger } from './logger.ts';

type LogPageAccessParams = {
  duration: number;
  url?: string;
  method?: string;
  requestHeaders?: IncomingHttpHeaders;
  propsResult?: GetServerSidePropsResult<any>;
};

/**
 * Fire-and-forget function for access logging.
 *
 * The exported function itself is not async since there is no promise to ever wait for from the outside.
 * But since it does access the propsResult.props which can be a promise it needs to be async internally.
 */
export function logPageAccess({
  duration,
  url,
  method,
  requestHeaders,
  propsResult,
}: LogPageAccessParams) {
  (async () => {
    const stringifiedProps =
      propsResult && 'props' in propsResult
        ? limitedStringify(await propsResult.props)
        : 'No resolved props';

    const ct = {
      method,
      url,
      duration,
      severity: 'INFO',
      message: 'page access',
      time: new Date().toISOString(),
      requestId: requestHeaders?.['requestId'],
      clientIpAddress: requestHeaders?.['client-ip-address'],
      resolvedProps: stringifiedProps,
    };
    logger.info(ct);
  })();
}

export function limitedStringify<T>(obj: T, maxDepth: number = 2): string {
  const seen = new WeakSet<object>();

  function _trunc(val: unknown, depth: number): unknown {
    if (val !== null && typeof val === 'object') {
      if (seen.has(val as object)) return '[Circular]';
      if (depth > maxDepth)
        return '[TrucatedObject, maxDepth: ' + maxDepth + ' exeeded]';
      seen.add(val as object);

      if (Array.isArray(val)) {
        return (val as unknown[]).map((item) => _trunc(item, depth + 1));
      }
      const out: Record<string, unknown> = {};
      for (const k in val as Record<string, unknown>) {
        if (Object.prototype.hasOwnProperty.call(val, k)) {
          out[k] = _trunc((val as Record<string, unknown>)[k], depth + 1);
        }
      }
      return out;
    }
    return val;
  }

  try {
    return JSON.stringify(_trunc(obj, 0), null, 2);
  } catch (e) {
    return `[Unserializable: ${(e as Error).message}]`;
  }
}
