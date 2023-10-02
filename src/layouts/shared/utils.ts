import {CommonText, TranslatedString, useTranslation} from '@atb/translations';
import {isTranslatedString} from '@atb/translations/commons';

export function usePageTitle(title: TranslatedString | string | undefined) {
  const {t} = useTranslation();
  const siteTitle = t(CommonText.Titles.siteTitle);
  if (!title) {
    return siteTitle;
  }

  if (isTranslatedString(title)) {
    return `${t(title)} - ${siteTitle}`;
  }

  return `${title} - ${siteTitle}`;
}
