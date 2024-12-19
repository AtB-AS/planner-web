import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import { NextPage } from 'next';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
  RefundContent,
} from '@atb/page-modules/contact';

export type RefundPagePageProps = WithGlobalData<ContactPageLayoutProps>;

const RefundPage: NextPage<RefundPagePageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <ContactPageLayout {...props}>
        <RefundContent />
      </ContactPageLayout>
    </DefaultLayout>
  );
};

export default RefundPage;

export const getServerSideProps = withGlobalData();
