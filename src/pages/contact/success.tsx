import DefaultLayout from '@atb/layouts/default';
import { SuccessContent } from '@atb/page-modules/contact/success-content/success-content';

import { NextPage } from 'next';
import { withAccessLogging } from '@atb/modules/logging';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';
import { getContactPageTitle } from '@atb/page-modules/contact/utils';

export type ContactSuccessPageProps = WithGlobalData<{}>;

const ContactSuccessPage: NextPage<ContactSuccessPageProps> = (props) => {
  return (
    <DefaultLayout {...props} title={getContactPageTitle()}>
      <SuccessContent />
    </DefaultLayout>
  );
};

export default ContactSuccessPage;

export const getServerSideProps = withAccessLogging(withGlobalData());
