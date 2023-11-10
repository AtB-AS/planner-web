import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, type WithGlobalData } from '@atb/layouts/global-data';
import type { NextPage } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import { useState } from 'react';

export type WidgetPageProps = WithGlobalData<{}>;

declare global {
  interface Window {
    PlannerWeb: {
      output: string;
    };
  }
}
const AssistantPage: NextPage<WidgetPageProps> = (props) => {
  const [isLoaded, setLoaded] = useState(false);
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

          console.log(window.PlannerWeb);
        }}
      />

      <h1>Widget</h1>

      {isLoaded && (
        <>
          <details>
            <code>{window.PlannerWeb.output}</code>
          </details>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div
              dangerouslySetInnerHTML={{ __html: window.PlannerWeb.output }}
            />
          </div>
        </>
      )}
    </DefaultLayout>
  );
};

export default AssistantPage;

export const getServerSideProps = withGlobalData();
