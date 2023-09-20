import {useLanguageCookie} from '@atb/modules/cookies';
import {Language} from '@atb/translations';
import {appLanguages, DEFAULT_LANGUAGE} from '@atb/translations/commons';
import {initLobot} from '@leile/lobo-t';
import detectNearestBrowserLocale from 'detect-nearest-browser-locale';
import detectNearestLocale from 'detect-nearest-locale';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export const lobot = initLobot<typeof Language>(DEFAULT_LANGUAGE);

export const useTranslation = lobot.useTranslation;

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
  if (language == Language.English) {
    return Language.English;
  }
  if (language == Language.Norwegian) {
    return Language.Norwegian;
  }
  if (language == Language.Nynorsk) {
    return Language.Nynorsk;
  }
  return DEFAULT_LANGUAGE;
}

type LanguageState = {
  setLanguage: (value: Language) => void;
  toggleLanguage: () => void;
  language: Language;
  languages: readonly Language[];
};

const LanguageContext = createContext<LanguageState>({
  setLanguage() {},
  toggleLanguage() {},
  language: DEFAULT_LANGUAGE,
  languages: appLanguages,
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

  const toggleLanguage = useCallback(() => {
    if (language == Language.English) {
      setLanguage(Language.Norwegian);
    } else {
      setLanguage(Language.English);
    }
  }, [language, setLanguage]);

  return (
    <LanguageContext.Provider
      value={{toggleLanguage, setLanguage, language, languages: appLanguages}}
    >
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
      toggleLanguage() {},
      language: DEFAULT_LANGUAGE,
      languages: appLanguages,
    };
  }
  return context;
}

export function getLocalesFromAcceptLanguage(headerStr: string) {
  const preferred =
    headerStr?.split(',').map((type) => type.split(';')[0].trim()) ?? [];
  const selected = detectNearestLocale(appLanguages, preferred);
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
      const defaultLocale = detectNearestBrowserLocale(appLanguages);
      const selectedLanguage = mapLanguageStringToEnum(defaultLocale);

      setPreferredLanguage(selectedLanguage);
    },
    [deps],
  );

  return preferredLanguage;
}
