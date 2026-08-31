import { PageText, TranslatedString } from '@atb/translations';

export const getContactPageTitle = (
  subtitle?: TranslatedString,
): TranslatedString[] => {
  return subtitle
    ? [subtitle, PageText.Contact.pageTitle]
    : [PageText.Contact.pageTitle];
};

export const shouldShowContactPage = (): boolean =>
  !!process.env.NEXT_PUBLIC_CONTACT_API_URL;
