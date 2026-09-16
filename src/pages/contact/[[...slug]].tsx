import DefaultLayout from '@atb/layouts/default';
import { withAccessLogging } from '@atb/modules/logging';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';
import { shouldShowContactPage } from '@atb/server/contact/utils';
import { ContactFormWrapper } from '@atb/components/contact-form';
import {
  ContactPageLayout,
  useActiveContactPageTitle,
} from '@mrfylke/contact-form';
import { contactFormConfig } from '@atb/config/contact-form-config';
import type { GetServerSideProps } from 'next';
import { PageText } from '@atb/translations';

export default function ContactCatchAllPage(
  layoutProps: WithGlobalData<Record<string, never>>,
) {
  const title = usePageTitle();
  return (
    <DefaultLayout {...layoutProps} title={title}>
      <ContactFormWrapper>
        <ContactPageLayout />
      </ContactFormWrapper>
    </DefaultLayout>
  );
}

function usePageTitle() {
  const subPageTitle = useActiveContactPageTitle(contactFormConfig);
  return subPageTitle
    ? [subPageTitle, PageText.contactPageTitle]
    : [PageText.contactPageTitle];
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
