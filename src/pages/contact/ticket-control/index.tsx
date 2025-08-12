import DefaultLayout from '@atb/layouts/default';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
  TicketControlPageContent,
} from '@atb/page-modules/contact';
import { NextPage } from 'next';
import { withAccessLogging } from '@atb/modules/logging';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';
import { PageText } from '@atb/translations';
import { getContactPageTitle } from '@atb/page-modules/contact/utils';

export type TicketControlAndFeePageProps =
  WithGlobalData<ContactPageLayoutProps>;

const TicketControlAndFeePage: NextPage<TicketControlAndFeePageProps> = (
  props,
) => {
  return (
    <DefaultLayout
      {...props}
      title={getContactPageTitle(PageText.Contact.ticketControl.title)}
    >
      <ContactPageLayout {...props}>
        <TicketControlPageContent />
      </ContactPageLayout>
    </DefaultLayout>
  );
};

export default TicketControlAndFeePage;

export const getServerSideProps = withAccessLogging(withGlobalData());
