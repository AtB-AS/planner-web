import { Map } from '@atb/components/map';
import { MonoIcon } from '@atb/components/icon';
import { Typo } from '@atb/components/typography';
import {
  GlobalMessageContextEnum,
  GlobalMessages,
} from '@atb/modules/global-messages';
import { MessageBox } from '@atb/components/message-box';
import TripSection from '@atb/page-modules/assistant/details/trip-section';
import { getInterchangeDetails } from '@atb/page-modules/assistant/details/trip-section/interchange-section.tsx';
import { getLegWaitDetails } from '@atb/page-modules/assistant/details/trip-section/wait-section.tsx';
import { TripPatternWithDetails } from '@atb/page-modules/assistant/server/journey-planner/validators.ts';
import { formatTripDuration } from '@atb/utils/date.ts';
import { PageText, useTranslation } from '@atb/translations';
import { getBookingStatus } from '@atb/modules/flexible';
import style from './details-body.module.css';

type DetailsBodyProps = {
  tripPattern: TripPatternWithDetails;
};

export function AssistantDetailsBody({ tripPattern }: DetailsBodyProps) {
  const { t, language } = useTranslation();
  const mapLegs = tripPattern.legs.map((leg) => leg.mapLegs).flat();
  const { duration } = formatTripDuration(
    tripPattern.expectedStartTime,
    tripPattern.expectedEndTime,
    language,
  );

  const requireTicketBooking = tripPattern.legs.some(
    (leg) =>
      getBookingStatus(leg.bookingArrangements, leg.aimedStartTime, 7) !==
      'none',
  );

  return (
    <div>
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
                  tripPattern.walkDistance.toFixed(),
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
      <div className={style.tripContainer}>
        {requireTicketBooking && (
          <MessageBox
            type="info"
            message={t(PageText.Assistant.details.ticketBooking.globalMessage)}
          />
        )}
        {tripPattern.legs.map((leg, index) => (
          <TripSection
            key={index}
            isFirst={index === 0}
            isLast={index === tripPattern.legs.length - 1}
            leg={leg}
            interchangeDetails={getInterchangeDetails(
              tripPattern.legs,
              leg.interchangeTo?.toServiceJourney.id,
              t,
            )}
            legWaitDetails={getLegWaitDetails(leg, tripPattern.legs[index + 1])}
          />
        ))}
      </div>
    </div>
  );
}
