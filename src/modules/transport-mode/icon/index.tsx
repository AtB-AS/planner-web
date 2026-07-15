import MonoIcon, { MonoIconProps } from '@atb/components/icon/mono-icon';
import { ColorIcon } from '@atb/components/icon';
import {
  ContrastColor,
  Statuses,
  TransportColors,
  useTheme,
} from '@atb/modules/theme';
import { useTranslation } from '@atb/translations';
import { isSubModeBoat, transportModeToTranslatedString } from '../utils';
import { colorToOverrideMode } from '@atb/utils/color';
import { secondsToMinutes, secondsToMinutesShort } from '@atb/utils/date';
import { messageTypeToColorIcon } from '@atb/modules/situations-and-notices';
import { and } from '@atb/utils/css';

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
  const {
    color: { background },
  } = useTheme();
  let { backgroundColor, overrideMode } = useTransportationThemeColor({
    transportMode,
    transportSubmode,
    isFlexible,
  });

  if (transportMode === 'foot') {
    backgroundColor = background.neutral[2].background;
    overrideMode = colorToOverrideMode(
      background.neutral[2].foreground.primary,
    );
  }

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

export type TransportIconWithDurationProps = {
  transportMode: TransportModeType;
  transportSubmode?: TransportSubmodeType;
  label?: string;
  duration?: number;
  isFlexible?: boolean;
  notificationType?: Statuses;
};

export function TransportIconWithDuration({
  transportMode,
  transportSubmode,
  label,
  duration,
  isFlexible,
  notificationType,
}: TransportIconWithDurationProps) {
  const { t, language } = useTranslation();
  const {
    color: { background },
  } = useTheme();
  let colors = useTransportationThemeColor({
    transportMode,
    transportSubmode,
    isFlexible,
  });

  if (transportMode === 'foot') {
    colors = {
      backgroundColor: background.neutral[2].background,
      textColor: background.neutral[2].foreground.primary,
      overrideMode: colorToOverrideMode(
        background.neutral[2].foreground.primary,
      ),
    };
  }

  const modeName = t(transportModeToTranslatedString(transportMode));
  const pillA11yLabel = label
    ? `${modeName} ${label}`
    : duration
      ? `${modeName} ${secondsToMinutesShort(duration, language)}`
      : modeName;

  const pill = (
    <span
      role="img"
      aria-label={pillA11yLabel}
      className={and(
        style.transportIconWithLabel,
        notificationType && style.transportIconWithLabel__hasNotification,
      )}
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <MonoIcon
        icon={getTransportModeIcon(transportMode, transportSubmode)}
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
        <span
          style={{ color: colors.textColor }}
          className={style.transportIconWithLabel__label}
        >
          {secondsToMinutes(duration)}
        </span>
      )}
    </span>
  );

  if (!notificationType) return pill;

  return (
    <span className={style.transportIconWithLabelContainer}>
      {pill}
      <TransportNotificationBadge notificationType={notificationType} />
    </span>
  );
}

export type TransportNotificationBadgeProps = {
  notificationType: Statuses;
};

export function TransportNotificationBadge({
  notificationType,
}: TransportNotificationBadgeProps) {
  return (
    <span className={style.transportIconNotification} aria-hidden="true">
      <ColorIcon
        icon={messageTypeToColorIcon(notificationType)}
        size="normal"
      />
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
  const color = transportModeToColor(
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
