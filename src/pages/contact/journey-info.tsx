import DefaultLayout from '@atb/layouts/default';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';
import { withAccessLogging } from '@atb/modules/logging';
import {
  ContactPageLayout,
  ContactPageLayoutProps,
  JourneyInfoContent,
} from '@atb/page-modules/contact';
import { getContactPageTitle } from '@atb/page-modules/contact/utils';
import { PageText } from '@atb/translations';

export type JourneyInfoPageProps = WithGlobalData<ContactPageLayoutProps>;

export default function JourneyInfoPage(props: JourneyInfoPageProps) {
  return (
    <DefaultLayout
      {...props}
      title={getContactPageTitle(PageText.Contact.journeyInfo.title)}
    >
      <ContactPageLayout {...props}>
        <JourneyInfoContent />
      </ContactPageLayout>
    </DefaultLayout>
  );
}

export const getServerSideProps = withAccessLogging(withGlobalData());
