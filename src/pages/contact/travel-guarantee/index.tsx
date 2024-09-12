import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
  TravelGuaranteePageLayout,
} from '@atb/page-modules/contact';

import { NextPage } from 'next';

export type TravelGuaranteePageProps = WithGlobalData<ContactPageLayoutProps>;

const TravelGuaranteePage: NextPage<TravelGuaranteePageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <ContactPageLayout {...props}>
        <TravelGuaranteePageLayout {...props} />
      </ContactPageLayout>
    </DefaultLayout>
  );
};

export default TravelGuaranteePage;

export const getServerSideProps = withGlobalData();
