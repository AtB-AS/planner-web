import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
  MeansOfTransportContent,
} from '@atb/page-modules/contact';
import { NextPage } from 'next';

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

export const getServerSideProps = withGlobalData();
