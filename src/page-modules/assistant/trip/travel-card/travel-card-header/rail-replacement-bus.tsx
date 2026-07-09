import { useTranslation, PageText } from '@atb/translations';
import { ColorIcon } from '@atb/components/icon';
import { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';

export const RailReplacementBusMessage = ({
  tripPattern,
}: {
  tripPattern: ExtendedTripPatternWithDetailsType;
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
      size="large"
      icon="status/Warning"
      alt={t(
        PageText.Assistant.trip.tripPattern.tripIncludesRailReplacementBus,
      )}
    />
  );
};
