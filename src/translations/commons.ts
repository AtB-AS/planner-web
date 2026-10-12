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
export function translation(invariant: string): TranslatedString;
export function translation(
  norwegian: string,
  english: string,
  nynorsk: string,
): TranslatedString;
export function translation(
  norwegianOrInvariant: string,
  english?: string,
  nynorsk?: string,
): TranslatedString {
  return {
    [Language.Norwegian]: norwegianOrInvariant,
    [Language.English]: english ?? norwegianOrInvariant,
    [Language.Nynorsk]: nynorsk ?? norwegianOrInvariant,
  };
}

export function isTranslatedString(a: any): a is TranslatedString {
  return typeof a[Language.Norwegian] !== 'undefined';
}
