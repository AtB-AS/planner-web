import { useTranslation } from '@atb/translations';
import dictionary from '@atb/translations/dictionary';
import { MonoIcon } from '@atb/components/icon';
import style from './details.module.css';
import { Button } from '@atb/components/button';
import { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';
import { TravelCardHeader } from '@atb/page-modules/assistant/trip/travel-card/travel-card-header';
import { AssistantDetailsBody } from '@atb/page-modules/assistant/details-body';
import { useGoBack } from '@atb/utils/use-go-back';

export type AssistantDetailsProps = {
  tripPatterns: ExtendedTripPatternWithDetailsType[];
};

export function AssistantDetails({ tripPatterns }: AssistantDetailsProps) {
  const { t } = useTranslation();
  const goBack = useGoBack();
  if (!tripPatterns.length) return null;
  const tripPattern = tripPatterns[0];

  return (
    <div className={style.container}>
      <div className={style.headerContainer}>
        <Button
          mode="transparent"
          onClick={goBack}
          title={t(dictionary.back)}
          icon={{ left: <MonoIcon icon="navigation/ArrowLeft" /> }}
        />
        <TravelCardHeader
          tripPattern={tripPattern}
          size="large"
          includeFromToInfo
          includeDayInfo
          includeDuration={false}
        />
      </div>
      <AssistantDetailsBody tripPattern={tripPattern} />
    </div>
  );
}
