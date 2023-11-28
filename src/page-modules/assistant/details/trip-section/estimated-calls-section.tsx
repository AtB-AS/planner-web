import { Typo } from '@atb/components/typography';
import { TripRow } from '@atb/modules/trip-details';
import { PageText, useTranslation } from '@atb/translations';
import { secondsToDuration } from '@atb/utils/date';

import style from './trip-section.module.css';

export type EstimatedCallsSectionProps = {
  numberOfIntermediateEstimatedCalls: number;
  duration: number;
};

export function EstimatedCallsSection({
  numberOfIntermediateEstimatedCalls,
  duration,
}: EstimatedCallsSectionProps) {
  const { t, language } = useTranslation();

  if (numberOfIntermediateEstimatedCalls === 0) return null;
  return (
    <TripRow>
      <Typo.p textType="body__secondary" className={style.intermediateStops}>
        {t(
          PageText.Assistant.details.tripSection.intermediateStops(
            numberOfIntermediateEstimatedCalls,
          ),
        )}
      </Typo.p>
      <Typo.p textType="body__secondary" className={style.intermediateStops}>
        {secondsToDuration(duration, language)}
      </Typo.p>
    </TripRow>
  );
}
