import DefaultLayout from '@atb/layouts/default';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
  MeansOfTransportContent,
} from '@atb/page-modules/contact';
import { NextPage } from 'next';
import { withAccessLogging } from '@atb/modules/logging';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';

export type MeansOfTransportPageProps = WithGlobalData<ContactPageLayoutProps>;

const MeansOfTransportPage: NextPage<MeansOfTransportPageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <ContactPageLayout {...props}>
        <MeansOfTransportContent />
      </ContactPageLayout>
    </DefaultLayout>
  );
};

export default MeansOfTransportPage;

export const getServerSideProps = withAccessLogging(withGlobalData());
