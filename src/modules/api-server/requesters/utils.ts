import { ServerText, TranslatedString } from '@atb/translations';
import { NextApiRequest, NextApiResponse } from 'next';
import { ApplicationError, ReqWithHeaders, ServerErrorMessage } from './types';
import { logger } from '../logger';
import { currentOrg } from '../../org-data';

export async function tryResult(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  fn: () => Promise<void>,
  errorMapper?: (e: ApplicationError) => ApplicationError,
) {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof ApplicationError) {
      const properError = errorMapper?.(e) ?? e;
      logApplicationError(properError, req, res);
      return errorResultAsJson(res, properError.status, properError.data);
    } else {
      logger.error(e);
      return errorResultAsJson(res, 500, ServerText.Endpoints.serverError);
    }
  }
}

export function genericError() {
  return new ApplicationError({ message: ServerText.Endpoints.serverError });
}

export function errorResultAsJson(
  res: NextApiResponse,
  code: number,
  text: TranslatedString | ServerErrorMessage,
) {
  const ret = isServerErrorMessage(text)
    ? text
    : {
        message: text,
      };
  return res.status(code).json(ret);
}

function isServerErrorMessage(e: any): e is ServerErrorMessage {
  return 'message' in e;
}

function logApplicationError(
  e: ApplicationError,
  req: Request | NextApiRequest,
  res: Response | NextApiResponse<any>,
) {
  if (process.env.NODE_ENV === 'development') {
    console.error(e);
  } else {
    logger.error(
      {
        upstream: e.upstreamResponse,
        correlationId: e.correlationId,
        res,
        req,
        err: e,
      },
      e.message,
    );
  }
}

export function getEtNameHeaders() {
  return {
    'ET-Client-Name': `${currentOrg}-planner-web`,
  };
}

const repassableHeaders = {
  installId: 'Atb-Install-Id',
  correlationId: 'X-Correlation-Id',
} as const;

type RepassableHeaders =
  (typeof repassableHeaders)[keyof typeof repassableHeaders];

export function passOnHeadersFromRequest(
  req: ReqWithHeaders | undefined,
  defaults: Partial<Record<RepassableHeaders, string>>,
) {
  let headers: HeadersInit = {};

  if (!req) {
    return defaults;
  }

  for (let headerName of Object.values(repassableHeaders)) {
    const headerNameTyped = headerName as RepassableHeaders;
    headers[headerName] =
      req.headers[headerName]?.toString() ?? defaults[headerNameTyped] ?? '';
  }

  return headers;
}
