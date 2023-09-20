import { ServerText, TranslatedString, translation } from '@atb/translations';
import bunyan from 'bunyan';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

export const logger = bunyan.createLogger({
  name: 'planner-web',
  streams: [{ stream: process.stdout, level: 'info' }],
  serializers: {
    req: (req: Request) => {
      return {
        method: req.method,
        url: req.url,
        headers: {
          ...req.headers,
          cookie: null,
        },
      };
    },
    res: bunyan.stdSerializers.res,
    upstream: (up: Response) => {
      return {
        statusCode: up.status,
        url: up.url,
        statusText: up.statusText,
      };
    },
    err: bunyan.stdSerializers.err,
  },
});

export function logError(e: any) {
  if (process.env.NODE_ENV === 'development') {
    console.error(e);
  } else {
    logger.error(e);
  }
}

export function logApplicationError(
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
        res,
        req,
        err: e,
      },
      e.message,
    );
  }
}

const externalHttpUrls = {
  entur: 'https://api.entur.io',
} as const;

export type HttpEndpoints = keyof typeof externalHttpUrls;

export type Requester<T extends HttpEndpoints> = (
  url: `/${string}`,
  init?: RequestInit | undefined,
) => Promise<Response>;

export function createRequester<T extends HttpEndpoints>(
  baseUrlKey: T,
  correlationId: string | undefined,
): Requester<T> {
  return async function request(
    url: `/${string}`,
    init?: RequestInit | undefined,
  ) {
    const baseUrl = externalHttpUrls[baseUrlKey];
    const actualUrl = `${baseUrl}${url}`;

    try {
      const data = await fetch(actualUrl, {
        ...init,
        headers: {
          ...init?.headers,
          'ET-Client-Name': 'FOO',
          'X-Correlation-Id': correlationId ?? uuidv4(),
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      return data;
    } catch (e) {
      throw new ApplicationError(mapServerToMessage(e), 500);
    }
  };
}

export function resT(
  res: NextApiResponse,
  code: number,
  text: TranslatedString,
) {
  return res.status(code).json({
    message: text,
  });
}

export function resD(
  res: NextApiResponse,
  code: number,
  data: ServerErrorMessage,
) {
  return res.status(code).json(data);
}

export type ServerErrorMessage = {
  message: TranslatedString;
};

type InternalServerError = {
  error: string;
};
type MessagedServerError = {
  message: string;
};
type InternalServerErrorWithUpstream = InternalServerError & {
  upstreamError: string;
};

type InternalUpstreamServerError = {
  errorCode: 602;
  shortNorwegian: string;
  shortEnglish: string;
};

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
      return resD(res, properError.status, properError.data);
    } else {
      logError(e);
      return resT(res, 500, ServerText.Endpoints.serverError);
    }
  }
}

export async function throwErrorFromResponse(result: Response) {
  if (result.headers.get('content-type')?.includes('application/json')) {
    const data = await result.json();
    throw new ApplicationError(mapServerToMessage(data), result.status, result);
  } else if (result.headers.get('content-type')?.includes('text/html')) {
    throw new ApplicationError(
      mapServerToMessage(result.statusText),
      result.status,
      result,
    );
  } else {
    const data = await result.text();
    if (result.status === 401) {
      throw new ApplicationError(
        {
          message: ServerText.Endpoints.accessError,
        },
        result.status,
        result,
      );
    }
    throw new ApplicationError(mapServerToMessage(data), result.status, result);
  }
}

function mapServerToMessage(e: any): ServerErrorMessage {
  if (typeof e === 'string') {
    return { message: translation(e, e, e) };
  }
  if (!isInternalServerError(e)) {
    return { message: ServerText.Endpoints.serverError };
  }
  if (isMessagedError(e)) {
    return { message: translation(e.message, e.message, e.message) };
  }

  const defaultError = { message: translation(e.error, e.error, e.error) };
  if (!isInternalServerErrorWithUpstream(e)) {
    return defaultError;
  }

  try {
    const upstreamError = JSON.parse(e.upstreamError);
    if (!isInternalUpstreamServerError(upstreamError)) {
      return defaultError;
    }

    return {
      message: translation(
        upstreamError.shortNorwegian,
        upstreamError.shortEnglish,
        upstreamError.shortNorwegian,
      ),
    };
  } catch (_err) {
    return defaultError;
  }
}

export function genericError() {
  return new ApplicationError({ message: ServerText.Endpoints.serverError });
}

function isMessagedError(e: any): e is MessagedServerError {
  return 'message' in e;
}

function isInternalServerError(e: any): e is InternalServerError {
  return 'error' in e;
}

function isInternalServerErrorWithUpstream(
  e: any,
): e is InternalServerErrorWithUpstream {
  return 'upstreamError' in e;
}

function isInternalUpstreamServerError(
  e: any,
): e is InternalUpstreamServerError {
  return 'errorCode' in e && 'shortNorwegian' in e;
}

export class ApplicationError extends Error {
  data: ServerErrorMessage;
  status: number;
  upstreamResponse?: Response | NextApiResponse<any>;

  constructor(
    error: ServerErrorMessage,
    status: number = 500,
    upstreamResponse?: Response | NextApiResponse<any>,
  ) {
    super();
    this.data = error;
    this.status = status;
    this.upstreamResponse = upstreamResponse;
  }
}
