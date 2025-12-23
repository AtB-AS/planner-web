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
import { TransportModeType, TransportSubmodeType } from '@atb-as/config-specs';

export type TransportIconProps = {
  transportMode: TransportModeType;
  transportSubmode?: TransportSubmodeType;
  size?: MonoIconProps['size'];
  isFlexible?: boolean;
};

export function TransportIcon({
  transportMode,
  transportSubmode,
  size = 'normal',
  isFlexible,
}: TransportIconProps) {
  const { t } = useTranslation();
  const { backgroundColor, overrideMode } = useTransportationThemeColor({
    transportMode,
    transportSubmode,
    isFlexible,
  });
  return (
    <span className={style.transportIcon} style={{ backgroundColor }}>
      <MonoIcon
        size={size}
        icon={getTransportModeIcon(transportMode, transportSubmode)}
        role="img"
        alt={t(transportModeToTranslatedString(transportMode))}
        overrideMode={overrideMode}
      />
    </span>
  );
}
export function TransportMonoIcon({
  transportMode,
  transportSubmode,
}: TransportIconProps) {
  const { t } = useTranslation();
  return (
    <MonoIcon
      icon={getTransportModeIcon(transportMode, transportSubmode)}
      role="img"
      alt={t(transportModeToTranslatedString(transportMode))}
    />
  );
}

export type TransportIconWithLabelProps = {
  transportMode: TransportModeType;
  transportSubmode?: TransportSubmodeType;
  label?: string;
  duration?: number;
  isFlexible?: boolean;
};

export function TransportIconWithLabel({
  transportMode,
  transportSubmode,
  label,
  duration,
  isFlexible,
}: TransportIconWithLabelProps) {
  const { t } = useTranslation();
  const {
    color: { background },
  } = useTheme();
  let colors = useTransportationThemeColor({
    transportMode,
    transportSubmode,
    isFlexible,
  });

  // Walking legs should have a lighter background color in the trip pattern view.
  if (transportMode === 'foot') {
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
        icon={getTransportModeIcon(transportMode, transportSubmode)}
        role="img"
        alt={t(transportModeToTranslatedString(transportMode))}
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
          textType="body__xs"
          style={{ color: colors.textColor }}
          className={style.transportIconWithLabel__duration}
        >
          {Math.max(secondsToMinutes(duration), 1)}
        </Typo.span>
      )}
    </span>
  );
}

export function useTransportationThemeColor(props: {
  transportMode: TransportModeType;
  transportSubmode?: TransportSubmodeType;
  isFlexible?: boolean;
}) {
  const {
    color: { transport },
  } = useTheme();
  let color = transportModeToColor(
    transport,
    props.transportMode,
    props.transportSubmode,
    props.isFlexible,
  );
  return {
    backgroundColor: color.background,
    textColor: color.foreground.primary,
    overrideMode: colorToOverrideMode(color.foreground.primary),
  };
}

export function transportModeToColor(
  transportColors: TransportColors,
  transportMode: TransportModeType,
  transportSubMode?: TransportSubmodeType,
  isFlexible?: boolean,
): ContrastColor {
  if (isFlexible) return transportColors.flexible.primary;
  switch (transportMode) {
    case 'bus':
    case 'coach':
      if (transportSubMode === TransportSubmode.LocalBus) {
        return transportColors.city.primary;
      }
      if (transportSubMode === TransportSubmode.AirportLinkBus) {
        return transportColors.airportExpress.primary;
      }
      return transportColors.region.primary;

    case 'rail':
      if (transportSubMode === TransportSubmode.AirportLinkRail) {
        return transportColors.airportExpress.primary;
      }
      return transportColors.train.primary;

    case 'tram':
      return transportColors.city.primary;

    case 'bicycle':
      return transportColors.bike.primary;

    case 'water':
      return transportColors.boat.primary;

    case 'air':
      return transportColors.other.primary;

    case 'metro':
      return transportColors.train.primary;

    default:
      return transportColors.other.primary;
  }
}

export function getTransportModeIcon(
  transportMode: TransportModeType,
  transportSubmode?: TransportSubmodeType,
): MonoIconProps['icon'] {
  switch (transportMode) {
    case 'bus':
    case 'coach':
      return 'transportation/BusFill';
    case 'tram':
      return 'transportation/TramFill';
    case 'rail':
      return 'transportation/TrainFill';
    case 'foot':
      return 'transportation/WalkFill';
    case 'bicycle':
      return 'transportation/BicycleFill';
    case 'air':
      return 'transportation/PlaneFill';
    case 'water':
      return isSubModeBoat(transportSubmode)
        ? 'transportation/BoatFill'
        : 'transportation/FerryFill';
    case 'metro':
      return 'transportation/MetroFill';
    default:
      return 'transportation/UnknownFill';
  }
}
