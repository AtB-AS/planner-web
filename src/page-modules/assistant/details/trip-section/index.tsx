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

export type TripSectionProps = {
  isFirst: boolean;
  isLast: boolean;
  leg: TripPatternWithDetails['legs'][0];
};
export default function TripSection({
  isFirst,
  isLast,
  leg,
}: TripSectionProps) {
  const isWalkSection = leg.mode === 'foot';
  const legColor = useTransportationThemeColor({
    mode: leg.mode,
    subMode: leg.line?.transportSubmode,
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
                mode={{ mode: leg.mode, subMode: leg.line?.transportSubmode }}
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
    </div>
  );
}

function formatQuayName(quayName?: string, publicCode?: string | null) {
  if (!quayName) return;
  if (!publicCode) return quayName;
  return `${quayName} ${publicCode}`;
}

function getPlaceName(
  placeName?: string,
  quayName?: string,
  publicCode?: string,
): string {
  const fallback = placeName ?? '';
  return quayName ? formatQuayName(quayName, publicCode) ?? fallback : fallback;
}

function formatLineName(
  frontText?: string,
  lineName?: string,
  publicCode?: string,
): string {
  const name = frontText ?? lineName ?? '';
  return publicCode ? `${publicCode} ${name}` : name;
}
