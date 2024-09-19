import DefaultLayout from '@atb/layouts/default';
import { NextPage } from 'next';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
  TicketControlPageLayout,
  FeedbackForm,
} from '@atb/page-modules/contact';

export type FeedbackPageProps = WithGlobalData<ContactPageLayoutProps>;

const FeedbackPage: NextPage<FeedbackPageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <ContactPageLayout {...props}>
        <TicketControlPageLayout {...props}>
          <FeedbackForm />
        </TicketControlPageLayout>
      </ContactPageLayout>
    </DefaultLayout>
  );
};

export default FeedbackPage;

export const getServerSideProps = withGlobalData();
