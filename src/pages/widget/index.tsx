import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, type WithGlobalData } from '@atb/layouts/global-data';
import { CopyMarkup, CopyMarkupLarge } from '@atb/page-modules/widget';
import type { NextPage } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import { useState } from 'react';

import style from '@atb/page-modules/widget/widget.module.css';

export type WidgetPageProps = WithGlobalData<{}>;

declare global {
  interface Window {
    PlannerWeb: {
      output: string;
      URL_JS_UMD: string;
      URL_JS_ESM: string;
      URL_CSS: string;
      init(): void;
    };
  }
}
const AssistantPage: NextPage<WidgetPageProps> = (props) => {
  const [isLoaded, setLoaded] = useState(false);

  const scripts = (str: string) => `<script src="${str}" />`;
  const css = (str: string) => `<link src="${str}" />`;

  return (
    <DefaultLayout {...props}>
      <Head>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/widget/style.css" />
      </Head>
      <Script
        src="/widget/planner-web.umd.js"
        strategy="lazyOnload"
        onLoad={() => {
          setLoaded(true);
          setTimeout(() => {
            window.PlannerWeb.init();
          }, 100);
        }}
      />

      <main className={style.main}>
        <h1>Widget documentation</h1>

        {!isLoaded && <p>Loading...</p>}

        {isLoaded && (
          <>
            <h3>Scripts (UMD / ESM)</h3>
            <CopyMarkupLarge content={window.PlannerWeb.output} />

            <h3>Scripts (UMD / ESM)</h3>
            <CopyMarkup content={scripts(window.PlannerWeb.URL_JS_UMD)} />
            <CopyMarkup content={scripts(window.PlannerWeb.URL_JS_ESM)} />

            <h3>Styling</h3>
            <CopyMarkup content={css(window.PlannerWeb.URL_CSS)} />

            <h2>Demo</h2>
            <div
              dangerouslySetInnerHTML={{ __html: window.PlannerWeb.output }}
            />
          </>
        )}
      </main>
    </DefaultLayout>
  );
};

export default AssistantPage;

export const getServerSideProps = withGlobalData();
