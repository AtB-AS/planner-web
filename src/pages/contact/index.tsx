import DefaultLayout from '@atb/layouts/default';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
  shouldShowContactPage,
} from '@atb/page-modules/contact';
import { NextPage } from 'next';
import { withAccessLogging } from '@atb/modules/logging';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';
import { PageText } from '@atb/translations';
import { getContactPageTitle } from '@atb/page-modules/contact/utils';

export type ContactPageProps = WithGlobalData<ContactPageLayoutProps>;

const ContactPage: NextPage<ContactPageProps> = (props) => {
  return (
    <DefaultLayout {...props} title={getContactPageTitle()}>
      <ContactPageLayout {...props} />
    </DefaultLayout>
  );
};

export default ContactPage;

export const getServerSideProps = withAccessLogging(
  withGlobalData(async () => {
    const hasContactFormUrl = shouldShowContactPage();
    if (!hasContactFormUrl) {
      return {
        notFound: true,
      };
    }
    return { props: {} };
  }),
);
