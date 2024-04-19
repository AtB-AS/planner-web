import { OpenGraphBase } from '@atb/components/open-graph';
import Footer from '@atb/layouts/shared/footer';
import PageHeader from '@atb/layouts/shared/page-header';
import { usePageTitle } from '@atb/layouts/shared/utils';
import { useHtmlDarkMode, useTheme } from '@atb/modules/theme';
import {
  CommonText,
  TranslatedString,
  useTranslation,
} from '@atb/translations';
import Head from 'next/head';
import { PropsWithChildren } from 'react';
import style from './base.module.css';

export type BaseLayoutProps = PropsWithChildren<{
  title?: TranslatedString | string;
}>;

export function BaseLayout({ children, title }: BaseLayoutProps) {
  useHtmlDarkMode();
  const theme = useTheme();
  const { t } = useTranslation();

  const siteTitle = usePageTitle(title);

  return (
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
          content={theme.static.background.background_1.background}
        />
      </Head>

      <OpenGraphBase title={siteTitle} />

      <PageHeader />

      <main className={style.main}>{children}</main>

      <Footer />
    </div>
  );
}
