import { getCookie, setCookie } from 'cookies-next';
import { addDays } from 'date-fns';
import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  DARKMODE_COOKIE_NAME,
  LANGUAGE_COOKIE_NAME,
  SETTINGS_STORETIME_DAYS,
} from './constants';

export type AppCookiesContextState = {
  darkmode: [boolean | undefined, (val: boolean) => void];
  language: [string | undefined, (val: string) => void];
};

const CookiesContext = createContext<AppCookiesContextState | undefined>(
  undefined,
);

export type InitialCookieData = {
  darkmode: boolean | null;
  language: string | null;
};

export type AppCookiesProviderProps = PropsWithChildren<{
  initialCookies: InitialCookieData;
}>;

export function AppCookiesProvider({
  children,
  initialCookies,
}: AppCookiesProviderProps) {
  const language = useCookie<string>(
    LANGUAGE_COOKIE_NAME,
    initialCookies.language ?? undefined,
    (i) => String(i ?? ''),
  );
  const darkmode = useCookie<boolean>(
    DARKMODE_COOKIE_NAME,
    initialCookies.darkmode ?? undefined,
    (i) => (typeof i === 'string' ? i === 'true' : i === true),
  );

  return (
    <CookiesContext.Provider value={{ language, darkmode }}>
      {children}
    </CookiesContext.Provider>
  );
}

export function useCookieSettings() {
  const context = useContext(CookiesContext);
  return context;
}
export function useDarkmodeCookie() {
  const ctx = useCookieSettings();
  return ctx?.darkmode ?? [undefined, () => {}];
}
export function useLanguageCookie() {
  const ctx = useCookieSettings();
  return ctx?.language ?? [undefined, () => {}];
}

function useCookie<T extends string | number | boolean>(
  key: string,
  initialValue: T | undefined,
  mapper: (val: string | boolean | null | undefined) => T,
): [T | undefined, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T | undefined>(initialValue);

  useEffect(() => {
    async function getData() {
      try {
        const data = await getCookie(key);
        if (typeof data !== 'undefined') {
          setStoredValue(mapper(data));
        }
      } catch (e) {
        console.warn('Failed to load cookie:', key, e);
      }
    }

    getData();
  }, [key, mapper]);

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);

        if (typeof window !== 'undefined') {
          setCookie(key, value, {
            expires: addDays(new Date(), SETTINGS_STORETIME_DAYS),
            path: '/',
            sameSite: 'lax',
            secure: process.env.NEXT_PUBLIC_COOKIE_SECURE === 'true',
          });
        }
      } catch (error) {}
    },
    [key],
  );
  return [storedValue, setValue];
}
