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

import { getWidgetData } from '@atb/page-modules/widget/server/data';
import type { createWidget, PlannerWebOutput } from '@atb/widget/widget';

import style from '@atb/page-modules/widget/widget.module.css';
import { Language, useTranslation } from '@atb/translations';
import { formatToLongDateTime } from '@atb/utils/date';

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

        {isLoaded && lib.current && (
          <WidgetContent html={html} lib={lib.current} data={data} />
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

function WidgetContent({
  html,
  lib,
  data,
}: {
  html: string;
  lib: PlannerWebOutput;
  data: PlannerWidgetData;
}) {
  const { language } = useTranslation();
  const scripts = (str?: string) => `<script src="${str ?? ''}" />`;
  const css = (str?: string) => `<link src="${str ?? ''}" />`;

  const currentUrlBase = location.protocol + '//' + location.host;

  return (
    <div>
      <h2>Demo</h2>
      <div dangerouslySetInnerHTML={{ __html: html }} />

      <h2>Installation (latest version v{data.latest.version})</h2>

      <p>
        Install by copying HTML provided below. After loading JS and CSS file it
        can be initialized using the following code:
      </p>
      <CopyMarkup content={initializeCode} />

      <h3>HTML output</h3>
      <CopyMarkupLarge content={html} />

      <h3>Scripts (UMD / ESM)</h3>

      <p>Using these directly could cause issues on new releases.</p>
      <CopyMarkup content={scripts(lib.urls?.URL_JS_UMD)} />
      <CopyMarkup content={scripts(lib.urls?.URL_JS_ESM)} />

      <h3>Styling</h3>
      <CopyMarkup content={css(lib.urls?.URL_CSS)} />

      <h3>Using dynamic output</h3>

      <p>
        You can also inject HTML automatically by using{' '}
        <code>widget.output</code> property. This can be done server side or by
        using client side frameworks.
      </p>

      <p>
        One advantage of doing this dynamically when importing JavaScript on the
        fly, will be that code is automatically updated on new releases.
      </p>

      <CopyMarkup content={outputCodeExample} />

      <h2>All versions</h2>

      <p>
        <a href="https://github.com/AtB-AS/planner-web/releases">
          Read changelog for more information about changes between versions
        </a>
        .
      </p>

      {data.all.map((mod) => (
        <div key={mod.version}>
          <details>
            <summary>
              <h3>
                {mod.version} (Created{' '}
                {formatToLongDateTime(mod.created, language)})
              </h3>
            </summary>

            <div>
              <CopyMarkup content={scripts(currentUrlBase + mod.urls.umd)} />
              <CopyMarkup content={scripts(currentUrlBase + mod.urls.esm)} />
              <CopyMarkup content={css(currentUrlBase + mod.urls.css)} />

              <p>
                <a
                  href={`https://github.com/AtB-AS/planner-web/releases/tag/v${mod.version}`}
                >
                  See changelog
                </a>
              </p>
            </div>
          </details>
        </div>
      ))}
    </div>
  );
}
