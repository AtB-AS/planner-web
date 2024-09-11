import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
} from '@atb/page-modules/contact';
import TicketControlPageLayout from '@atb/page-modules/contact/layouts/ticket-control-page-layout';

import { FeeComplaintForm } from '@atb/page-modules/contact/ticket-control/complaint/feeComplaintForm';
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
          <FeeComplaintForm />
        </TicketControlPageLayout>
      </ContactPageLayout>
    </DefaultLayout>
  );
};

export default TicketControlAndFeePage;

export const getServerSideProps = withGlobalData();
