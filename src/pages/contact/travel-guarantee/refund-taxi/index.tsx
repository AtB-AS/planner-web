import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
  RefundTaxiForm,
  TravelGuaranteePageLayout,
} from '@atb/page-modules/contact';

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
        <TravelGuaranteePageLayout {...props}>
          <RefundTaxiForm />
        </TravelGuaranteePageLayout>
      </ContactPageLayout>
    </DefaultLayout>
  );
};

export default TicketControlAndFeePage;

export const getServerSideProps = withGlobalData();
