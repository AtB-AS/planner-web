import { useLanguageCookie } from '@atb/modules/cookies';
import { getOrgData } from '@atb/modules/org-data';
import { Language } from '@atb/translations';
import { appLanguages, DEFAULT_LANGUAGE } from '@atb/translations/commons';
import { initLobot } from '@leile/lobo-t';
import detectNearestBrowserLocale from 'detect-nearest-browser-locale';
import detectNearestLocale from 'detect-nearest-locale';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

export const lobot = initLobot<typeof Language>(DEFAULT_LANGUAGE);

export const useTranslation = lobot.useTranslation;

const { enabledLanguages } = getOrgData();
// The default language is always enabled, regardless of org config.
const languages = appLanguages.filter(
  (l) =>
    l === DEFAULT_LANGUAGE || !enabledLanguages || enabledLanguages.includes(l),
);

function useSelectedLanguage(
  onServerside: Language,
): [Language, (lang: Language) => void] {
  const [selectedLanguage, setLanguageInternal] = useLanguageCookie();

  // Get potential preferred language from browser.
  const preferredLanguage = usePreferredBrowserLanguage(onServerside);

  const lang =
    typeof selectedLanguage !== 'undefined'
      ? mapLanguageStringToEnum(selectedLanguage)
      : preferredLanguage;

  function setLanguage(newLang: Language) {
    return setLanguageInternal(newLang.toString());
  }

  return [lang, setLanguage];
}

function mapLanguageStringToEnum(language: string | undefined): Language {
  return languages.find((l) => l === language) ?? DEFAULT_LANGUAGE;
}

type LanguageState = {
  setLanguage: (value: Language) => void;
  language: Language;
  languages: readonly Language[];
};

const LanguageContext = createContext<LanguageState>({
  setLanguage() {},
  language: DEFAULT_LANGUAGE,
  languages,
});

export type AppLanguageProviderProps = PropsWithChildren<{
  serverAcceptLanguage: string;
}>;
export default function AppLanguageProvider({
  children,
  serverAcceptLanguage,
}: AppLanguageProviderProps) {
  const fromHeaders = getLocalesFromAcceptLanguage(serverAcceptLanguage);
  const [language, setLanguage] = useSelectedLanguage(fromHeaders);

  return (
    <LanguageContext.Provider value={{ setLanguage, language, languages }}>
      <lobot.LanguageProvider value={language}>
        {children}
      </lobot.LanguageProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguageSettings() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      setLanguage() {},
      language: DEFAULT_LANGUAGE,
      languages,
    };
  }
  return context;
}

export function getLocalesFromAcceptLanguage(headerStr: string) {
  const preferred =
    headerStr?.split(',').map((type) => type.split(';')[0].trim()) ?? [];
  const selected = detectNearestLocale(languages, preferred);
  return mapLanguageStringToEnum(selected);
}

// Get language from browser, if in browser environment.
function usePreferredBrowserLanguage(onServerside: Language) {
  const [preferredLanguage, setPreferredLanguage] =
    useState<Language>(onServerside);

  const deps =
    typeof window !== 'undefined' && 'lanuage' in window.navigator
      ? navigator.language
      : '';

  useEffect(
    function () {
      if (typeof window === 'undefined') return;
      const defaultLocale = detectNearestBrowserLocale(languages);
      const selectedLanguage = mapLanguageStringToEnum(defaultLocale);

      setPreferredLanguage(selectedLanguage);
    },
    [deps],
  );

  return preferredLanguage;
}
