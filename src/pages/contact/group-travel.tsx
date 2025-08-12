import DefaultLayout from '@atb/layouts/default';
import { NextPage } from 'next';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
} from '@atb/page-modules/contact';
import GroupTravelContent from '@atb/page-modules/contact/group-travel';
import { withAccessLogging } from '@atb/modules/logging';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';
import { PageText } from '@atb/translations';
import { getContactPageTitle } from '@atb/page-modules/contact/utils';

export type GroupTravelPageProps = WithGlobalData<ContactPageLayoutProps>;

const GroupTravelPage: NextPage<GroupTravelPageProps> = (props) => {
  return (
    <DefaultLayout
      {...props}
      title={getContactPageTitle(PageText.Contact.groupTravel.title)}
    >
      <ContactPageLayout {...props}>
        <GroupTravelContent />
      </ContactPageLayout>
    </DefaultLayout>
  );
};

export default GroupTravelPage;

export const getServerSideProps = withAccessLogging(withGlobalData());
