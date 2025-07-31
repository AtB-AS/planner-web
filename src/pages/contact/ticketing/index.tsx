import DefaultLayout from '@atb/layouts/default';
import { NextPage } from 'next';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
  TicketingContent,
} from '@atb/page-modules/contact';
import { withAccessLogging } from '@atb/modules/logging';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';

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

export const getServerSideProps = withAccessLogging(withGlobalData());
