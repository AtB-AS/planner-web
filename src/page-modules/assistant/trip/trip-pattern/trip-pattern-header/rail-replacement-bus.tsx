import { TripPattern } from '../../../server/journey-planner/validators';
import { useTranslation, PageText } from '@atb/translations';
import { ColorIcon } from '@atb/components/icon';

export const RailReplacementBusMessage = ({
  tripPattern,
}: {
  tripPattern: TripPattern;
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
