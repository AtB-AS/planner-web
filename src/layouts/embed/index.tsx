import { type WithGlobalData } from '@atb/modules/global-data';
import { AppCookiesProvider } from '@atb/modules/cookies';
import { usePageTitle } from '@atb/layouts/shared/utils';
import { useHtmlDarkMode } from '@atb/modules/theme';
import {
  AppLanguageProvider,
  Language,
  TranslatedString,
  useTranslation,
} from '@atb/translations';
import Head from 'next/head';
import { PropsWithChildren } from 'react';
import style from './embed.module.css';
import { I18nProvider } from 'react-aria-components';

type EmbedLayoutProps = PropsWithChildren<{
  title?: TranslatedString | TranslatedString[] | string;
}> &
  WithGlobalData<{}>;

// Minimal layout for pages embedded on external sites (e.g. in an iframe).
// No page header, footer or global messages.
function EmbedLayout({
  initialCookies,
  headersAcceptLanguage,
  ...pageProps
}: EmbedLayoutProps) {
  return (
    <AppCookiesProvider initialCookies={initialCookies}>
      <AppLanguageProvider serverAcceptLanguage={headersAcceptLanguage}>
        <EmbedBaseLayout {...pageProps} />
      </AppLanguageProvider>
    </AppCookiesProvider>
  );
}

function EmbedBaseLayout({
  children,
  title,
}: PropsWithChildren<{
  title?: TranslatedString | TranslatedString[] | string;
}>) {
  useHtmlDarkMode();
  const { language } = useTranslation();
  const siteTitle = usePageTitle(title);

  // Used for calendars and date pickers, transform to locale supported by react-aria.
  const i18nLocale = language === Language.English ? 'en-GB' : 'nb-NO';

  return (
    <I18nProvider locale={i18nLocale}>
      <Head>
        <title>{siteTitle}</title>
        <link rel="icon" href="/assets/colors/icons/favicon.svg" />
        {/* Only meant to be shown embedded, not as standalone search results. */}
        <meta name="robots" content="noindex" />
      </Head>
      <main className={style.main}>{children}</main>
    </I18nProvider>
  );
}

export default EmbedLayout;
