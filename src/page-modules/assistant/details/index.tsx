import { TripPatternWithDetails } from '../server/journey-planner/validators';
import { PageText, useTranslation } from '@atb/translations';
import { MonoIcon } from '@atb/components/icon';
import TripSection from './trip-section';
import style from './details.module.css';
import DetailsHeader from './details-header';
import { ButtonLink } from '@atb/components/button';
import { Map } from '@atb/components/map';
import { secondsToDuration } from '@atb/utils/date';
import { Typo } from '@atb/components/typography';
import { getInterchangeDetails } from './trip-section/interchange-section';

export type AssistantDetailsProps = {
  tripPattern: TripPatternWithDetails;
};

export function AssistantDetails({ tripPattern }: AssistantDetailsProps) {
  const { t, language } = useTranslation();

  const mapLegs = tripPattern.legs.map((leg) => leg.mapLegs).flat();
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
      <div className={style.mapContainer}>
        <Map
          position={{
            lon: tripPattern.legs[0].fromPlace.longitude,
            lat: tripPattern.legs[0].fromPlace.latitude,
          }}
          initialZoom={13.5}
          mapLegs={mapLegs}
        />
        <div className={style.tripDetails}>
          <div className={style.duration}>
            <MonoIcon icon="time/Duration" />
            <Typo.p textType="body__primary">
              {t(
                PageText.Assistant.details.mapSection.travelTime(
                  secondsToDuration(tripPattern.duration, language),
                ),
              )}
            </Typo.p>
          </div>
          <div className={style.walkDistance}>
            <MonoIcon icon="transportation/Walk" />
            <Typo.p textType="body__primary">
              {t(
                PageText.Assistant.details.mapSection.walkDistance(
                  String(tripPattern.walkDistance),
                ),
              )}
            </Typo.p>
          </div>
        </div>
      </div>
      <div className={style.tripContainer}>
        {tripPattern.legs.map((leg, index) => (
          <TripSection
            key={index}
            isFirst={index === 0}
            isLast={index === tripPattern.legs.length - 1}
            leg={leg}
            interchangeDetails={getInterchangeDetails(
              tripPattern.legs,
              leg.interchangeTo?.toServiceJourney.id,
            )}
            legWaitDetails={getLegWaitDetails(leg, tripPattern.legs[index + 1])}
          />
        ))}
      </div>
    </div>
  );
}
