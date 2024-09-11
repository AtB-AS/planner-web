import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
} from '@atb/page-modules/contact';
import TicketControlPageLayout from '@atb/page-modules/contact/layouts/ticket-control-page-layout';

import PostponePaymentForm from '@atb/page-modules/contact/ticket-control/postpone-paymnet/postponePaymentForm';
import { NextPage } from 'next';

export type TicketControlAndFeePageProps = {
  title: string;
};

export type ContactPageProps = WithGlobalData<
  ContactPageLayoutProps & TicketControlAndFeePageProps
>;

const TicketControlAndFeePage: NextPage<ContactPageProps> = (props) => {
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

export default TicketControlAndFeePage;

export const getServerSideProps = withGlobalData();
