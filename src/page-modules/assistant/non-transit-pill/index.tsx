import { Button } from '@atb/components/button';
import { MonoIcon } from '@atb/components/icon';
import {
  TransportMonoIcon,
  type TransportModeType,
} from '@atb/modules/transport-mode';
import { PageText, TranslateFunction, useTranslation } from '@atb/translations';
import { secondsToDurationShort } from '@atb/utils/date';
import { useOpenTrip } from '@atb/page-modules/trip/use-open-trip';
import type { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';

type NonTransitTripProps = {
  nonTransit: {
    mode: TransportModeType;
    rentedBike: boolean;
    duration: number;
    tripPattern: ExtendedTripPatternWithDetailsType;
  };
};
export function NonTransitTrip({ nonTransit }: NonTransitTripProps) {
  const { t, language } = useTranslation();
  const { openTrip, isLoading } = useOpenTrip();

  if (!nonTransit) {
    return null;
  }

  const { mode, modeText } = getMode(nonTransit, t);
  const durationShort = secondsToDurationShort(nonTransit.duration, language);

  return (
    <Button
      radiusSize="circular"
      size="pill"
      onClick={() => openTrip(nonTransit.tripPattern)}
      state={isLoading ? 'loading' : 'none'}
      title={`${modeText} ${durationShort}`}
      testID={`non-transit-pill-${mode}`}
      icon={{
        left: <TransportMonoIcon transportMode={mode} />,
        right: <MonoIcon icon="navigation/ArrowRight" />,
      }}
    />
  );
}

const getMode = (
  opts: { mode: TransportModeType; rentedBike: boolean },
  t: TranslateFunction,
): { mode: TransportModeType; modeText: string } => {
  let mode = opts.mode;
  let text = t(PageText.Assistant.trip.nonTransit.unknown);

  if (opts.rentedBike) {
    text = t(PageText.Assistant.trip.nonTransit.bikeRental);
  } else if (mode === 'foot') {
    text = t(PageText.Assistant.trip.nonTransit.foot);
  } else if (mode === 'bicycle') {
    text = t(PageText.Assistant.trip.nonTransit.bicycle);
  }

  return { mode, modeText: text };
};
