import { ServiceJourneyType } from '@atb/page-modules/departures/types.ts';
import { TransportMode, TransportSubmode } from '@atb/modules/graphql-types';

export const serviceJourneyFixture: ServiceJourneyType = {
  id: 'ATB:ServiceJourney:22_230306097862461_113',
  transportMode: TransportMode.Bus,
  transportSubmode: TransportSubmode.LocalBus,
  mapLegs: [],
  line: { publicCode: '22', notices: [] },
  notices: [],
  estimatedCalls: [
    {
      actualArrivalTime: '2023-11-10T14:59:24+01:00',
      actualDepartureTime: '2023-11-10T14:59:24+01:00',
      aimedArrivalTime: '2023-11-10T14:59:00+01:00',
      aimedDepartureTime: '2023-11-10T14:59:00+01:00',
      cancellation: false,
      date: '2023-11-10',
      destinationDisplay: {
        frontText: 'Vestlia',
        via: ['sentrum-Othilienborg'],
      },
      expectedDepartureTime: '2023-11-10T14:59:24+01:00',
      expectedArrivalTime: '2023-11-10T14:59:24+01:00',
      forAlighting: false,
      forBoarding: true,
      realtime: true,
      quay: {
        publicCode: '',
        name: 'Strinda vgs.',
        id: 'NSR:Quay:73030',
        stopPlace: {
          id: 'NSR:StopPlace:42623',
          longitude: 10.427544,
          latitude: 63.422072,
        },
      },
      situations: [],
      notices: [],
    },
    {
      actualArrivalTime: '2023-11-10T15:01:22+01:00',
      actualDepartureTime: '2023-11-10T15:01:40+01:00',
      aimedArrivalTime: '2023-11-10T15:00:00+01:00',
      aimedDepartureTime: '2023-11-10T15:00:00+01:00',
      cancellation: false,
      date: '2023-11-10',
      destinationDisplay: {
        frontText: 'Vestlia',
        via: ['sentrum-Othilienborg'],
      },
      expectedDepartureTime: '2023-11-10T15:01:40+01:00',
      expectedArrivalTime: '2023-11-10T15:01:22+01:00',
      forAlighting: true,
      forBoarding: true,
      realtime: true,
      quay: {
        publicCode: '',
        name: 'Magnus Berrføtts veg',
        id: 'NSR:Quay:72609',
        stopPlace: {
          id: 'NSR:StopPlace:42400',
          longitude: 10.438533,
          latitude: 63.421314,
        },
      },
      situations: [],
      notices: [],
    },
    {
      actualArrivalTime: '2023-11-10T15:02:11+01:00',
      actualDepartureTime: '2023-11-10T15:02:50+01:00',
      aimedArrivalTime: '2023-11-10T15:01:00+01:00',
      aimedDepartureTime: '2023-11-10T15:01:00+01:00',
      cancellation: false,
      date: '2023-11-10',
      destinationDisplay: {
        frontText: 'Vestlia',
        via: [],
      },
      expectedDepartureTime: '2023-11-10T15:02:50+01:00',
      expectedArrivalTime: '2023-11-10T15:02:11+01:00',
      forAlighting: true,
      forBoarding: true,
      realtime: true,
      quay: {
        publicCode: '',
        name: 'Valentinlyst',
        id: 'NSR:Quay:71898',
        stopPlace: {
          id: 'NSR:StopPlace:42004',
          longitude: 10.440496,
          latitude: 63.424583,
        },
      },
      situations: [],
      notices: [],
    },
    {
      actualArrivalTime: '2023-11-10T15:03:04+01:00',
      actualDepartureTime: '2023-11-10T15:03:43+01:00',
      aimedArrivalTime: '2023-11-10T15:02:00+01:00',
      aimedDepartureTime: '2023-11-10T15:02:00+01:00',
      cancellation: false,
      date: '2023-11-10',
      destinationDisplay: {
        frontText: 'Vestlia',
        via: [],
      },
      expectedDepartureTime: '2023-11-10T15:03:43+01:00',
      expectedArrivalTime: '2023-11-10T15:03:04+01:00',
      forAlighting: true,
      forBoarding: true,
      realtime: true,
      quay: {
        publicCode: '',
        name: 'Tyholtveien',
        id: 'NSR:Quay:71678',
        stopPlace: {
          id: 'NSR:StopPlace:41882',
          longitude: 10.442998,
          latitude: 63.427611,
        },
      },
      situations: [],
      notices: [],
    },
    {
      actualArrivalTime: '2023-11-10T15:03:54+01:00',
      actualDepartureTime: '2023-11-10T15:04:09+01:00',
      aimedArrivalTime: '2023-11-10T15:03:00+01:00',
      aimedDepartureTime: '2023-11-10T15:03:00+01:00',
      cancellation: false,
      date: '2023-11-10',
      destinationDisplay: {
        frontText: 'Vestlia',
        via: [],
      },
      expectedDepartureTime: '2023-11-10T15:04:09+01:00',
      expectedArrivalTime: '2023-11-10T15:03:54+01:00',
      forAlighting: true,
      forBoarding: true,
      realtime: true,
      quay: {
        publicCode: '',
        name: 'Cecilie Thoresens veg',
        id: 'NSR:Quay:75585',
        stopPlace: {
          id: 'NSR:StopPlace:44015',
          longitude: 10.440378,
          latitude: 63.42732,
        },
      },
      situations: [],
      notices: [],
    },
    {
      actualArrivalTime: '2023-11-10T15:04:42+01:00',
      actualDepartureTime: '2023-11-10T15:05:07+01:00',
      aimedArrivalTime: '2023-11-10T15:04:00+01:00',
      aimedDepartureTime: '2023-11-10T15:04:00+01:00',
      cancellation: false,
      date: '2023-11-10',
      destinationDisplay: {
        frontText: 'Vestlia',
        via: [],
      },
      expectedDepartureTime: '2023-11-10T15:05:07+01:00',
      expectedArrivalTime: '2023-11-10T15:04:42+01:00',
      forAlighting: true,
      forBoarding: true,
      realtime: true,
      quay: {
        publicCode: '',
        name: 'Tyholt',
        id: 'NSR:Quay:71659',
        stopPlace: {
          id: 'NSR:StopPlace:41875',
          longitude: 10.432813,
          latitude: 63.427688,
        },
      },
      situations: [],
      notices: [],
    },
    {
      actualArrivalTime: '2023-11-10T15:05:19+01:00',
      actualDepartureTime: '2023-11-10T15:05:56+01:00',
      aimedArrivalTime: '2023-11-10T15:05:00+01:00',
      aimedDepartureTime: '2023-11-10T15:05:00+01:00',
      cancellation: false,
      date: '2023-11-10',
      destinationDisplay: {
        frontText: 'Vestlia',
        via: [],
      },
      expectedDepartureTime: '2023-11-10T15:05:56+01:00',
      expectedArrivalTime: '2023-11-10T15:05:19+01:00',
      forAlighting: true,
      forBoarding: true,
      realtime: true,
      quay: {
        publicCode: '',
        name: 'Clara Holsts veg',
        id: 'NSR:Quay:75616',
        stopPlace: {
          id: 'NSR:StopPlace:44034',
          longitude: 10.435643,
          latitude: 63.428894,
        },
      },
      situations: [],
      notices: [],
    },
    {
      actualArrivalTime: '2023-11-10T15:06:34+01:00',
      actualDepartureTime: '2023-11-10T15:07:14+01:00',
      aimedArrivalTime: '2023-11-10T15:06:00+01:00',
      aimedDepartureTime: '2023-11-10T15:06:00+01:00',
      cancellation: false,
      date: '2023-11-10',
      destinationDisplay: {
        frontText: 'Vestlia',
        via: ['sentrum'],
      },
      expectedDepartureTime: '2023-11-10T15:07:14+01:00',
      expectedArrivalTime: '2023-11-10T15:06:34+01:00',
      forAlighting: true,
      forBoarding: true,
      realtime: true,
      quay: {
        publicCode: '',
        name: 'Persaunet leir',
        id: 'NSR:Quay:74990',
        stopPlace: {
          id: 'NSR:StopPlace:43687',
          longitude: 10.441777,
          latitude: 63.431544,
        },
      },
      situations: [],
      notices: [],
    },
    {
      actualArrivalTime: '2023-11-10T15:07:52+01:00',
      actualDepartureTime: '2023-11-10T15:08:22+01:00',
      aimedArrivalTime: '2023-11-10T15:07:00+01:00',
      aimedDepartureTime: '2023-11-10T15:07:00+01:00',
      cancellation: false,
      date: '2023-11-10',
      destinationDisplay: {
        frontText: 'Vestlia',
        via: [],
      },
      expectedDepartureTime: '2023-11-10T15:08:22+01:00',
      expectedArrivalTime: '2023-11-10T15:07:52+01:00',
      forAlighting: true,
      forBoarding: true,
      realtime: true,
      quay: {
        publicCode: '',
        name: 'Brian Smiths gate',
        id: 'NSR:Quay:75371',
        stopPlace: {
          id: 'NSR:StopPlace:43896',
          longitude: 10.447941,
          latitude: 63.434554,
        },
      },
      situations: [],
      notices: [],
    },
    {
      actualArrivalTime: '2023-11-10T15:09:56+01:00',
      actualDepartureTime: '2023-11-10T15:10:33+01:00',
      aimedArrivalTime: '2023-11-10T15:09:00+01:00',
      aimedDepartureTime: '2023-11-10T15:09:00+01:00',
      cancellation: false,
      date: '2023-11-10',
      destinationDisplay: {
        frontText: 'Vestlia',
        via: [],
      },
      expectedDepartureTime: '2023-11-10T15:10:33+01:00',
      expectedArrivalTime: '2023-11-10T15:09:56+01:00',
      forAlighting: true,
      forBoarding: true,
      realtime: true,
      quay: {
        publicCode: '',
        name: 'Dalen Hageby',
        id: 'NSR:Quay:74497',
        stopPlace: {
          id: 'NSR:StopPlace:43418',
          longitude: 10.449015,
          latitude: 63.437369,
        },
      },
      situations: [],
      notices: [],
    },
  ],
};
