import DefaultLayout from '@atb/layouts/default';
import { withAccessLogging } from '@atb/modules/logging';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';
import {
  getContactPageTitle,
  shouldShowContactPage,
} from '@atb/server/contact/utils';
import { ContactFormWrapper } from '@atb/components/contact-form';
import { ContactPageLayout } from '@mrfylke/contact-form';
import type { GetServerSideProps } from 'next';

export default function ContactCatchAllPage(
  layoutProps: WithGlobalData<Record<string, never>>,
) {
  return (
    <DefaultLayout {...layoutProps} title={getContactPageTitle()}>
      <ContactFormWrapper>
        <ContactPageLayout />
      </ContactFormWrapper>
    </DefaultLayout>
  );
}

export const getServerSideProps: GetServerSideProps<
  WithGlobalData<Record<string, never>>
> = withAccessLogging(
  withGlobalData<Record<string, never>>(async () => {
    if (!shouldShowContactPage()) {
      return { notFound: true };
    }
    return { props: {} };
  }),
);
