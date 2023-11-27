import { ButtonLink } from '@atb/components/button';
import { TripPatternWithDetails } from '../server/journey-planner/validators';
import { PageText, useTranslation } from '@atb/translations';
import { MonoIcon } from '@atb/components/icon';
import { Typo } from '@atb/components/typography';
import {
  formatSimpleTime,
  formatToSimpleDate,
  formatToWeekday,
  secondsToDuration,
} from '@atb/utils/date';

import style from './details.module.css';

export type AssistantDetailsProps = {
  tripPattern: TripPatternWithDetails;
};

export function AssistantDetails({ tripPattern }: AssistantDetailsProps) {
  const { t } = useTranslation();
  const { fromName, toName, weekdayAndDate, timeRange, tripDuratrion } =
    useTripDetailsHeader(tripPattern);
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
              {t(PageText.Assistant.details.header.travelTime(tripDuratrion))}
            </Typo.p>
          </div>
        </div>
      </div>
    </div>
  );
}

const useTripDetailsHeader = (tripPattern: TripPatternWithDetails) => {
  const { language } = useTranslation();
  const fromName = tripPattern.legs[0].fromPlace.name;
  const toName = tripPattern.legs[tripPattern.legs.length - 1].toPlace.name;

  const weekdayAndDate = `${formatToWeekday(
    tripPattern.expectedStartTime,
    language,
    'EEEE',
  )} ${formatToSimpleDate(tripPattern.expectedStartTime, language)}`;

  const timeRange = `${formatSimpleTime(
    tripPattern.expectedStartTime,
  )} - ${formatSimpleTime(tripPattern.expectedEndTime)}`;

  const totalDuration = tripPattern.legs.reduce(
    (total, leg) => total + leg.duration,
    0,
  );
  const tripDuratrion = secondsToDuration(totalDuration, language);

  return {
    fromName,
    toName,
    weekdayAndDate,
    timeRange,
    tripDuratrion,
  };
};
