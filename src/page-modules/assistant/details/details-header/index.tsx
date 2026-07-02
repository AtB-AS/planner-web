import { PageText, useTranslation } from '@atb/translations';
import { formatToSimpleDate, formatToWeekday } from '@atb/utils/date';
import { ColorIcon, MonoIcon } from '@atb/components/icon';
import { Typo } from '@atb/components/typography';

import style from './details-header.module.css';
import { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';

export type DetailsHeaderProps = {
  tripPattern: ExtendedTripPatternWithDetailsType;
};
export function AssistantDetailsHeader({ tripPattern }: DetailsHeaderProps) {
  const { t, language } = useTranslation();
  const fromName = tripPattern.legs[0].fromPlace.name;
  const toName = tripPattern.legs[tripPattern.legs.length - 1].toPlace.name;

  const weekdayAndDate = `${formatToWeekday(
    tripPattern.expectedStartTime,
    language,
    'EEEE',
  )} ${formatToSimpleDate(tripPattern.expectedStartTime, language)}`;

  const isCancelled = tripPattern.legs.some(
    (leg) => leg.fromEstimatedCall?.cancellation,
  );

  return (
    <div className={style.container}>
      <div className={style.headerContainer}>
        {isCancelled && (
          <ColorIcon
            icon="status/Error"
            className={style.situationIcon}
            alt={t(PageText.Assistant.trip.tripPattern.isCancelled.label)}
          />
        )}
        <Typo.h2 textType="heading__xl">
          {fromName && toName
            ? t(
                PageText.Assistant.details.header.titleFromTo({
                  fromName,
                  toName,
                }),
              )
            : t(PageText.Assistant.details.header.title)}

          {isCancelled &&
            ` (${t(
              PageText.Assistant.trip.tripPattern.isCancelled.title,
            ).toUpperCase()})`}
        </Typo.h2>
      </div>
      <div className={style.tripDetails}>
        <div className={style.date}>
          <MonoIcon icon="time/Date" />
          <Typo.p textType={isCancelled ? 'body__m__strike' : 'body__m'}>
            {weekdayAndDate}
          </Typo.p>
        </div>
      </div>
    </div>
  );
}
