import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import { NextPage } from 'next';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
  TravelGuaranteeContent,
} from '@atb/page-modules/contact';

export type TravelGuaranteePageProps = WithGlobalData<ContactPageLayoutProps>;

const TravelGuaranteePage: NextPage<TravelGuaranteePageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <ContactPageLayout {...props}>
        <TravelGuaranteeContent />
      </ContactPageLayout>
    </DefaultLayout>
  );
};

export default TravelGuaranteePage;

export const getServerSideProps = withGlobalData();
