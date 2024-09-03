import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import { ContactLayout, ContactLayoutProps } from '@atb/page-modules/contact';
import { TicketControlAndFeeContent } from '@atb/page-modules/contact/ticket-control';
import { NextPage } from 'next';

export type TicketControlAndFeePageProps = {
  title: string;
};

export type ContactPageProps = WithGlobalData<
  ContactLayoutProps & TicketControlAndFeePageProps
>;

const TicketControlAndFeePage: NextPage<ContactPageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <ContactLayout {...props}>
        <TicketControlAndFeeContent {...props} />
      </ContactLayout>
    </DefaultLayout>
  );
};

export default TicketControlAndFeePage;

export const getServerSideProps = withGlobalData();
