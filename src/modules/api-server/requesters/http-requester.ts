import { ServerText, translation } from '@atb/translations';
import { v4 as uuidv4 } from 'uuid';
import {
  ApplicationError,
  HttpEndpoints,
  ReqWithHeaders,
  HttpRequester,
  ServerErrorMessage,
  externalHttpUrls,
} from './types';
import { getEtNameHeaders, passOnHeadersFromRequest } from './utils';
import { logApiResponse, Timer } from '@atb/modules/logging';

export function createRequester<T extends HttpEndpoints>(
  baseUrlKey: T,
  req?: ReqWithHeaders,
): HttpRequester<T> {
  return async function request(
    url: `/${string}`,
    init?: RequestInit | undefined,
  ) {
    const baseUrl = externalHttpUrls[baseUrlKey];
    const actualUrl = `${baseUrl}${url}`;

    // Pass on from the potentially incoming request.
    const headers = passOnHeadersFromRequest(req, {
      'X-Correlation-Id': uuidv4(),
    });

    try {
      const timer = new Timer();

      const data = await fetch(actualUrl, {
        ...init,
        headers: {
          ...init?.headers,
          ...getEtNameHeaders(),
          ...headers,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      logApiResponse({
        message: 'http call',
        method: init?.method,
        url: data.url,
        statusCode: data.status,
        responseHeaders: data.headers,
        requestHeaders: headers,
        duration: timer.getElapsedMs(),
      });

      if (!data.ok) {
        throw await errorFromResponse(data);
      }

      return data;
    } catch (e) {
      if (e instanceof ApplicationError) {
        throw e;
      } else {
        throw new ApplicationError(
          mapServerToMessage(e),
          500,
          headers['X-Correlation-Id'],
        );
      }
    }
  };
}

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

async function errorFromResponse(result: Response) {
  if (result.headers.get('content-type')?.includes('application/json')) {
    const data = await result.json();
    return new ApplicationError(
      mapServerToMessage(data),
      result.status,
      undefined,
      result,
    );
  } else if (result.headers.get('content-type')?.includes('text/html')) {
    return new ApplicationError(
      mapServerToMessage(result.statusText),
      result.status,
      undefined,
      result,
    );
  } else {
    const data = await result.text();
    if (result.status === 401) {
      return new ApplicationError(
        {
          message: ServerText.Endpoints.accessError,
        },
        result.status,
        undefined,
        result,
      );
    }
    return new ApplicationError(
      mapServerToMessage(data),
      result.status,
      undefined,
      result,
    );
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
