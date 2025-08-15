import { useEffect, useRef, useState } from 'react';
import DefaultLayout from '@atb/layouts/default.tsx';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { createWidget, PlannerWebOutput } from '@atb/widget/widget.ts';
import { compressToEncodedURIComponent } from 'lz-string';
import { useTheme } from '@atb/modules/theme';
import {
  getWidgetData,
  PlannerWidgetData,
} from '@atb/page-modules/widget/server';
import { withAccessLogging } from '@atb/modules/logging';

const currentOrg = process.env.NEXT_PUBLIC_PLANNER_ORG_ID;

if (!currentOrg) {
  throw new Error('Missing env NEXT_PUBLIC_PLANNER_ORG_ID');
}

const compressedOrgId = compressToEncodedURIComponent(currentOrg);

declare global {
  interface Window {
    PlannerWeb: {
      createWidget: typeof createWidget;
    };
  }
}

type FullscreenWidgetPagePropsContent = {
  data: PlannerWidgetData;
};
export type FullscreenWidgetPageProps =
  WithGlobalData<FullscreenWidgetPagePropsContent>;

const FullscreenWidgetPage: NextPage<
  WithGlobalData<FullscreenWidgetPageProps>
> = ({ data, ...props }) => {
  const router = useRouter();
  const version = router.query.version?.[0] ?? data.latest.version;
  console.log('version', version);

  const currentUrlBase = 'http://localhost:3000';
  const widgetPath = `${currentUrlBase}/widget/${compressedOrgId}/${version}`;
  const scriptUrl = `${widgetPath}/planner-web.umd.js`;
  const styleUrl = `${widgetPath}/planner-web.css`;

  const [isLoaded, setLoaded] = useState(false);
  const [html, setHtml] = useState('');
  const lib = useRef<PlannerWebOutput | null>(null);

  const theme = useTheme();

  useEffect(() => {
    if (!router.isReady) return;
    setLoaded(false);

    const loadWidget = () => {
      if (window.PlannerWeb?.createWidget) {
        lib.current = window.PlannerWeb.createWidget({
          urlBase: currentUrlBase,
          language: 'nb',
          outputOverrideOptions: {
            layoutMode: 'doubleColumn',
          },
        });

        setHtml(lib.current.output);
        setLoaded(true);
      } else {
        console.error('PlannerWeb.createWidget is not defined');
      }
    };

    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.onload = loadWidget;
      document.body.appendChild(script);
    } else {
      loadWidget();
    }
  }, [router.isReady, router.query, scriptUrl]);

  useEffect(() => {
    if (html) {
      lib.current?.init();
    }
  }, [html]);

  return (
    <DefaultLayout {...props}>
      <Head>
        <link rel="stylesheet" href={styleUrl} />
        <style>
          {`
          .wrapper {
            background: ${theme.color.background.accent[0].background};
            height: 100%;
            position: relative;
            display: grid;
            grid-template-areas:
                'main'
                'alternatives';
          }
          .widget {
            grid-area: main;
            display: grid;
            grid-gap: var(--spacing-x-large);
            width: 100%;
            max-width: var(--maxPageWidth);
            padding: var(--spacing-x-large);
            margin: 0 auto;
          }
        `}
        </style>
      </Head>
      <div className="widgetWrapper">
        <div
          id="planner-widget"
          className="widget"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      {!isLoaded && <p>Loading widget...</p>}
    </DefaultLayout>
  );
};

export default FullscreenWidgetPage;

export const getServerSideProps = withAccessLogging(
  withGlobalData<FullscreenWidgetPagePropsContent>(async function () {
    const data = await getWidgetData();
    return {
      props: {
        data,
      },
    };
  }),
);
