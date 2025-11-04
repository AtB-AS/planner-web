import { Typo } from '@atb/components/typography';
import { TransportIcon } from '@atb/modules/transport-mode';
import { TripRow } from '@atb/modules/trip-details';
import { PageText, useTranslation } from '@atb/translations';
import { secondsToDuration } from '@atb/utils/date';
import style from './trip-section.module.css';
import { Mode } from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';

const MIN_SIGNIFICANT_WALK_IN_SECONDS = 30;

export type WalkSectionProps = {
  walkDuration: number;
};

export default function WalkSection({ walkDuration }: WalkSectionProps) {
  const { t, language } = useTranslation();
  const isWalkTimeOfSignificance =
    walkDuration > MIN_SIGNIFICANT_WALK_IN_SECONDS;
  return (
    <TripRow
      rowLabel={
        <TransportIcon mode={{ transportMode: Mode.Foot }} size="xSmall" />
      }
    >
      <Typo.p textType="body__s" className={style.walkTime}>
        {isWalkTimeOfSignificance
          ? t(
              PageText.Assistant.details.tripSection.walk.label(
                secondsToDuration(walkDuration, language),
              ),
            )
          : t(PageText.Assistant.details.tripSection.shortWalk)}
      </Typo.p>
    </TripRow>
  );
}
