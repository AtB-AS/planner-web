import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import { NextPage } from 'next';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
} from '@atb/page-modules/contact';
import GroupTravelContent from '@atb/page-modules/contact/group-travel';

export type GroupTravelPageProps = WithGlobalData<ContactPageLayoutProps>;

const GroupTravelPage: NextPage<GroupTravelPageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <ContactPageLayout {...props}>
        <GroupTravelContent />
      </ContactPageLayout>
    </DefaultLayout>
  );
};

export default GroupTravelPage;

export const getServerSideProps = withGlobalData();
