import { useHtmlDarkMode, useTheme } from '@atb/modules/theme';
import {
  CommonText,
  Language,
  TranslatedString,
  useLanguageSettings,
  useTranslation,
} from '@atb/translations';
import Head from 'next/head';
import { PropsWithChildren } from 'react';

export type BaseLayoutProps = PropsWithChildren<{
  title?: TranslatedString;
}>;
export function BaseLayout({ children, title }: BaseLayoutProps) {
  useHtmlDarkMode();
  const theme = useTheme();
  const { t } = useTranslation();

  const siteTitle = usePageTitle(title);
  const { language, languages, setLanguage } = useLanguageSettings();

  return (
    <div>
      <div>
        <Head>
          <title>{siteTitle}</title>
          <meta
            name="description"
            content={t(CommonText.Layout.meta.defaultDescription)}
          />
          <meta
            name="theme-color"
            content={theme.static.background.background_1.background}
          />
        </Head>

        <main>{children}</main>

        <hr />

        <form>
          <select
            name="language"
            onChange={(e) =>
              setLanguage(e.currentTarget.value as unknown as Language)
            }
            value={language}
          >
            {languages.map((lang) => (
              <option value={lang} key={lang}>
                {lang}
              </option>
            ))}
          </select>
        </form>
      </div>
    </div>
  );
}

function usePageTitle(title: TranslatedString | undefined): string {
  const { t } = useTranslation();
  const siteTitle = t(CommonText.Titles.siteTitle);
  if (!title) {
    return siteTitle;
  }

  return `${t(title)} - ${siteTitle}`;
}
