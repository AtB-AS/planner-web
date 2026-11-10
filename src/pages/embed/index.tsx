import DefaultLayout from '@atb/layouts/default';
import { EmbedDocs, type EmbedDocsProps } from '@atb/page-modules/embed/docs';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';
import { withAccessLogging } from '@atb/modules/logging';
import type { NextPage } from 'next';

export type EmbedDocsPageProps = WithGlobalData<EmbedDocsProps>;

const EmbedDocsPage: NextPage<EmbedDocsPageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <EmbedDocs urlBase={props.urlBase} />
    </DefaultLayout>
  );
};

export default EmbedDocsPage;

export const getServerSideProps = withAccessLogging(
  withGlobalData<EmbedDocsProps>(async function (context) {
    const urlBase = `${context.req.headers['x-forwarded-proto'] ?? 'http'}://${context.req.headers.host}`;
    return { props: { urlBase } };
  }),
);
