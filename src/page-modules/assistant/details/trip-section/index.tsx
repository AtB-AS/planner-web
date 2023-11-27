import {
  DecorationLine,
  DepartureTime,
  TripRow,
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
import {
  type InterchangeDetails,
  formatLineName,
  getPlaceName,
} from '../utils';
import { MonoIcon } from '@atb/components/icon';
import { MessageBox } from '@atb/modules/situations';
import { PageText, useTranslation } from '@atb/translations';

export type TripSectionProps = {
  isFirst: boolean;
  isLast: boolean;
  leg: TripPatternWithDetails['legs'][0];
  interchangeDetails?: InterchangeDetails;
};
export default function TripSection({
  isFirst,
  isLast,
  leg,
  interchangeDetails,
}: TripSectionProps) {
  const { t } = useTranslation();
  const isWalkSection = leg.mode === 'foot';
  const legColor = useTransportationThemeColor({
    mode: leg.mode,
    subMode: leg.transportSubmode,
  });
  const unknownTransportationColor = useTransportationThemeColor({
    mode: 'unknown',
    subMode: undefined,
  });
  const showFrom = !isWalkSection || !!(isFirst && isWalkSection);
  const showTo = !isWalkSection || !!(isLast && isWalkSection);

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
                mode={{ mode: leg.mode, subMode: leg.transportSubmode }}
                size="small"
              />
            }
          >
            <Typo.p textType="body__primary--bold">
              {formatLineName(
                leg.fromEstimatedCall?.destinationDisplay.frontText,
                leg.line?.name,
                leg.line?.publicCode,
              )}
            </Typo.p>
          </TripRow>
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
      {interchangeDetails && leg.interchangeTo?.guaranteed && leg.line && (
        <div className={style.rowContainer}>
          <DecorationLine color={unknownTransportationColor.backgroundColor} />
          <TripRow rowLabel={<MonoIcon icon="actions/Interchange" />}>
            <MessageBox
              noStatusIcon
              type="info"
              message={
                leg.line.publicCode
                  ? t(
                      PageText.Assistant.details.tripSection.interchange(
                        leg.line.publicCode,
                        interchangeDetails.publicCode,
                        interchangeDetails.fromPlace,
                      ),
                    )
                  : t(
                      PageText.Assistant.details.tripSection.interchangeWithUnknownFromPublicCode(
                        interchangeDetails.publicCode,
                        interchangeDetails.fromPlace,
                      ),
                    )
              }
            />
          </TripRow>
        </div>
      )}
    </div>
  );
}
