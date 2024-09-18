import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
  PostponePaymentForm,
} from '@atb/page-modules/contact';
import TicketControlPageLayout from '@atb/page-modules/contact/layouts/ticket-control-page-layout';

import { NextPage } from 'next';

export type PostponePaymentPageProps = WithGlobalData<ContactPageLayoutProps>;

const PostponePaymentPage: NextPage<PostponePaymentPageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <ContactPageLayout {...props}>
        <TicketControlPageLayout {...props}>
          <PostponePaymentForm />
        </TicketControlPageLayout>
      </ContactPageLayout>
    </DefaultLayout>
  );
};

export default PostponePaymentPage;

export const getServerSideProps = withGlobalData();
