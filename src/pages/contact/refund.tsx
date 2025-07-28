import DefaultLayout from '@atb/layouts/default';
import { NextPage } from 'next';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
  RefundContent,
} from '@atb/page-modules/contact';
import { withAccessLogging } from '@atb/modules/logging';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';

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

export const getServerSideProps = withAccessLogging(withGlobalData());
