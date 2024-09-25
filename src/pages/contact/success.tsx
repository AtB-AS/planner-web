import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import { SuccessContent } from '@atb/page-modules/contact/success-content/success-content';

import { NextPage } from 'next';

export type ContactSuccessPageProps = WithGlobalData<{}>;

const ContactSuccessPage: NextPage<ContactSuccessPageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <SuccessContent />
    </DefaultLayout>
  );
};

export default ContactSuccessPage;

export const getServerSideProps = withGlobalData();
