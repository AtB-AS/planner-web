import { TripPatternWithDetails } from '../server/journey-planner/validators';

import style from './details.module.css';
import DetailsHeader from './details-header';
import { ButtonLink } from '@atb/components/button';
import { PageText, useTranslation } from '@atb/translations';
import { MonoIcon } from '@atb/components/icon';

export type AssistantDetailsProps = {
  tripPattern: TripPatternWithDetails;
};

export function AssistantDetails({ tripPattern }: AssistantDetailsProps) {
  const { t } = useTranslation();
  return (
    <div className={style.container}>
      <div className={style.headerContainer}>
        <ButtonLink
          mode="transparent"
          href="/assistant"
          onClick={(e) => {
            e.preventDefault();
            history.back();
          }}
          title={t(PageText.Assistant.details.header.backLink)}
          icon={{ left: <MonoIcon icon="navigation/ArrowLeft" /> }}
        />
        <DetailsHeader tripPattern={tripPattern} />
      </div>
    </div>
  );
}
