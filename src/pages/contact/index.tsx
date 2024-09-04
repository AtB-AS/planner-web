import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
} from '@atb/page-modules/contact';
import { shouldShowContactPage } from '@atb/page-modules/contact/utils';
import { NextPage } from 'next';

export type ContactPageProps = WithGlobalData<ContactPageLayoutProps>;

const ContactPage: NextPage<ContactPageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <ContactPageLayout {...props} />
    </DefaultLayout>
  );
};

export default ContactPage;

export const getServerSideProps = withGlobalData(async () => {
  const hasContactFormUrl = shouldShowContactPage();
  if (!hasContactFormUrl) {
    return {
      notFound: true,
    };
  }
  return { props: {} };
});
