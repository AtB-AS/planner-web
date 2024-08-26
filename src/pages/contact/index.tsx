import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import { ContactLayout, ContactLayoutProps } from '@atb/page-modules/contact';
import { shouldShowContactPage } from '@atb/page-modules/contact/utils';
import { NextPage } from 'next';

export type ContactContentProps = { title: string };

export type ContactPageProps = WithGlobalData<
  ContactLayoutProps & ContactContentProps
>;

function ContactContent(props: ContactContentProps) {
  return (
    <section>
      <h1>Initial title contact schema</h1>
    </section>
  );
}

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
