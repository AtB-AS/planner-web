import DefaultLayout from '@atb/layouts/default';
import { withAccessLogging } from '@atb/modules/logging';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';
import { shouldShowContactPage } from '@mrfylke/contact-form';
import { getContactPageTitle } from '@atb/server/contact/utils';
import {
  ContactFormWrapper,
  ContactFormContactContent,
} from '@atb/components/contact-form';
import type { GetServerSideProps } from 'next';

type ContactCatchAllPagePropsContent = {
  acceptLanguage: string | null;
  slug: string[] | null;
};

export type ContactCatchAllPageProps =
  WithGlobalData<ContactCatchAllPagePropsContent>;

export default function ContactCatchAllPage({
  acceptLanguage,
  slug,
  ...layoutProps
}: ContactCatchAllPageProps) {
  return (
    <DefaultLayout {...layoutProps} title={getContactPageTitle()}>
      <ContactFormWrapper acceptLanguageHeader={acceptLanguage}>
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
      const acceptLanguage =
        (context.req?.headers?.['accept-language'] as string) ?? null;
      const slug = context.params?.slug as string[] | undefined;
      return {
        props: {
          acceptLanguage,
          slug: slug ?? null,
        },
      };
    }),
  );
