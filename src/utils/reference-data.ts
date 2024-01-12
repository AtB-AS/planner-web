import { Language, getTextForLanguage } from '@atb/translations';
import { LanguageAndTextType } from '@atb/translations/types';

/**
 * Wrapper for getting the name of a NeTeX entity in the given language.
 *
 * The name should always be present, however we fall back to "Unknown" so we
 * don't get any unexpected errors in the code. If we actually end up getting
 * "Unknown" somewhere in the app it should be fixed by updating the reference
 * data source.
 */
export const getReferenceDataName = <
  T extends {
    name: LanguageAndTextType;
    alternativeNames?: LanguageAndTextType[];
  },
>(
  { name, alternativeNames }: T,
  language: Language,
): string =>
  getTextForLanguage([name, ...(alternativeNames || [])], language) ||
  'Unknown';
