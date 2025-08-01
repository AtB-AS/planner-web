import {
  DecorationLine,
  TripRow,
  useRealtimeText,
} from '@atb/modules/trip-details';
import style from './trip-section.module.css';
import {
  TransportIcon,
  useTransportationThemeColor,
} from '@atb/modules/transport-mode';
import { Typo } from '@atb/components/typography';
import WalkSection from './walk-section';
import { ColorIcon } from '@atb/components/icon';
import { MessageBox } from '@atb/components/message-box';
import {
  SituationMessageBox,
  SituationOrNoticeIcon,
} from '@atb/modules/situations';
import { PageText, useTranslation } from '@atb/translations';
import { InterchangeDetails, InterchangeSection } from './interchange-section';
import { formatLineName, getPlaceName } from '../utils';
import WaitSection, { type LegWaitDetails } from './wait-section';
import { EstimatedCallsSection } from './estimated-calls-section';
import { DepartureTime } from '@atb/components/departure-time';
import { RealtimeSection } from './realtime-section';
import { getBookingStatus } from '@atb/modules/flexible';
import { BookingSection } from './booking-section';
import { ExtendedLegType } from '@atb/page-modules/assistant';

export type TripSectionProps = {
  isFirst: boolean;
  isLast: boolean;
  leg: ExtendedLegType;
  interchangeDetails?: InterchangeDetails;
  legWaitDetails?: LegWaitDetails;
};
export default function TripSection({
  isFirst,
  isLast,
  leg,
  interchangeDetails,
  legWaitDetails,
}: TripSectionProps) {
  const { t } = useTranslation();
  const isWalkSection = leg.mode === 'foot';
  const isFlexible = !!leg.line?.flexibleLineType;
  const legColor = useTransportationThemeColor(
    {
      transportMode: leg.mode,
      transportSubModes: leg.transportSubmode && [leg.transportSubmode],
    },
    isFlexible,
  );

  const showFrom = !isWalkSection || (isFirst && isWalkSection);
  const showTo = !isWalkSection || (isLast && isWalkSection);

  const showInterchangeSection =
    interchangeDetails && leg.interchangeTo?.guaranteed && leg.line;

  const realtimeText = useRealtimeText(
    leg.serviceJourneyEstimatedCalls.map((estimatedCall) => ({
      actualDepartureTime: estimatedCall.actualDepartureTime,
      expectedDepartureTime: estimatedCall.expectedDepartureTime,
      aimedDepartureTime: estimatedCall.aimedDepartureTime,
      quayName: estimatedCall.quay.name,
      realtime: estimatedCall.realtime,
      cancelled: estimatedCall.cancellation,
    })),
  );

  const flexBookingNumberOfDaysAvailable =
    leg.authority?.id === 'ATB:Authority:2' ? 7 : undefined;

  const bookingStatus = getBookingStatus(
    leg.bookingArrangements,
    leg.aimedStartTime,
    flexBookingNumberOfDaysAvailable,
  );

  return (
    <div className={style.container}>
      <div className={style.rowContainer}>
        <DecorationLine
          hasStart={showFrom}
          hasEnd={showTo}
          color={legColor.backgroundColor}
        />

        {showFrom && (
          <TripRow
            rowLabel={
              <DepartureTime
                aimedDepartureTime={leg.aimedStartTime}
                expectedDepartureTime={leg.expectedStartTime}
                realtime={leg.realtime}
              />
            }
            alignChildren="flex-start"
          >
            <Typo.p textType="body__primary">
              {getPlaceName(
                t,
                leg.fromPlace.name,
                leg.fromPlace.quay?.name,
                leg.fromPlace.quay?.publicCode,
              )}
            </Typo.p>
            {leg.fromPlace.quay?.description && (
              <Typo.span
                className={style.textColor__secondary}
                textType="body__tertiary"
              >
                {leg.fromPlace.quay.description}
              </Typo.span>
            )}
          </TripRow>
        )}

        {isWalkSection ? (
          <WalkSection walkDuration={leg.duration} />
        ) : (
          <TripRow
            rowLabel={
              <TransportIcon
                mode={{
                  transportMode: leg.mode,
                  transportSubModes: leg.transportSubmode && [
                    leg.transportSubmode,
                  ],
                }}
                isFlexible={isFlexible}
                size="xSmall"
              />
            }
          >
            <Typo.p textType="body__primary--bold">
              {formatLineName(
                leg.fromEstimatedCall?.destinationDisplay?.frontText,
                leg.line?.name,
                leg.line?.publicCode,
              )}
            </Typo.p>
            {isFlexible && (
              <Typo.p
                textType="body__secondary"
                className={style.onDemandTransportLabel}
              >
                {t(
                  PageText.Assistant.details.tripSection.flexibleTransport
                    .onDemandTransportLabel,
                )}
              </Typo.p>
            )}
          </TripRow>
        )}

        {leg.situations.map((situation) => (
          <TripRow
            key={situation.id}
            rowLabel={<SituationOrNoticeIcon situation={situation} />}
          >
            <SituationMessageBox noStatusIcon situation={situation} />
          </TripRow>
        ))}

        {leg.notices.map(
          (notice) =>
            notice.text && (
              <TripRow
                key={notice.id}
                rowLabel={<ColorIcon icon="status/Info" />}
              >
                <MessageBox type="info" noStatusIcon message={notice.text} />
              </TripRow>
            ),
        )}

        {leg.bookingArrangements && bookingStatus !== 'none' && (
          <BookingSection
            bookingStatus={bookingStatus}
            bookingArrangements={leg.bookingArrangements}
            aimedStartTime={leg.aimedStartTime}
            flexBookingNumberOfDaysAvailable={flexBookingNumberOfDaysAvailable}
          />
        )}

        {leg.transportSubmode === 'railReplacementBus' && (
          <TripRow rowLabel={<ColorIcon icon="status/Warning" />}>
            <MessageBox
              type="warning"
              noStatusIcon
              message={t(
                PageText.Assistant.details.tripSection
                  .departureIsRailReplacementBus,
              )}
            />
          </TripRow>
        )}

        {realtimeText && <RealtimeSection realtimeText={realtimeText} />}

        <EstimatedCallsSection
          numberOfIntermediateEstimatedCalls={
            leg.intermediateEstimatedCalls.length
          }
          duration={leg.duration}
          serviceJourneyId={leg.serviceJourney?.id ?? null}
          date={leg.aimedStartTime.split('T')[0]}
          fromQuayId={leg.fromPlace.quay?.id ?? null}
        />

        {showTo && (
          <TripRow
            rowLabel={
              <DepartureTime
                aimedDepartureTime={leg.aimedEndTime}
                expectedDepartureTime={leg.expectedEndTime}
                realtime={leg.realtime}
              />
            }
            alignChildren="flex-start"
          >
            <Typo.p textType="body__primary">
              {getPlaceName(
                t,
                leg.toPlace.name,
                leg.toPlace.quay?.name,
                leg.toPlace.quay?.publicCode,
              )}
            </Typo.p>
          </TripRow>
        )}
      </div>
      {showInterchangeSection && (
        <InterchangeSection
          interchangeDetails={interchangeDetails}
          publicCode={leg.line?.publicCode}
          maximumWaitTime={leg.interchangeTo?.maximumWaitTime}
          staySeated={leg.interchangeTo?.staySeated}
        />
      )}

      <WaitSection legWaitDetails={legWaitDetails} />
    </div>
  );
}
