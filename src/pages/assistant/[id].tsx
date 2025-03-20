import DefaultLayout from '@atb/layouts/default';
import type { WithGlobalData } from '@atb/layouts/global-data';
import { withGlobalData } from '@atb/layouts/global-data';
import { NextPage } from 'next';
import { withAssistantClient } from '@atb/page-modules/assistant/server';
import {
  AssistantDetails,
  AssistantDetailsProps,
} from '@atb/page-modules/assistant/details';
import { PageText, useTranslation } from '@atb/translations';
import EmptyMessage from '@atb/components/empty-message';

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

export const getServerSideProps = withGlobalData(
  withAssistantClient<
    AssistantDetailsRoutingProps,
    { id: string[] | undefined }
  >(async function ({ client, params }) {
    if (!params?.id) {
      return {
        props: { empty: true },
      };
    }

    const id = params.id.toString();
    const result = await client.singleTrip(id);

    if (!result) {
      return {
        props: { empty: true },
      };
    }

    return {
      props: { tripPatterns: result.trip.tripPatterns },
    };
  }),
);
