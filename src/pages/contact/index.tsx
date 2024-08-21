import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, WithGlobalData } from '@atb/layouts/global-data';
import { ContactLayout, ContactLayoutProps } from '@atb/page-modules/contact';
import { NextPage } from 'next';

export type ContactContentProps = { title: string };

export type ContactPageProps = WithGlobalData<
  ContactLayoutProps & ContactContentProps
>;

function ContactContent(props: ContactContentProps) {
  return (
    <div>
      <h1>Title</h1>
      <nav>
        <li>a</li>
        <li>b</li>
        <li>c</li>
      </nav>
      <div>
        <p>body</p>
      </div>
    </div>
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

export const getServerSideProps = withGlobalData();
