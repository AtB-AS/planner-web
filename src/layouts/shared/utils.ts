import {
  CommonText,
  TranslatedString,
  useTranslation,
} from '@atb/translations';
import { isTranslatedString } from '@atb/translations/commons';

export function usePageTitle(
  title: TranslatedString | TranslatedString[] | string | undefined,
) {
  const { t } = useTranslation();
  const siteTitle = t(CommonText.Titles.siteTitle);
  if (!title) {
    return siteTitle;
  }

  let path: string[] = [];
  if (Array.isArray(title)) {
    path = title.map(t);
  } else if (isTranslatedString(title)) {
    path = [t(title)];
  } else if (typeof title === 'string') {
    path = [title];
  }

  return [...path, siteTitle].join(' - ');
}
