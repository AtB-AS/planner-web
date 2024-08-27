import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import { ContactLayout, ContactLayoutProps } from '@atb/page-modules/contact';
import {
  ContactContent,
  ContactContentProps,
} from '@atb/page-modules/contact/content';
import { shouldShowContactPage } from '@atb/page-modules/contact/utils';
import { NextPage } from 'next';

export type ContactPageProps = WithGlobalData<
  ContactLayoutProps & ContactContentProps
>;

const ContactPage: NextPage<ContactPageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <ContactLayout {...props}>
        <ContactContent {...props} />
      </ContactLayout>
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
