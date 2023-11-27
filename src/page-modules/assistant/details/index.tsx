import { ButtonLink } from '@atb/components/button';
import { TripPatternWithDetails } from '../server/journey-planner/validators';
import { PageText, useTranslation } from '@atb/translations';
import { MonoIcon } from '@atb/components/icon';
import { Typo } from '@atb/components/typography';

import style from './details.module.css';

export type AssistantDetailsProps = {
  tripPattern: TripPatternWithDetails;
};

export function AssistantDetails({ tripPattern }: AssistantDetailsProps) {
  const { t } = useTranslation();
  const fromName = tripPattern.legs[0].fromPlace.name;
  const toName = tripPattern.legs[tripPattern.legs.length - 1].toPlace.name;
  return (
    <div className={style.container}>
      <div className={style.headerContainer}>
        <ButtonLink
          mode="transparent"
          href="/assistant"
          onClick={(e) => {
            e.preventDefault();
            history.back();
          }
          title={t(PageText.Assistant.details.header.backLink)}
          icon={{ left: <MonoIcon icon="navigation/ArrowLeft" /> }}
        />
        <Typo.h2 textType="heading--big">
          {fromName && toName
            ? t(
                PageText.Assistant.details.header.titleFromTo({
                  fromName,
                  toName,
                }),
              )
            : t(PageText.Assistant.details.header.title)}
        </Typo.h2>
      </div>
    </div>
  );
}
