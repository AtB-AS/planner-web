import { TransportModeType } from '@atb-as/config-specs';
import { ButtonLink } from '@atb/components/button';
import { MonoIcon } from '@atb/components/icon';
import { TransportMonoIcon } from '@atb/components/transport-mode';
import { type TripPattern } from '@atb/page-modules/assistant/server/journey-planner/validators';
import { PageText, TranslateFunction, useTranslation } from '@atb/translations';
import { secondsToDurationShort } from '@atb/utils/date';
import { NonTransitTripData } from '..';

type NonTransitTripProps = {
  tripPattern: TripPattern;
  nonTransitType: keyof NonTransitTripData;
};
export function NonTransitTrip({
  tripPattern,
  nonTransitType,
}: NonTransitTripProps) {
  const { t, language } = useTranslation();

  if (!tripPattern) {
    return null;
  }

  const { mode, modeText } = getMode(tripPattern, t);

  const durationShort = secondsToDurationShort(tripPattern.duration, language);

  return (
    <ButtonLink
      radiusSize="circular"
      size="pill"
      href="/assistant"
      title={`${modeText} ${durationShort}`}
      icon={{
        left: <TransportMonoIcon mode={{ mode }} />,
        right: <MonoIcon icon="navigation/ArrowRight" />,
      }}
    />
  );
}

const getMode = (
  tp: TripPattern,
  t: TranslateFunction,
): { mode: TransportModeType; modeText: string } => {
  let mode = tp.legs[0].mode ?? 'unknown';
  let text = t(PageText.Assistant.nonTransit.unknown);

  if (tp.legs.some((leg) => leg.rentedBike)) {
    mode = 'bicycle';
    text = t(PageText.Assistant.nonTransit.bikeRental);
  } else if (tp.legs[0].mode === 'foot') {
    text = t(PageText.Assistant.nonTransit.foot);
  } else if (tp.legs[0].mode === 'bicycle') {
    text = t(PageText.Assistant.nonTransit.bicycle);
  }

  return { mode, modeText: text };
};
