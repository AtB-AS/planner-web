import { PageText, useTranslation } from '@atb/translations';
import { MonoIcon } from '@atb/components/icon';
import TripSection from './trip-section';
import style from './details.module.css';
import { ButtonLink } from '@atb/components/button';
import { Map } from '@atb/components/map';
import { formatTripDuration } from '@atb/utils/date';
import { Typo } from '@atb/components/typography';
import { getInterchangeDetails } from './trip-section/interchange-section';
import { getLegWaitDetails } from './trip-section/wait-section';
import { useRouter } from 'next/router';
import { tripQueryStringToQueryParams } from './utils';
import { MessageBox } from '@atb/components/message-box';
import { getBookingStatus } from '@atb/modules/flexible/utils';
import {
  GlobalMessageContextEnum,
  GlobalMessages,
} from '@atb/modules/global-messages';
import {
  ExtendedLegType,
  ExtendedTripPatternWithDetailsType,
} from '@atb/page-modules/assistant';
import { AssistantDetailsHeader } from '@atb/page-modules/assistant/details/details-header';
import { AssistantDetailsBody } from '@atb/page-modules/assistant/details/details-body';

export type AssistantDetailsProps = {
  tripPatterns: ExtendedTripPatternWithDetailsType[];
};

export function AssistantDetails({ tripPatterns }: AssistantDetailsProps) {
  const { t } = useTranslation();
  const router = useRouter();
  if (!tripPatterns.length) return null;
  const tripPattern = tripPatterns[0];

  const tripSearchParams = router.query.id
    ? tripQueryStringToQueryParams(String(router.query.id))
    : undefined;

  if (tripSearchParams && router.query.filter) {
    tripSearchParams.append('filter', router.query.filter as string);
  }

  return (
    <div className={style.container}>
      <div className={style.headerContainer}>
        <ButtonLink
          mode="transparent"
          href={
            tripSearchParams
              ? `/assistant?${tripSearchParams.toString()}`
              : '/assistant'
          }
          title={t(PageText.Assistant.details.header.backLink)}
          icon={{ left: <MonoIcon icon="navigation/ArrowLeft" /> }}
        />
        <AssistantDetailsHeader tripPattern={tripPattern} />
      </div>
      <AssistantDetailsBody tripPattern={tripPattern} />
    </div>
  );
}
