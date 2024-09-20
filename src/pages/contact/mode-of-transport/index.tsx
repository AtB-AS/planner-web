import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
  ModsOfTransportContent,
} from '@atb/page-modules/contact';
import { NextPage } from 'next';

export type TicketControlAndFeePageProps =
  WithGlobalData<ContactPageLayoutProps>;

const TicketControlAndFeePage: NextPage<TicketControlAndFeePageProps> = (
  props,
) => {
  return (
    <DefaultLayout {...props}>
      <ContactPageLayout {...props}>
        <ModsOfTransportContent />
      </ContactPageLayout>
    </DefaultLayout>
  );
};

export default TicketControlAndFeePage;

export const getServerSideProps = withGlobalData();
