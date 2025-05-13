import { OpenGraphBase } from '@atb/components/open-graph';
import Footer from '@atb/layouts/shared/footer';
import PageHeader from '@atb/layouts/shared/page-header';
import { usePageTitle } from '@atb/layouts/shared/utils';
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
  title?: TranslatedString | string;
}>;

export function BaseLayout({ children, title }: BaseLayoutProps) {
  useHtmlDarkMode();
  const theme = useTheme();
  const { t, language } = useTranslation();

  const siteTitle = usePageTitle(title);

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
        </Head>
        <OpenGraphBase title={siteTitle} />
        <PageHeader />
        <main className={style.main}>{children}</main>
        <Footer />
      </div>
    </I18nProvider>
  );
}
