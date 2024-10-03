import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
} from '@atb/page-modules/contact';
import LostPropertyContent from '@atb/page-modules/contact/lost-property';
import { NextPage } from 'next';

export type LostPropertyPageProps = WithGlobalData<ContactPageLayoutProps>;

const LostPropertyPage: NextPage<LostPropertyPageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <ContactPageLayout {...props}>
        <LostPropertyContent />
      </ContactPageLayout>
    </DefaultLayout>
  );
};

export default LostPropertyPage;

export const getServerSideProps = withGlobalData();
