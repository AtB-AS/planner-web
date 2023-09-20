import { ServerText, TranslatedString } from '@atb/translations';

export const swrFetcher = async (url: string) => {
  const res = await fetch(url);
  return fetchErrorHandler<any>(res);
};

async function fetchErrorHandler<T>(res: Response) {
  if (!res.ok) {
    const data = await responseToDataResponse(res);
    const error = new ClientTranslatedError(data.translatedText, res.status);
    throw error;
  }

  return (await res.json()) as T;
}

type MessagedResponse = {
  message: TranslatedString;
};
function isMessagedResponse(res: any): res is MessagedResponse {
  return 'message' in res;
}

export class ClientTranslatedError extends Error {
  translatedString: TranslatedString;
  statusCode: number;
  constructor(translatedString: TranslatedString, statusCode: number) {
    super();
    this.translatedString = translatedString;
    this.message = translatedString['en-US'];
    this.statusCode = statusCode;
  }
}

async function responseToDataResponse(result: Response) {
  if (result.headers.get('Content-Type')?.includes('application/json')) {
    const data = await result.json();

    if (!isMessagedResponse(data)) {
      return {
        status: 500,
        ok: false,
        translatedText: ServerText.Endpoints.serverError,
      };
    }

    return {
      status: result.status,
      ok: result.ok,
      translatedText: data.message,
    };
  } else {
    const data = await result.text();
    return {
      status: result.status,
      ok: false,
      translatedText: ServerText.Endpoints.serverErrorGeneric(data),
    };
  }
}
