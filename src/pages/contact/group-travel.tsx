import DefaultLayout from '@atb/layouts/default';
import { NextPage } from 'next';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
} from '@atb/page-modules/contact';
import GroupTravelContent from '@atb/page-modules/contact/group-travel';
import { withAccessLogging } from '@atb/modules/logging';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';

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

export const getServerSideProps = withAccessLogging(withGlobalData());
