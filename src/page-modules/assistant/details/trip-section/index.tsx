import {
  DecorationLine,
  TripRow,
  useRealtimeText,
} from '@atb/modules/trip-details';
import style from './trip-section.module.css';
import {
  TransportIconWithDuration,
  useTransportationThemeColor,
} from '@atb/modules/transport-mode';
import { Typo } from '@atb/components/typography';
import WalkSection from './walk-section';
import { ColorIcon, MonoIcon } from '@atb/components/icon';
import { ButtonLink } from '@atb/components/button';
import { transportModeToTranslatedString } from '@atb/modules/transport-mode';
import { useTheme } from '@atb/modules/theme';
import { MessageBox } from '@atb/components/message-box';
import {
  SituationMessageBox,
  SituationOrNoticeIcon,
} from '@atb/modules/situations-and-notices';
import { PageText, useTranslation } from '@atb/translations';
import { InterchangeDetails, InterchangeSection } from './interchange-section';
import { getLineDestinationName, getPlaceName } from '../utils';
import WaitSection, { type LegWaitDetails } from './wait-section';
import { EstimatedCallsSection } from './estimated-calls-section';
import { DepartureTime } from '@atb/components/departure-time';
import { RealtimeSection } from './realtime-section';
import { getBookingStatus } from '@atb/modules/flexible';
import { BookingSection } from './booking-section';
import { ExtendedLegType } from '@atb/page-modules/assistant';
import { AuthoritySection } from './authority-section';

export type TripSectionProps = {
  isFirst: boolean;
  isLast: boolean;
  leg: ExtendedLegType;
  hasLiveVehicle?: boolean;
  interchangeDetails?: InterchangeDetails;
  legWaitDetails?: LegWaitDetails;
};
export default function TripSection({
  isFirst,
  isLast,
  leg,
  hasLiveVehicle,
  interchangeDetails,
  legWaitDetails,
}: TripSectionProps) {
  const { t } = useTranslation();
  const { color } = useTheme();
  const isWalkSection = leg.mode === 'foot';
  const isFlexible = !!leg.line?.flexibleLineType;
  const legColor = useTransportationThemeColor({
    transportMode: leg.mode,
    transportSubmode: leg.transportSubmode,
    isFlexible,
  });

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

  const departureDetailsHref =
    !isFlexible &&
    leg.serviceJourney?.id &&
    leg.serviceDate &&
    leg.fromPlace.quay?.id
      ? `/departures/details/${leg.serviceJourney.id}?date=${leg.serviceDate}&fromQuayId=${leg.fromPlace.quay.id}` +
        (leg.toPlace.quay?.id ? `&toQuayId=${leg.toPlace.quay.id}` : '')
      : undefined;

  return (
    <div className={style.container} data-testid="trip-leg">
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
                roundingMethod="floor"
              />
            }
            alignChildren="flex-start"
          >
            <Typo.p textType="body__m" testID="legFromName">
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
                textType="body__xs"
              >
                {leg.fromPlace.quay.description}
              </Typo.span>
            )}
          </TripRow>
        )}

        {isWalkSection ? (
          <WalkSection
            walkDuration={leg.duration}
            walkDistance={leg.distance}
          />
        ) : (
          <TripRow href={departureDetailsHref}>
            <div className={style.transportLine}>
              <TransportIconWithDuration
                transportMode={leg.mode}
                transportSubmode={leg.transportSubmode}
                label={leg.line?.publicCode ?? undefined}
                isFlexible={isFlexible}
              />
              <Typo.p textType="body__m__strong">
                {getLineDestinationName(
                  leg.fromEstimatedCall?.destinationDisplay?.frontText,
                  leg.line?.name,
                )}
              </Typo.p>
            </div>
            {isFlexible && (
              <Typo.p
                textType="body__s"
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
          <TripRow key={situation.id}>
            <SituationMessageBox
              situation={situation}
              statusIcon={<SituationOrNoticeIcon situation={situation} />}
            />
          </TripRow>
        ))}

        {leg.notices.map(
          (notice) =>
            notice.text && (
              <TripRow key={notice.id}>
                <MessageBox
                  type="info"
                  message={notice.text}
                  statusIcon={<ColorIcon icon="status/Info" />}
                />
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
          <TripRow>
            <MessageBox
              type="warning"
              statusIcon={<ColorIcon icon="status/Warning" />}
              message={t(
                PageText.Assistant.details.tripSection
                  .departureIsRailReplacementBus,
              )}
            />
          </TripRow>
        )}

        {leg.authority && <AuthoritySection authority={leg.authority} />}

        {realtimeText && <RealtimeSection realtimeText={realtimeText} />}

        {hasLiveVehicle && departureDetailsHref && (
          <TripRow>
            <ButtonLink
              href={departureDetailsHref}
              mode="secondary"
              backgroundColor={color.background.neutral[0]}
              size="pill"
              radiusSize="circular"
              display="inline"
              title={t(
                PageText.Assistant.details.tripSection.followVehicle(
                  t(transportModeToTranslatedString(leg.mode)).toLowerCase(),
                ),
              )}
              icon={{ left: <MonoIcon icon="map/Map" /> }}
            />
          </TripRow>
        )}

        <EstimatedCallsSection
          intermediateEstimatedCalls={leg.intermediateEstimatedCalls}
          duration={leg.duration}
        />

        {showTo && (
          <TripRow
            rowLabel={
              <DepartureTime
                aimedDepartureTime={leg.aimedEndTime}
                expectedDepartureTime={leg.expectedEndTime}
                realtime={leg.realtime}
                roundingMethod="ceil"
              />
            }
            alignChildren="flex-start"
          >
            <Typo.p textType="body__m" testID="legToName">
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
