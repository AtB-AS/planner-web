import DefaultLayout from '@atb/layouts/default';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
  MeansOfTransportContent,
} from '@atb/page-modules/contact';
import { NextPage } from 'next';
import { withAccessLogging } from '@atb/modules/logging';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';
import { getContactPageTitle } from '@atb/page-modules/contact/utils';
import { PageText } from '@atb/translations';

export type MeansOfTransportPageProps = WithGlobalData<ContactPageLayoutProps>;

const MeansOfTransportPage: NextPage<MeansOfTransportPageProps> = (props) => {
  return (
    <DefaultLayout
      {...props}
      title={getContactPageTitle(PageText.Contact.modeOfTransport.title)}
    >
      <ContactPageLayout {...props}>
        <MeansOfTransportContent />
      </ContactPageLayout>
    </DefaultLayout>
  );
};

export default MeansOfTransportPage;

export const getServerSideProps = withAccessLogging(withGlobalData());
