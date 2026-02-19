import { PageText, TranslatedString } from '@atb/translations';

export const getContactPageTitle = (
  subtitle?: TranslatedString,
): TranslatedString[] => {
  return subtitle
    ? [subtitle, PageText.Contact.pageTitle]
    : [PageText.Contact.pageTitle];
};
