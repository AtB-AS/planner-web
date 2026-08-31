import { OpenGraphBase } from '@atb/components/open-graph';
import Footer from '@atb/layouts/shared/footer';
import PageHeader from '@atb/layouts/shared/page-header';
import { usePageTitle } from '@atb/layouts/shared/utils';
import { getOrgData } from '@atb/modules/org-data';
import { useHtmlDarkMode, useTheme } from '@atb/modules/theme';
import {
  CommonText,
  Language,
  TranslatedString,
  useTranslation,
} from '@atb/translations';
import Head from 'next/head';
import { PropsWithChildren } from 'react';
import style from './base.module.css';
import { I18nProvider } from 'react-aria-components';

export type BaseLayoutProps = PropsWithChildren<{
  title?: TranslatedString | TranslatedString[] | string;
}>;

export function BaseLayout({ children, title }: BaseLayoutProps) {
  useHtmlDarkMode();
  const theme = useTheme();
  const { t, language } = useTranslation();

  const siteTitle = usePageTitle(title);

  const iosAppId = getIosAppId();

  // Used for calendars and date pickers, transform to locale supported by react-aria.
  const i18nLocale = language === Language.English ? 'en-GB' : 'nb-NO';

  return (
    <I18nProvider locale={i18nLocale}>
      <div className={style.wrapper}>
        <Head>
          <title>{siteTitle}</title>
          <meta
            name="description"
            content={t(CommonText.Layout.meta.defaultDescription)}
          />
          <link rel="icon" href="/assets/colors/icons/favicon.svg" />
          <meta
            name="theme-color"
            content={theme.color.background.accent[0].background}
          />
          {iosAppId && (
            <meta name="apple-itunes-app" content={`app-id=${iosAppId}`} />
          )}
        </Head>
        <OpenGraphBase title={siteTitle} />
        <a href="#main-content" className={style.skipLink}>
          {t(CommonText.Layout.skipToContent)}
        </a>
        <PageHeader />
        <main id="main-content" tabIndex={-1} className={style.main}>
          {children}
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}

const getIosAppId = () => {
  const iosAppUrl = getOrgData().urls.iosAppUrl?.default;
  return iosAppUrl?.match(/\/id(\d+)/)?.[1];
};
