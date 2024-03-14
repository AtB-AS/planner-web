import {
  DecorationLine,
  TripRow,
  useRealtimeText,
} from '@atb/modules/trip-details';
import { TripPatternWithDetails } from '../../server/journey-planner/validators';
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

export type TripSectionProps = {
  isFirst: boolean;
  isLast: boolean;
  leg: TripPatternWithDetails['legs'][0];
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
  const legColor = useTransportationThemeColor({
    transportMode: leg.mode,
    transportSubModes: leg.transportSubmode && [leg.transportSubmode],
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
                leg.fromPlace.name,
                leg.fromPlace.quay?.name,
                leg.fromPlace.quay?.publicCode,
              )}
            </Typo.p>
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
            leg.numberOfIntermediateEstimatedCalls
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
        />
      )}

      <WaitSection legWaitDetails={legWaitDetails} />
    </div>
  );
}
