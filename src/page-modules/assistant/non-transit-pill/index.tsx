import { ButtonLink } from '@atb/components/button';
import { MonoIcon } from '@atb/components/icon';
import {
  TransportMonoIcon,
  type TransportModeType,
} from '@atb/modules/transport-mode';
import { PageText, TranslateFunction, useTranslation } from '@atb/translations';
import { secondsToDurationShort } from '@atb/utils/date';
import { Mode } from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';

type NonTransitTripProps = {
  nonTransit: {
    mode: TransportModeType;
    rentedBike: boolean;
    duration: number;
    compressedQuery: string;
  };
};
export function NonTransitTrip({ nonTransit }: NonTransitTripProps) {
  const { t, language } = useTranslation();

  if (!nonTransit) {
    return null;
  }

  const { mode, modeText } = getMode(nonTransit, t);
  const durationShort = secondsToDurationShort(nonTransit.duration, language);

  return (
    <ButtonLink
      radiusSize="circular"
      size="pill"
      href={`/assistant/${nonTransit.compressedQuery}`}
      title={`${modeText} ${durationShort}`}
      testID={`non-transit-pill-${mode}`}
      icon={{
        left: <TransportMonoIcon mode={{ transportMode: mode }} />,
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
