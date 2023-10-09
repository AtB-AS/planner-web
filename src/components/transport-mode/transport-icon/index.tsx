import { TransportModeGroup, TransportSubmode } from '../types';

import { ContrastColor, Theme } from '@atb-as/theme';
import MonoIcon, { MonoIconProps } from '@atb/components/icon/mono-icon';
import { useTheme } from '@atb/modules/theme';

import { useTranslation } from '@atb/translations';
import { transportModeToTranslatedString } from '../utils';
import style from './transport-icon.module.css';
import { colorToOverrideColor } from '@atb/utils/color';

export type TransportIconsProps = {
  modes: TransportModeGroup[];
};
export function TransportIcons({ modes }: TransportIconsProps) {
  return (
    <div className={style.transportIcons}>
      {modes.map((mode) => (
        <TransportIcon key={mode.mode + mode.subMode} mode={mode} />
      ))}
    </div>
  );
}

export type TransportIconProps = {
  mode: TransportModeGroup;
};

export function TransportIcon({ mode }: TransportIconProps) {
  const { t } = useTranslation();
  const { backgroundColor, overrideMode } = useTransportationThemeColor(mode);
  return (
    <span className={style.transportIcon} style={{ backgroundColor }}>
      <MonoIcon
        icon={getTransportModeIcon(mode)}
        role="img"
        alt={t(transportModeToTranslatedString(mode))}
        overrideMode={overrideMode}
      />
    </span>
  );
}

export function useTransportationThemeColor(mode: TransportModeGroup) {
  const { transport } = useTheme();
  let color = modeToColor(mode, transport);
  return {
    backgroundColor: color.background,
    textColor: color.text,
    overrideMode: (colorToOverrideColor(color.text) == 'black'
      ? 'light'
      : 'dark') as MonoIconProps['overrideMode'],
  };
}

const TRANSPORT_SUB_MODES_BOAT: TransportSubmode[] = [
  TransportSubmode.HighSpeedPassengerService,
  TransportSubmode.HighSpeedVehicleService,
  TransportSubmode.NationalPassengerFerry,
  TransportSubmode.LocalPassengerFerry,
  TransportSubmode.SightseeingService,
];

function modeToColor(
  mode: TransportModeGroup,
  transport: Theme['transport'],
): ContrastColor {
  switch (mode.mode) {
    case 'bus':
    case 'coach':
      if (mode.subMode === 'localBus') {
        return transport.transport_city.primary;
      }
      if (mode.subMode === 'airportLinkBus') {
        return transport.transport_airport_express.primary;
      }
      return transport.transport_region.primary;

    case 'rail':
      if (mode.subMode === 'airportLinkRail') {
        return transport.transport_airport_express.primary;
      }
      return transport.transport_train.primary;

    case 'tram':
      return transport.transport_city.primary;

    case 'water':
      return transport.transport_boat.primary;

    case 'air':
      return transport.transport_plane.primary;

    case 'metro':
      return transport.transport_train.primary;

    default:
      return transport.transport_other.primary;
  }
}

function getTransportModeIcon(mode: TransportModeGroup): MonoIconProps['icon'] {
  switch (mode.mode) {
    case 'bus':
    case 'coach':
      return 'transportation/Bus';
    case 'tram':
      return 'transportation/Tram';
    case 'rail':
      return 'transportation/Train';
    case 'air':
      return 'transportation-entur/Plane';
    case 'water':
      return mode.subMode && TRANSPORT_SUB_MODES_BOAT.includes(mode.subMode)
        ? 'transportation/Boat'
        : 'transportation/Ferry';
    case 'metro':
      return 'transportation-entur/Subway';
    default:
      return 'transportation/Unknown';
  }
}
