import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, type WithGlobalData } from '@atb/layouts/global-data';
import type { NextPage } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import { useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import markup from 'react-syntax-highlighter/dist/cjs/languages/prism/markup';
import dark from 'react-syntax-highlighter/dist/cjs/styles/prism/dracula';
SyntaxHighlighter.registerLanguage('markup', markup);

export type WidgetPageProps = WithGlobalData<{}>;

declare global {
  interface Window {
    PlannerWeb: {
      output: string;
      init(): void;
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
          setTimeout(() => {
            window.PlannerWeb.init();
          }, 100);
        }}
      />

      <h1>Widget</h1>

      {isLoaded && (
        <>
          <details>
            <summary>HTML Code</summary>

            <div>
              <CopyButton text={window.PlannerWeb.output} />
            </div>
            {/* eslint-disable-next-line */}
            <SyntaxHighlighter language="markup" style={dark}>
              {window.PlannerWeb.output}
            </SyntaxHighlighter>
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

function CopyButton({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false);

  async function copy(str: string) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(str);
    } else {
      return document.execCommand('copy', true, str);
    }
  }

  const handleClick = async () => {
    try {
      await copy(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button onClick={handleClick}>{isCopied ? 'Copied 👍' : 'Copy'}</button>
  );
}
