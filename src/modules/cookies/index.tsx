import { IncomingHttpHeaders } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import { DARKMODE_COOKIE_NAME, LANGUAGE_COOKIE_NAME } from './constants';
import { InitialCookieData } from './cookies-context';

export {
  AppCookiesProvider,
  useCookieSettings,
  useDarkmodeCookie,
  useLanguageCookie,
} from './cookies-context';

export type { InitialCookieData };

export type GlobalCookiesData = {
  initialCookies: InitialCookieData;
  headersAcceptLanguage: string;
  referer: string;
};
export function getGlobalCookies(req?: {
  cookies: NextApiRequestCookies;
  headers: IncomingHttpHeaders;
}): GlobalCookiesData {
  return {
    initialCookies: {
      darkmode:
        typeof req?.cookies[DARKMODE_COOKIE_NAME] === 'undefined'
          ? null
          : req.cookies[DARKMODE_COOKIE_NAME] == 'true',
      language: req?.cookies[LANGUAGE_COOKIE_NAME] ?? null,
    },
    headersAcceptLanguage: req?.headers['accept-language'] ?? '',
    referer: req?.headers.referer ?? '',
  };
}
