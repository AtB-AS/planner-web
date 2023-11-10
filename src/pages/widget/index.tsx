import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, type WithGlobalData } from '@atb/layouts/global-data';
import type { NextPage } from 'next';
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
          <code>{window.PlannerWeb.output}</code>
          <div dangerouslySetInnerHTML={{ __html: window.PlannerWeb.output }} />
        </>
      )}
    </DefaultLayout>
  );
};

export default AssistantPage;

export const getServerSideProps = withGlobalData();
