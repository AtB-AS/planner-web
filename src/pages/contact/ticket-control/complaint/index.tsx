import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import { NextPage } from 'next';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
  FeeComplaintForm,
  TicketControlPageLayout,
} from '@atb/page-modules/contact';

export type FeeComplaintFormPageProps = WithGlobalData<ContactPageLayoutProps>;

const FeeComplaintFormPage: NextPage<FeeComplaintFormPageProps> = (props) => {
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

export default FeeComplaintFormPage;

export const getServerSideProps = withGlobalData();
