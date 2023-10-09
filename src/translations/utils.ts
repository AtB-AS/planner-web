import { currentOrg, type WEBSHOP_ORGS } from '@atb/modules/org-data';
import merge from 'lodash/merge';

import { Language } from './commons';
import { LanguageAndTextLanguagesEnum, LanguageAndTextType } from './types';

export type LanguageOverrides<T> = {
  [P in keyof T]?: LanguageOverrides<T[P]>;
};
export function orgSpecificTranslations<T>(
  translationTexts: T,
  overrides: Partial<{ [org in WEBSHOP_ORGS]: LanguageOverrides<T> }>,
  orgId: WEBSHOP_ORGS = currentOrg,
) {
  return merge({}, translationTexts, overrides[orgId]);
}

/**
 * Get the text in the requested language. If the requested translation isn't
 * found, it will fall back to Bokmål/Norwegian. If no known translation is
 * found, the first text in the provided texts array is returned.
 */
export const getTextForLanguage = (
  texts: LanguageAndTextType[] | undefined,
  language: Language,
): string | undefined => {
  if (language === Language.English) {
    const englishText = texts?.find(
      (t) =>
        getLanguage(t) === LanguageAndTextLanguagesEnum.eng ||
        getLanguage(t) === LanguageAndTextLanguagesEnum.en,
    );
    if (englishText?.value) return englishText.value;
  }
  if (language === Language.Nynorsk) {
    const nynorskText = texts?.find(
      (t) =>
        getLanguage(t) === LanguageAndTextLanguagesEnum.nno ||
        getLanguage(t) === LanguageAndTextLanguagesEnum.nn,
    );
    if (nynorskText?.value) return nynorskText.value;
  }
  const norwegianText = texts?.find(
    (t) =>
      getLanguage(t) === LanguageAndTextLanguagesEnum.nor ||
      getLanguage(t) === LanguageAndTextLanguagesEnum.nob ||
      getLanguage(t) === LanguageAndTextLanguagesEnum.no,
  );
  if (norwegianText?.value) return norwegianText.value;

  return texts?.[0]?.value;
};

const getLanguage = (lv: LanguageAndTextType) =>
  'lang' in lv ? lv.lang : lv.language;
