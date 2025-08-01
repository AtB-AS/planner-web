import { PageText, useTranslation } from '@atb/translations';
import { MonoIcon } from '@atb/components/icon';
import style from './details.module.css';
import { ButtonLink } from '@atb/components/button';
import { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';
import { AssistantDetailsHeader } from '@atb/page-modules/assistant/details/details-header';
import { AssistantDetailsBody } from '@atb/page-modules/assistant/details-body';

export type AssistantDetailsProps = {
  tripPatterns: ExtendedTripPatternWithDetailsType[];
  referer?: string;
};

export function AssistantDetails({
  tripPatterns,
  referer,
}: AssistantDetailsProps) {
  const { t } = useTranslation();
  if (!tripPatterns.length) return null;
  const tripPattern = tripPatterns[0];

  return (
    <div className={style.container}>
      <div className={style.headerContainer}>
        <ButtonLink
          mode="transparent"
          href={referer ?? '/assistant'}
          title={t(PageText.Assistant.details.header.backLink)}
          icon={{ left: <MonoIcon icon="navigation/ArrowLeft" /> }}
        />
        <AssistantDetailsHeader tripPattern={tripPattern} />
      </div>
      <AssistantDetailsBody tripPattern={tripPattern} />
    </div>
  );
}
