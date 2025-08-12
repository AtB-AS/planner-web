import DefaultLayout from '@atb/layouts/default';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
} from '@atb/page-modules/contact';
import LostPropertyContent from '@atb/page-modules/contact/lost-property';
import { NextPage } from 'next';
import { withAccessLogging } from '@atb/modules/logging';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';
import { getContactPageTitle } from '@atb/page-modules/contact/utils';
import { PageText } from '@atb/translations';

export type LostPropertyPageProps = WithGlobalData<ContactPageLayoutProps>;

const LostPropertyPage: NextPage<LostPropertyPageProps> = (props) => {
  return (
    <DefaultLayout
      {...props}
      title={getContactPageTitle(PageText.Contact.lostProperty.title)}
    >
      <ContactPageLayout {...props}>
        <LostPropertyContent />
      </ContactPageLayout>
    </DefaultLayout>
  );
};

export default LostPropertyPage;

export const getServerSideProps = withAccessLogging(withGlobalData());
