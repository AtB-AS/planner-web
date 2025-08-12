import DefaultLayout from '@atb/layouts/default';
import { NextPage } from 'next';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
  TicketingContent,
} from '@atb/page-modules/contact';
import { withAccessLogging } from '@atb/modules/logging';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';
import { getContactPageTitle } from '@atb/page-modules/contact/utils';
import { PageText } from '@atb/translations';

export type TicketsAppPageProps = WithGlobalData<ContactPageLayoutProps>;

const TicketsAppPage: NextPage<TicketsAppPageProps> = (props) => {
  return (
    <DefaultLayout
      {...props}
      title={getContactPageTitle(PageText.Contact.ticketing.title)}
    >
      <ContactPageLayout {...props}>
        <TicketingContent />
      </ContactPageLayout>
    </DefaultLayout>
  );
};

export default TicketsAppPage;

export const getServerSideProps = withAccessLogging(withGlobalData());
