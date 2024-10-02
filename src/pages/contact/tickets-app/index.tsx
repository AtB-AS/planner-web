import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import { NextPage } from 'next';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
  TicketsAppContent,
} from '@atb/page-modules/contact';

export type TicketsAppPageProps = WithGlobalData<ContactPageLayoutProps>;

const TicketsAppPage: NextPage<TicketsAppPageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <ContactPageLayout {...props}>
        <TicketsAppContent />
      </ContactPageLayout>
    </DefaultLayout>
  );
};

export default TicketsAppPage;

export const getServerSideProps = withGlobalData();
