import { useTranslation, PageText } from '@atb/translations';
import { ColorIcon } from '@atb/components/icon';
import { ExtendedTripPatternType } from '@atb/page-modules/assistant';

export const RailReplacementBusMessage = ({
  tripPattern,
}: {
  tripPattern: ExtendedTripPatternType;
}) => {
  const { t } = useTranslation();

  if (
    !tripPattern.legs.some(
      (leg) => leg.transportSubmode === 'railReplacementBus',
    )
  ) {
    return null;
  }

  return (
    <ColorIcon
      icon="status/Warning"
      alt={t(
        PageText.Assistant.trip.tripPattern.tripIncludesRailReplacementBus,
      )}
    />
  );
};
