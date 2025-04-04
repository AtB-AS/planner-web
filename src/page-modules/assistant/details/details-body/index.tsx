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
import { formatTripDuration } from '@atb/utils/date.ts';
import { PageText, useTranslation } from '@atb/translations';
import { getBookingStatus } from '@atb/modules/flexible';
import style from './details-body.module.css';
import {
  ExtendedLegType,
  ExtendedTripPatternWithDetailsType,
} from '@atb/page-modules/assistant';
import { tripQueryStringToQueryParams } from '@atb/page-modules/assistant/details/utils.ts';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

type DetailsBodyProps = {
  tripPattern: ExtendedTripPatternWithDetailsType;
};

export function AssistantDetailsBody({ tripPattern }: DetailsBodyProps) {
  const { t, language } = useTranslation();
  const router = useRouter();
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
    <motion.div
      className={style.bodyContainer}
      initial={{ height: 0, originY: 0 }}
      animate={{ height: 'auto' }}
      exit={{ height: 0 }}
    >
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
    </motion.div>
  );
}
