import { TransportModeFilterOptionType } from '../types';

export const filter: TransportModeFilterOptionType[] = [
  {
    id: 'bus',
    icon: {
      transportMode: 'bus',
    },
    text: [
      {
        lang: 'nob',
        value: 'Buss',
      },
      {
        lang: 'eng',
        value: 'Bus',
      },
      {
        lang: 'nno',
        value: 'Buss',
      },
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
      {
        transportMode: 'coach',
      },
      {
        transportMode: 'trolleybus',
      },
    ],
    selectedAsDefault: true,
  },
  {
    id: 'rail',
    icon: {
      transportMode: 'rail',
    },
    text: [
      {
        lang: 'nob',
        value: 'Tog',
      },
      {
        lang: 'eng',
        value: 'Train',
      },
      {
        lang: 'nno',
        value: 'Tog',
      },
    ],
    modes: [
      {
        transportMode: 'rail',
      },
      {
        transportMode: 'bus',
        transportSubModes: ['railReplacementBus'],
      },
    ],
    selectedAsDefault: false,
  },
  {
    id: 'expressboat',
    icon: {
      transportMode: 'water',
      transportSubMode: 'highSpeedPassengerService',
    },
    text: [
      {
        lang: 'nob',
        value: 'Hurtigbåt',
      },
      {
        lang: 'eng',
        value: 'Express boat',
      },
      {
        lang: 'nno',
        value: 'Hurtigbåt',
      },
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
    selectedAsDefault: true,
  },
  {
    id: 'ferry',
    icon: {
      transportMode: 'water',
    },
    text: [
      {
        lang: 'nob',
        value: 'Bilferge',
      },
      {
        lang: 'eng',
        value: 'Car ferry',
      },
      {
        lang: 'nno',
        value: 'Bilferje',
      },
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
    selectedAsDefault: true,
  },
  {
    id: 'airportbus',
    icon: {
      transportMode: 'bus',
    },
    text: [
      {
        lang: 'nob',
        value: 'Flybuss',
      },
      {
        lang: 'eng',
        value: 'Airport bus',
      },
      {
        lang: 'nno',
        value: 'Flybuss',
      },
    ],
    modes: [
      {
        transportMode: 'bus',
        transportSubModes: ['airportLinkBus'],
      },
    ],
    selectedAsDefault: true,
  },
  {
    id: 'air',
    icon: {
      transportMode: 'air',
    },
    text: [
      {
        lang: 'nob',
        value: 'Fly',
      },
      {
        lang: 'eng',
        value: 'Plane',
      },
      {
        lang: 'nno',
        value: 'Fly',
      },
    ],
    modes: [
      {
        transportMode: 'air',
      },
    ],
    selectedAsDefault: false,
  },
  {
    id: 'other',
    icon: {
      transportMode: 'unknown',
    },
    text: [
      {
        lang: 'nob',
        value: 'Annet',
      },
      {
        lang: 'eng',
        value: 'Other',
      },
      {
        lang: 'nno',
        value: 'Andre transportmiddel',
      },
    ],
    description: [
      {
        lang: 'nob',
        value: 'Trikk, t-bane, gondoler, kabelbane, …',
      },
      {
        lang: 'eng',
        value: 'Tram, metro, cableway, funicular, …',
      },
      {
        lang: 'nno',
        value: 'Trikk, t-bane, gondolar, kabelbane, …',
      },
    ],
    modes: [
      {
        transportMode: 'tram',
      },
      {
        transportMode: 'metro',
      },
      {
        transportMode: 'cableway',
      },
      {
        transportMode: 'funicular',
      },
      {
        transportMode: 'monorail',
      },
      {
        transportMode: 'lift',
      },
    ],
    selectedAsDefault: true,
  },
];
