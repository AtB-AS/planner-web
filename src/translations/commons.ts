import { TFunc } from '@leile/lobo-t';

import type { Translatable } from '@leile/lobo-t';

export enum Language {
  Norwegian = 'no',
  English = 'en-US',
  Nynorsk = 'nn',
}
export const appLanguages: readonly Language[] = [
  Language.Norwegian,
  Language.English,
  Language.Nynorsk,
] as const;

export const DEFAULT_LANGUAGE = Language.Norwegian;
export const DEFAULT_LANGUAGE_STRING = 'no';
export const FALLBACK_LANGUAGE = Language.English;
export type TranslatedString = Translatable<typeof Language, string>;

export type TranslateFunction = TFunc<typeof Language>;
export function translation(
  norwegian: string,
  english: string,
  nynorsk: string,
): TranslatedString {
  return {
    [Language.Norwegian]: norwegian,
    [Language.English]: english,
    [Language.Nynorsk]: nynorsk,
  };
}

export function isTranslatedString(a: any): a is TranslatedString {
  return typeof a[Language.Norwegian] !== 'undefined';
}

export type LocalizedString = {
  lang: 'nob' | 'eng' | 'nno';
  value: string;
};
export function convertLocalizedString(
  language: Language,
  localizedStrings: LocalizedString[],
): string | undefined {
  const messageLanguages = {
    nob: 'no',
    eng: 'en-US',
    nno: 'nn',
  };

  return localizedStrings.find((ls) => messageLanguages[ls.lang] === language)
    ?.value;
}
