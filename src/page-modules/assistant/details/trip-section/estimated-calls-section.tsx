import { Typo } from '@atb/components/typography';
import { TripRow } from '@atb/modules/trip-details';
import { PageText, useTranslation } from '@atb/translations';
import { secondsToDuration } from '@atb/utils/date';
import Link from 'next/link';

import style from './trip-section.module.css';

export type EstimatedCallsSectionProps = {
  numberOfIntermediateEstimatedCalls: number;
  duration: number;
  serviceJourneyId: string | null;
  date: string;
  fromQuayId: string | null;
};

export function EstimatedCallsSection({
  numberOfIntermediateEstimatedCalls,
  duration,
  serviceJourneyId,
  date,
  fromQuayId,
}: EstimatedCallsSectionProps) {
  const { t, language } = useTranslation();

  const shouldShowLinkToServiceJourney = serviceJourneyId ? true : false;
  const serviceJourneyHref = fromQuayId
    ? `/departures/details/${serviceJourneyId}?date=${date}&fromQuayId=${fromQuayId}`
    : `/departures/details/${serviceJourneyId}?date=${date}`;

  if (numberOfIntermediateEstimatedCalls === 0) return null;
  return (
    <TripRow>
      {shouldShowLinkToServiceJourney ? (
        <Link className={style.intermediateStops} href={serviceJourneyHref}>
          {t(
            PageText.Assistant.details.tripSection.intermediateStops(
              numberOfIntermediateEstimatedCalls,
            ),
          )}
        </Link>
      ) : (
        <Typo.p textType="body__secondary" className={style.intermediateStops}>
          {t(
            PageText.Assistant.details.tripSection.intermediateStops(
              numberOfIntermediateEstimatedCalls,
            ),
          )}
        </Typo.p>
      )}
      <Typo.p textType="body__secondary" className={style.intermediateStops}>
        {secondsToDuration(duration, language)}
      </Typo.p>
    </TripRow>
  );
}
