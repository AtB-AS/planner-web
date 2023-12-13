import { PageText, useTranslation } from '@atb/translations';
import { TripPatternWithDetails } from '../../server/journey-planner/validators';
import {
  formatToSimpleDate,
  formatToWeekday,
  formatTripDuration,
} from '@atb/utils/date';
import { MonoIcon } from '@atb/components/icon';
import { Typo } from '@atb/components/typography';

import style from './details-header.module.css';

export type DetailsHeaderProps = {
  tripPattern: TripPatternWithDetails;
};
export default function DetailsHeader({ tripPattern }: DetailsHeaderProps) {
  const { t, language } = useTranslation();
  const fromName = tripPattern.legs[0].fromPlace.name;
  const toName = tripPattern.legs[tripPattern.legs.length - 1].toPlace.name;

  const weekdayAndDate = `${formatToWeekday(
    tripPattern.expectedStartTime,
    language,
    'EEEE',
  )} ${formatToSimpleDate(tripPattern.expectedStartTime, language)}`;

  const {
    duration: tripDuration,
    departure,
    arrival,
  } = formatTripDuration(
    tripPattern.expectedStartTime,
    tripPattern.expectedEndTime,
    language,
  );

  const timeRange = `${departure} - ${arrival}`;

  return (
    <div className={style.container}>
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
      <div className={style.tripDetails}>
        <div className={style.date}>
          <MonoIcon icon="time/Date" />
          <Typo.p textType="body__primary">{weekdayAndDate}</Typo.p>
        </div>
        <div className={style.duration}>
          <MonoIcon icon="time/Duration" />
          <Typo.p textType="body__primary">{timeRange}</Typo.p>
          <Typo.p textType="body__primary--bold">
            {t(PageText.Assistant.details.header.travelTime(tripDuration))}
          </Typo.p>
        </div>
      </div>
    </div>
  );
}
