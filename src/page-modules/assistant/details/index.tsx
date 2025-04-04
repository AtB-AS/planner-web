import { PageText, useTranslation } from '@atb/translations';
import { MonoIcon } from '@atb/components/icon';
import TripSection from './trip-section';
import style from './details.module.css';
import DetailsHeader from './details-header';
import { ButtonLink } from '@atb/components/button';
import { Map } from '@atb/components/map';
import { formatTripDuration } from '@atb/utils/date';
import { Typo } from '@atb/components/typography';
import { getInterchangeDetails } from './trip-section/interchange-section';
import { getLegWaitDetails } from './trip-section/wait-section';
import { useRouter } from 'next/router';
import { tripQueryStringToQueryParams } from './utils';
import { MessageBox } from '@atb/components/message-box';
import { getBookingStatus } from '@atb/modules/flexible/utils';
import {
  GlobalMessageContextEnum,
  GlobalMessages,
} from '@atb/modules/global-messages';
import {
  ExtendedLegType,
  ExtendedTripPatternWithDetailsType,
} from '@atb/page-modules/assistant';

export type AssistantDetailsProps = {
  tripPatterns: ExtendedTripPatternWithDetailsType[];
};

export function AssistantDetails({ tripPatterns }: AssistantDetailsProps) {
  const { t, language } = useTranslation();
  const router = useRouter();
  if (!tripPatterns.length) return null;
  const tripPattern = tripPatterns[0];
  const mapLegs = tripPattern.legs
    .map((leg: ExtendedLegType) => leg.mapLegs)
    .flat();
  const { duration } = formatTripDuration(
    tripPattern.expectedStartTime,
    tripPattern.expectedEndTime,
    language,
  );

  const tripSearchParams = router.query.id
    ? tripQueryStringToQueryParams(String(router.query.id))
    : undefined;

  if (tripSearchParams && router.query.filter) {
    tripSearchParams.append('filter', router.query.filter as string);
  }

  const requireTicketBooking = tripPattern.legs.some((leg: ExtendedLegType) => {
    if (!leg.bookingArrangements) return false;
    return (
      getBookingStatus(leg.bookingArrangements, leg.aimedStartTime, 7) !==
      'none'
    );
  });

  return (
    <div className={style.container}>
      <div className={style.headerContainer}>
        <ButtonLink
          mode="transparent"
          href={
            tripSearchParams
              ? `/assistant?${tripSearchParams.toString()}`
              : '/assistant'
          }
          title={t(PageText.Assistant.details.header.backLink)}
          icon={{ left: <MonoIcon icon="navigation/ArrowLeft" /> }}
        />
        <DetailsHeader tripPattern={tripPattern} />
      </div>
      <div className={style.mapContainer}>
        <Map mapLegs={mapLegs} />
        <div className={style.tripDetails}>
          <div className={style.duration}>
            <MonoIcon icon="time/Duration" />
            <Typo.p textType="body__primary">
              {t(PageText.Assistant.details.mapSection.travelTime(duration))}
            </Typo.p>
          </div>
          <div className={style.walkDistance}>
            <MonoIcon icon="transportation/Walk" />
            <Typo.p textType="body__primary">
              {t(
                PageText.Assistant.details.mapSection.walkDistance(
                  (tripPattern.streetDistance ?? 0).toFixed(),
                ),
              )}
            </Typo.p>
          </div>
        </div>
      </div>
      <GlobalMessages
        className={style.tripMessages}
        context={GlobalMessageContextEnum.plannerWebDetails}
      />
      <div className={style.tripContainer} data-testid="tripDetails">
        {requireTicketBooking && (
          <MessageBox
            type="info"
            message={t(PageText.Assistant.details.ticketBooking.globalMessage)}
          />
        )}
        {tripPattern.legs.map((leg: ExtendedLegType, index: number) => (
          <TripSection
            key={index}
            isFirst={index === 0}
            isLast={index === tripPattern.legs.length - 1}
            leg={leg as ExtendedLegType}
            interchangeDetails={getInterchangeDetails(
              tripPattern.legs,
              leg.interchangeTo?.toServiceJourney?.id,
              t,
            )}
            legWaitDetails={getLegWaitDetails(
              leg as ExtendedLegType,
              tripPattern.legs[index + 1],
            )}
          />
        ))}
      </div>
    </div>
  );
}
