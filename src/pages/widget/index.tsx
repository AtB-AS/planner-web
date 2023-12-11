import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, type WithGlobalData } from '@atb/layouts/global-data';
import {
  CopyMarkup,
  CopyMarkupLarge,
  type PlannerWidgetData,
} from '@atb/page-modules/widget';
import type { NextPage } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

import type { createWidget, PlannerWebOutput } from '@atb/widget/widget';
import { getWidgetData } from '@atb/page-modules/widget/server/data';

import style from '@atb/page-modules/widget/widget.module.css';

type WidgetPagePropsContent = {
  data: PlannerWidgetData;
};
export type WidgetPageProps = WithGlobalData<WidgetPagePropsContent>;

declare global {
  interface Window {
    PlannerWeb: {
      createWidget: typeof createWidget;
    };
  }
}

const html = String.raw;
const initializeCode = html`
  <script>
    // Ensure that url base is same origin as the page where widget is loaded and the travel planner API
    const widget = window.PlannerWeb.createWidget({
      urlBase: 'https://reiseplanlegger.example.no/',
    });

    // After loading JS and CSS file it can be initialized using the following code:
    widget.init();
  </script>
`;
const outputCodeExample = html`
  <div id="planner-web"></div>
  <script>
    // Basic example of using dynamic output
    document.querySelector('#planner-web').innerHTML = widget.output;

    // And URLs to JS and CSS files:
    widget.urls;
    // Example for URL_JS_UMD:
    widget.urls.URL_JS_UMD;
  </script>
`;

const WidgetPage: NextPage<WidgetPageProps> = ({ data, ...props }) => {
  const [isLoaded, setLoaded] = useState(false);
  const [html, setHtml] = useState('');
  const lib = useRef<PlannerWebOutput | null>(null);

  const scripts = (str?: string) => `<script src="${str ?? ''}" />`;
  const css = (str?: string) => `<link src="${str ?? ''}" />`;

  useEffect(() => {
    if (html) {
      lib.current?.init();
    }
  }, [html]);

  return (
    <DefaultLayout {...props}>
      <Head>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href={data.latest.urls.css} />
      </Head>
      <Script
        src={data.latest.urls.umd}
        strategy="lazyOnload"
        onLoad={() => {
          setLoaded(true);
          setTimeout(() => {
            lib.current = window.PlannerWeb.createWidget({
              urlBase: location.protocol + '//' + location.host,
            });

            setHtml(lib.current.output);
          }, 100);
        }}
      />

      <main className={style.main}>
        <h1>Widget documentation</h1>

        {!isLoaded && <p>Loading...</p>}

        {isLoaded && (
          <>
            <h2>Demo</h2>
            <div dangerouslySetInnerHTML={{ __html: html }} />

            <h2>Installation (newest version)</h2>

            <p>
              Install by copying HTML provided below. After loading JS and CSS
              file it can be initialized using the following code:
            </p>
            <CopyMarkup content={initializeCode} />

            <h3>HTML output</h3>
            <CopyMarkupLarge content={html} />

            <h3>Scripts (UMD / ESM)</h3>

            <p>Using these directly could cause issues on new releases.</p>
            <CopyMarkup content={scripts(lib.current?.urls?.URL_JS_UMD)} />
            <CopyMarkup content={scripts(lib.current?.urls?.URL_JS_ESM)} />

            <h3>Styling</h3>
            <CopyMarkup content={css(lib.current?.urls?.URL_CSS)} />

            <h3>Using dynamic output</h3>

            <p>
              You can also inject HTML automatically by using{' '}
              <code>widget.output</code> property. This can be done server side
              or by using client side frameworks.
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

export const getServerSideProps = withGlobalData<WidgetPagePropsContent>(
  async function () {
    const data = await getWidgetData();

    return {
      props: {
        data,
      },
    };
  },
);
