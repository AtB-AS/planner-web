import { TransportModeGroup } from '../types';
import MonoIcon, { MonoIconProps } from '@atb/components/icon/mono-icon';
import { ContrastColor, TransportColors, useTheme } from '@atb/modules/theme';
import { useTranslation } from '@atb/translations';
import { isSubModeBoat, transportModeToTranslatedString } from '../utils';
import { colorToOverrideMode } from '@atb/utils/color';
import { Typo } from '@atb/components/typography';
import { secondsToMinutes } from 'date-fns';

import style from './icon.module.css';
import { TransportSubmode } from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';

export type TransportIconsProps = {
  modes: TransportModeGroup[];
};
export function TransportIcons({ modes }: TransportIconsProps) {
  return (
    <div className={style.transportIcons}>
      {modes.map((mode) => (
        <TransportIcon
          key={mode.transportMode ?? '' + mode.transportSubModes}
          mode={mode}
        />
      ))}
    </div>
  );
}

export type TransportIconProps = {
  mode: TransportModeGroup;
  size?: MonoIconProps['size'];
  isFlexible?: boolean;
};

export function TransportIcon({
  mode,
  size = 'normal',
  isFlexible,
}: TransportIconProps) {
  const { t } = useTranslation();
  const { backgroundColor, overrideMode } = useTransportationThemeColor(
    mode,
    isFlexible,
  );
  return (
    <span className={style.transportIcon} style={{ backgroundColor }}>
      <MonoIcon
        size={size}
        icon={getTransportModeIcon(mode)}
        role="img"
        alt={t(transportModeToTranslatedString(mode))}
        overrideMode={overrideMode}
      />
    </span>
  );
}
export function TransportMonoIcon({ mode }: TransportIconProps) {
  const { t } = useTranslation();
  return (
    <MonoIcon
      icon={getTransportModeIcon(mode)}
      role="img"
      alt={t(transportModeToTranslatedString(mode))}
    />
  );
}

export type TransportIconWithLabelProps = {
  mode: TransportModeGroup;
  label?: string;
  duration?: number;
  isFlexible?: boolean;
};

export function TransportIconWithLabel({
  mode,
  label,
  duration,
  isFlexible,
}: TransportIconWithLabelProps) {
  const { t } = useTranslation();
  const {
    color: { background },
  } = useTheme();
  let colors = useTransportationThemeColor(mode, isFlexible);

  // Walking legs should have a lighter background color in the trip pattern view.
  if (mode.transportMode === 'foot') {
    colors = {
      backgroundColor: background.neutral[2].background,
      textColor: background.neutral[2].foreground.primary,
      overrideMode: colorToOverrideMode(
        background.neutral[2].foreground.primary,
      ),
    };
  }

  return (
    <span
      className={style.transportIconWithLabel}
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <MonoIcon
        icon={getTransportModeIcon(mode)}
        role="img"
        alt={t(transportModeToTranslatedString(mode))}
        overrideMode={colors.overrideMode}
      />
      {label && (
        <span
          style={{ color: colors.textColor }}
          className={style.transportIconWithLabel__label}
        >
          {label}
        </span>
      )}
      {!label && duration && (
        <Typo.span
          textType="body__tertiary"
          style={{ color: colors.textColor }}
          className={style.transportIconWithLabel__duration}
        >
          {Math.max(secondsToMinutes(duration), 1)}
        </Typo.span>
      )}
    </span>
  );
}

export function useTransportationThemeColor(
  mode: TransportModeGroup,
  isFlexible?: boolean,
) {
  const {
    color: { transport },
  } = useTheme();
  let color = transportModeToColor(mode, transport, isFlexible);
  return {
    backgroundColor: color.background,
    textColor: color.foreground.primary,
    overrideMode: colorToOverrideMode(color.foreground.primary),
  };
}

export function transportModeToColor(
  mode: TransportModeGroup,
  transport: TransportColors,
  isFlexible?: boolean,
): ContrastColor {
  if (isFlexible) return transport.flexible.primary;
  switch (mode.transportMode) {
    case 'bus':
    case 'coach':
      if (mode.transportSubModes?.includes(TransportSubmode.LocalBus)) {
        return transport.city.primary;
      }
      if (mode.transportSubModes?.includes(TransportSubmode.AirportLinkBus)) {
        return transport.airportExpress.primary;
      }
      return transport.region.primary;

    case 'rail':
      if (mode.transportSubModes?.includes(TransportSubmode.AirportLinkRail)) {
        return transport.airportExpress.primary;
      }
      return transport.train.primary;

    case 'tram':
      return transport.city.primary;

    case 'bicycle':
      return transport.bike.primary;

    case 'water':
      return transport.boat.primary;

    case 'air':
      return transport.other.primary;

    case 'metro':
      return transport.train.primary;

    default:
      return transport.other.primary;
  }
}

export function getTransportModeIcon(
  mode: TransportModeGroup,
): MonoIconProps['icon'] {
  switch (mode.transportMode) {
    case 'bus':
    case 'coach':
      return 'transportation/Bus';
    case 'tram':
      return 'transportation/Tram';
    case 'rail':
      return 'transportation/Train';
    case 'foot':
      return 'transportation/Walk';
    case 'bicycle':
      return 'transportation-entur/Bicycle';
    case 'air':
      return 'transportation-entur/Plane';
    case 'water':
      return isSubModeBoat(mode.transportSubModes)
        ? 'transportation/Boat'
        : 'transportation/Ferry';
    case 'metro':
      return 'transportation-entur/Subway';
    default:
      return 'transportation/Unknown';
  }
}
