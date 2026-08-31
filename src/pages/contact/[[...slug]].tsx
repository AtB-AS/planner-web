import DefaultLayout from '@atb/layouts/default';
import { withAccessLogging } from '@atb/modules/logging';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';
import {
  getContactPageTitle,
  shouldShowContactPage,
} from '@atb/server/contact/utils';
import {
  ContactFormWrapper,
  ContactFormContactContent,
} from '@atb/components/contact-form';
import type { GetServerSideProps } from 'next';

type ContactCatchAllPagePropsContent = {
  slug: string[] | null;
};

export type ContactCatchAllPageProps =
  WithGlobalData<ContactCatchAllPagePropsContent>;

export default function ContactCatchAllPage({
  slug,
  ...layoutProps
}: ContactCatchAllPageProps) {
  return (
    <DefaultLayout {...layoutProps} title={getContactPageTitle()}>
      <ContactFormWrapper>
        <ContactFormContactContent slug={slug} />
      </ContactFormWrapper>
    </DefaultLayout>
  );
}

export const getServerSideProps: GetServerSideProps<ContactCatchAllPageProps> =
  withAccessLogging(
    withGlobalData<ContactCatchAllPagePropsContent>(async (context) => {
      if (!shouldShowContactPage()) {
        return { notFound: true };
      }
      const slug = context.params?.slug as string[] | undefined;
      return {
        props: {
          slug: slug ?? null,
        },
      };
    }),
  );
