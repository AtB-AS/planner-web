import { IncomingHttpHeaders } from 'http';
import { GetServerSidePropsResult } from 'next/types';
import { logger } from './logger.ts';

type LogCallHandlerParams = {
  duration: number;
  url?: string;
  statusCode?: number;
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
  statusCode,
  method,
  requestHeaders,
  propsResult,
}: LogCallHandlerParams) {
  (async () => {
    // Try to stringify resolvedProps, but handle cases where it might not be stringifiable (circular references, etc.)
    let stringifiedProps: string;
    try {
      if (propsResult && 'props' in propsResult) {
        stringifiedProps = JSON.stringify(await propsResult.props);
      } else {
        stringifiedProps = 'No resolved props';
      }
    } catch (e) {
      stringifiedProps = 'Non-stringifiable props. Error: ' + e;
    }

    const ct = {
      method,
      url,
      duration,
      severity: 'INFO',
      message: 'page access',
      time: new Date().toISOString(),
      code: statusCode,
      requestId: requestHeaders?.['requestId'],
      resolvedProps: stringifiedProps,
    };
    logger.info(ct);
  })();
}
