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

const html = String.raw;
const initializeCode = html`<script>
  window.PlannerWeb.init();
</script>`;
const outputCodeExample = html`<div id="planner-web"></div>
  <script>
    // Basic example of using dynamic output
    document.querySelector('#planner-web').innerHTML = window.PlannerWeb.output;
  </script> `;

const WidgetPage: NextPage<WidgetPageProps> = (props) => {
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
            <h2>Demo</h2>
            <div
              dangerouslySetInnerHTML={{ __html: window.PlannerWeb.output }}
            />

            <h2>Installation</h2>

            <p>
              Install by copying HTML provided below. After loading JS and CSS
              file it can be initialized using the following code:
            </p>
            <CopyMarkup content={initializeCode} />

            <h3>HTML output</h3>
            <CopyMarkupLarge content={window.PlannerWeb.output} />

            <h3>Scripts (UMD / ESM)</h3>

            <p>Using these directly could cause issues on new releases.</p>
            <CopyMarkup content={scripts(window.PlannerWeb.URL_JS_UMD)} />
            <CopyMarkup content={scripts(window.PlannerWeb.URL_JS_ESM)} />

            <h3>Styling</h3>
            <CopyMarkup content={css(window.PlannerWeb.URL_CSS)} />

            <h3>Using dynamic output</h3>

            <p>
              You can also inject HTML automatically by using{' '}
              <code>window.PlannerWeb.output</code> variable. This can be done
              server side or by using client side frameworks.
            </p>

            <p>
              One advantage of doing this dynamically when importing JavaScript
              on the fly, will be that code is automatically updated on new
              releases.
            </p>

            <CopyMarkup content={outputCodeExample} />
          </>
        )}
      </main>
    </DefaultLayout>
  );
};

export default WidgetPage;

export const getServerSideProps = withGlobalData();
