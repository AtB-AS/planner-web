import { useEffect, useRef, useState } from 'react';
import DefaultLayout from '@atb/layouts/default';
import { type WithGlobalData } from '@atb/layouts/global-data';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { createWidget, PlannerWebOutput } from '@atb/widget/widget';
import { compressToEncodedURIComponent } from 'lz-string';
import { useTheme } from '@atb/modules/theme';

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

const WidgetPage: NextPage<WithGlobalData<{}>> = ({ ...props }) => {
  const currentUrlBase = 'http://localhost:3000';

  const router = useRouter();
  const [isLoaded, setLoaded] = useState(false);
  const [html, setHtml] = useState('');
  const lib = useRef<PlannerWebOutput | null>(null);

  const theme = useTheme();

  useEffect(() => {
    if (!router.isReady) return; // Wait for the router to be ready

    const { version: versionParam } = router.query; // Access the id from the query
    const version = Array.isArray(versionParam)
      ? versionParam[0]
      : versionParam; // Handle dynamic routes

    if (version) {
      setLoaded(false); // Reset the loading state
      const scriptUrl = `${currentUrlBase}/widget/${compressedOrgId}/${version}/planner-web.umd.js`;

      const loadWidget = () => {
        if (window.PlannerWeb?.createWidget) {
          lib.current = window.PlannerWeb.createWidget({
            urlBase: currentUrlBase,
            language: 'nb',
          });

          setHtml(lib.current.output);
          setLoaded(true);
        } else {
          console.error('PlannerWeb.createWidget is not defined');
        }
      };

      // Dynamically load the script if not already loaded
      const existingScript = document.querySelector(
        `script[src="${scriptUrl}"]`,
      );
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true;
        script.onload = loadWidget;
        document.body.appendChild(script);
      } else {
        loadWidget();
      }
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (html) {
      lib.current?.init();
    }
  }, [html]);

  return (
    <DefaultLayout {...props}>
      <Head>
        <link
          rel="stylesheet"
          href={`${currentUrlBase}/widget/${compressedOrgId}/${router.query.version?.[0]}/planner-web.css`}
        />
        <style>
          {`
          .wrapper {
            background: ${theme.color.background.accent[0].background};
            display: flex;
            justify-content: center;
            padding: 20px 0;
          }
          .widget {
            max-width: 1140px;
            margin: 0 auto;
          }
        `}
        </style>
      </Head>
      <div className="wrapper">
        <div id="planner-widget" className="widget">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
      {!isLoaded && <p>Loading widget...</p>}
    </DefaultLayout>
  );
};

export default WidgetPage;
