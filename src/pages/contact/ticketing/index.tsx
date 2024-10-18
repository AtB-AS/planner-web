import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import { NextPage } from 'next';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
  TicketingContent,
} from '@atb/page-modules/contact';

export type TicketsAppPageProps = WithGlobalData<ContactPageLayoutProps>;

const TicketsAppPage: NextPage<TicketsAppPageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <ContactPageLayout {...props}>
        <TicketingContent />
      </ContactPageLayout>
    </DefaultLayout>
  );
};

export default TicketsAppPage;

export const getServerSideProps = withGlobalData();
