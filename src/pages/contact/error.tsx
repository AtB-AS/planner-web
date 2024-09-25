import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import { ErrorContent } from '@atb/page-modules/contact/error-content/error-content';

import { NextPage } from 'next';

export type ContactErrorPageProps = WithGlobalData<{}>;

const ContactErrorPage: NextPage<ContactErrorPageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <ErrorContent />
    </DefaultLayout>
  );
};

export default ContactErrorPage;

export const getServerSideProps = withGlobalData();
