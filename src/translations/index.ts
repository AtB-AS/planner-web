export type { TranslateFunction, TranslatedString } from './commons';
export {
  Language,
  DEFAULT_LANGUAGE,
  DEFAULT_LANGUAGE_STRING,
  appLanguages,
  translation,
} from './commons';

export {
  default as AppLanguageProvider,
  useTranslation,
  useLanguageSettings,
} from './language-context';

export * as CommonText from './common';
export * as ServerText from './server';
export * as ComponentText from './components';
export * as PageText from './pages';
export * as ModuleText from './modules';
