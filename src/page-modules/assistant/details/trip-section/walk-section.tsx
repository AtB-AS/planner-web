import { Typo } from '@atb/components/typography';
import { TransportIcon } from '@atb/modules/transport-mode';
import { TripRow } from '@atb/modules/trip-details';
import { PageText, useTranslation } from '@atb/translations';
import { secondsToDuration } from '@atb/utils/date';
import { humanizeDistance } from '@atb/utils/distance';
import style from './trip-section.module.css';
import { Mode } from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';

const MIN_SIGNIFICANT_WALK_IN_SECONDS = 30;

export type WalkSectionProps = {
  walkDuration: number;
  walkDistance?: number;
};

export default function WalkSection({
  walkDuration,
  walkDistance,
}: WalkSectionProps) {
  const { t, language } = useTranslation();
  const isWalkTimeOfSignificance =
    walkDuration > MIN_SIGNIFICANT_WALK_IN_SECONDS;

  const durationText = secondsToDuration(walkDuration, language);
  const distanceText = walkDistance ? humanizeDistance(walkDistance, t) : '';

  const walkText = !isWalkTimeOfSignificance
    ? t(PageText.Assistant.details.tripSection.shortWalk)
    : distanceText
      ? t(
          PageText.Assistant.details.tripSection.walk.labelWithDistance(
            durationText,
            distanceText,
          ),
        )
      : t(PageText.Assistant.details.tripSection.walk.label(durationText));

  return (
    <TripRow>
      <div className={style.transportLine}>
        <TransportIcon transportMode={Mode.Foot} rounded={true} />
        <Typo.p textType="body__s" className={style.walkTime}>
          {walkText}
        </Typo.p>
      </div>
    </TripRow>
  );
}
