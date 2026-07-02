import {
  GlobalMessageContextEnum,
  GlobalMessages,
} from '@atb/modules/global-messages';
import { MessageBox } from '@atb/components/message-box';
import TripSection from '@atb/page-modules/assistant/details/trip-section';
import { getInterchangeDetails } from '@atb/page-modules/assistant/details/trip-section/interchange-section.tsx';
import { getLegWaitDetails } from '@atb/page-modules/assistant/details/trip-section/wait-section.tsx';
import { TripSummaryPanel } from '@atb/page-modules/assistant/trip-summary-panel';
import { PageText, useTranslation } from '@atb/translations';
import { getBookingStatus } from '@atb/modules/flexible';
import style from './details-body.module.css';
import {
  ExtendedLegType,
  ExtendedTripPatternWithDetailsType,
} from '@atb/page-modules/assistant';

type DetailsBodyProps = {
  tripPattern: ExtendedTripPatternWithDetailsType;
};

export function AssistantDetailsBody({ tripPattern }: DetailsBodyProps) {
  const { t } = useTranslation();

  const requireTicketBooking = tripPattern.legs.some((leg: ExtendedLegType) => {
    if (!leg.bookingArrangements) return false;
    return (
      getBookingStatus(leg.bookingArrangements, leg.aimedStartTime, 7) !==
      'none'
    );
  });

  return (
    <div className={style.bodyContainer}>
      <div className={style.mapContainer}>
        <TripSummaryPanel
          tripPattern={tripPattern}
          shouldFetchPrice={true}
        />
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
