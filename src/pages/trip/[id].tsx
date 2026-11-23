import DefaultLayout from '@atb/layouts/default';
import { NextPage } from 'next';
import { withTripClient } from '@atb/page-modules/trip/server';
import { toExtendedTripPattern } from '@atb/page-modules/assistant/server/bff-trips';
import { validate as isUuid } from 'uuid';
import {
  AssistantDetails,
  AssistantDetailsProps,
} from '@atb/page-modules/assistant/details';
import { PageText, useTranslation } from '@atb/translations';
import EmptyMessage from '@atb/components/empty-message';
import { withAccessLogging } from '@atb/modules/logging';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';

type AssistantDetailsRoutingProps =
  | AssistantDetailsProps
  | {
      empty: true;
    };

function AssistantDetailsRouting(props: AssistantDetailsRoutingProps) {
  const { t } = useTranslation();
  if (isAssistantDetailsProps(props)) {
    return <AssistantDetails {...props} />;
  }

  return (
    <EmptyMessage
      title={t(PageText.Assistant.details.errorDefault)}
      details={t(PageText.Assistant.details.errorDefault)}
    />
  );
}

function isAssistantDetailsProps(a: any): a is AssistantDetailsProps {
  return a && a.tripPatterns;
}

export type AssistantDetailsPageProps =
  WithGlobalData<AssistantDetailsRoutingProps>;
const AssistantDetailsPage: NextPage<AssistantDetailsPageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <AssistantDetailsRouting {...props} />
    </DefaultLayout>
  );
};

export default AssistantDetailsPage;

export const getServerSideProps = withAccessLogging(
  withGlobalData(
    withTripClient<AssistantDetailsRoutingProps, { id: string | undefined }>(
      async function ({ client, params }) {
        if (!params?.id || !isUuid(params.id)) {
          return {
            props: { empty: true },
          };
        }

        const storedTrip = await client.getTrip(params.id);

        if (!storedTrip) {
          return {
            props: { empty: true },
          };
        }

        const tripPattern = await client.refreshSingleTrip(
          toExtendedTripPattern(storedTrip),
        );

        return {
          props: { tripPatterns: [tripPattern] },
        };
      },
    ),
  ),
);
