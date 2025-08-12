import DefaultLayout from '@atb/layouts/default';
import { ErrorContent } from '@atb/page-modules/contact/error-content/error-content';

import { NextPage } from 'next';
import { withAccessLogging } from '@atb/modules/logging';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';
import { getContactPageTitle } from '@atb/page-modules/contact/utils';

export type ContactErrorPageProps = WithGlobalData<{}>;

const ContactErrorPage: NextPage<ContactErrorPageProps> = (props) => {
  return (
    <DefaultLayout {...props} title={getContactPageTitle()}>
      <ErrorContent />
    </DefaultLayout>
  );
};

export default ContactErrorPage;

export const getServerSideProps = withAccessLogging(withGlobalData());
