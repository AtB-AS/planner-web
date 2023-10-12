import {
  TransportModeFilterOption,
  transportModeFilterOptions,
  TransportModeFilterState,
} from '@atb/components/transport-mode-filter/types';
import { TransportModeFilterOptionType } from '@atb-as/config-specs';

export function getInitialTransportModeFilter(
  initialSelected?: TransportModeFilterOption[],
): TransportModeFilterState {
  return Object.fromEntries(
    transportModeFilterOptions.map((option) => [
      option,
      initialSelected?.includes(option) ?? true,
    ]),
  ) as TransportModeFilterState;
}

export function setAllValues<T extends string, U>(
  obj: Record<T, boolean>,
  value: boolean,
): U {
  return Object.fromEntries(Object.keys(obj).map((key) => [key, value])) as U;
}

export function filterToQueryString(
  filters: TransportModeFilterState,
): string | null {
  if (Object.values(filters).every(Boolean)) return null;
  if (Object.values(filters).every((selected) => !selected)) return 'none';
  return Object.entries(filters)
    .filter(([, selected]) => selected)
    .map(([filter]) => filter)
    .join(',');
}

export const filterOptionsWithTransportModes: Record<
  TransportModeFilterOption,
  TransportModeFilterOptionType
> = {
  bus: {
    id: 'bus',
    icon: {
      transportMode: 'bus',
    },
    text: [
      { lang: 'nob', value: 'Buss' },
      { lang: 'eng', value: 'Bus' },
      { lang: 'nno', value: 'Buss' },
    ],
    modes: [
      {
        transportMode: 'bus',
        transportSubModes: [
          'dedicatedLaneBus',
          'demandAndResponseBus',
          'expressBus',
          'localBus',
          'highFrequencyBus',
          'mobilityBus',
          'mobilityBusForRegisteredDisabled',
          'nightBus',
          'postBus',
          'railReplacementBus',
          'regionalBus',
          'riverBus',
          'schoolAndPublicServiceBus',
          'schoolBus',
          'shuttleBus',
          'sightseeingBus',
          'specialNeedsBus',
        ],
      },
      { transportMode: 'coach' },
      { transportMode: 'trolleybus' },
    ],
  },
  rail: {
    id: 'rail',
    icon: {
      transportMode: 'rail',
    },
    text: [
      { lang: 'nob', value: 'Tog' },
      { lang: 'eng', value: 'Train' },
      { lang: 'nno', value: 'Tog' },
    ],
    modes: [
      { transportMode: 'rail' },
      {
        transportMode: 'bus',
        transportSubModes: ['railReplacementBus'],
      },
    ],
  },
  expressboat: {
    id: 'expressboat',
    icon: {
      transportMode: 'water',
      transportSubMode: 'highSpeedPassengerService',
    },
    text: [
      { lang: 'nob', value: 'Hurtigbåt' },
      { lang: 'eng', value: 'Express boat' },
      { lang: 'nno', value: 'Hurtigbåt' },
    ],
    modes: [
      {
        transportMode: 'water',
        transportSubModes: [
          'highSpeedPassengerService',
          'highSpeedVehicleService',
          'sightseeingService',
          'localPassengerFerry',
          'internationalPassengerFerry',
        ],
      },
    ],
  },
  ferry: {
    id: 'ferry',
    icon: {
      transportMode: 'water',
    },
    text: [
      { lang: 'nob', value: 'Bilferge' },
      { lang: 'eng', value: 'Car ferry' },
      { lang: 'nno', value: 'Bilferje' },
    ],
    modes: [
      {
        transportMode: 'water',
        transportSubModes: [
          'highSpeedVehicleService',
          'internationalCarFerry',
          'localCarFerry',
          'nationalCarFerry',
        ],
      },
    ],
  },
  airportbus: {
    id: 'airportbus',
    icon: {
      transportMode: 'bus',
    },
    text: [
      { lang: 'nob', value: 'Flybuss' },
      { lang: 'eng', value: 'Airport bus' },
      { lang: 'nno', value: 'Flybuss' },
    ],
    modes: [
      {
        transportMode: 'bus',
        transportSubModes: ['airportLinkBus'],
      },
    ],
  },
  air: {
    id: 'air',
    icon: {
      transportMode: 'air',
    },
    text: [
      { lang: 'nob', value: 'Fly' },
      { lang: 'eng', value: 'Plane' },
      { lang: 'nno', value: 'Fly' },
    ],
    modes: [{ transportMode: 'air' }],
  },
  other: {
    id: 'other',
    icon: {
      transportMode: 'unknown',
    },
    text: [
      { lang: 'nob', value: 'Annet' },
      { lang: 'eng', value: 'Other' },
      { lang: 'nno', value: 'Anna' },
    ],
    description: [
      { lang: 'nob', value: 'Trikk, t-bane, gondoler, kabelbane, …' },
      { lang: 'eng', value: 'Tram, metro, cableway, funicular, …' },
      { lang: 'nno', value: 'Trikk, t-bane, gondolar, kabelbane, …' },
    ],
    modes: [
      { transportMode: 'tram' },
      { transportMode: 'metro' },
      { transportMode: 'cableway' },
      { transportMode: 'funicular' },
      { transportMode: 'monorail' },
      { transportMode: 'lift' },
    ],
  },
};
