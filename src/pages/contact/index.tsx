import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import { ContactLayout, ContactLayoutProps } from '@atb/page-modules/contact';
import { ErrorContent } from '@atb/page-modules/error';
import { NextPage } from 'next';

export type ContactContentProps = { title: string };

export type ContactPageProps = WithGlobalData<
  ContactLayoutProps & ContactContentProps
>;

function ContactContent(props: ContactContentProps) {
  const contactPage = process.env.NEXT_PUBLIC_CONTACT_PAGE;

  if (contactPage) {
    return (
      <section>
        <h1>Initial title contact schema</h1>
      </section>
    );
  }
  return <ErrorContent statusCode={404} />;
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

export const getServerSideProps = withGlobalData();
