import { ServiceJourneyData } from '../server/journey-planner/validators';
import {
  TransportModeType,
  TransportSubmodeType,
} from '@atb/components/transport-mode/types';

export const serviceJourneyFixture: ServiceJourneyData = {
  id: 'ATB:ServiceJourney:22_230306097862461_113',
  transportMode: 'bus' as TransportModeType,
  transportSubmode: 'localBus' as TransportSubmodeType,
  line: { publicCode: '22' },
  estimatedCalls: [
    {
      actualArrivalTime: null,
      actualDepartureTime: null,
      aimedArrivalTime: '2023-11-10T13:48:00+01:00',
      aimedDepartureTime: '2023-11-10T13:48:00+01:00',
      cancellation: false,
      date: '2023-11-10',
      destinationDisplay: {
        frontText: 'Vestlia via sentrum-Othilienborg',
      },
      expectedDepartureTime: '2023-11-10T13:51:51+01:00',
      expectedArrivalTime: '2023-11-10T13:51:51+01:00',
      forAlighting: true,
      forBoarding: true,
      realtime: true,
      quay: {
        publicCode: '',
        name: 'Arne Bergsgårds veg',
        id: 'NSR:Quay:74640',
        stopPlace: { id: 'NSR:StopPlace:43497' },
      },
    },
    {
      actualArrivalTime: null,
      actualDepartureTime: null,
      aimedArrivalTime: '2023-11-10T13:50:00+01:00',
      aimedDepartureTime: '2023-11-10T13:50:00+01:00',
      cancellation: false,
      date: '2023-11-10',
      destinationDisplay: {
        frontText: 'Vestlia via sentrum-Othilienborg',
      },
      expectedDepartureTime: '2023-11-10T13:52:45+01:00',
      expectedArrivalTime: '2023-11-10T13:52:45+01:00',
      forAlighting: true,
      forBoarding: false,
      realtime: true,
      quay: {
        publicCode: '',
        name: 'Vestlia endeholdeplass',
        id: 'NSR:Quay:72101',
        stopPlace: { id: 'NSR:StopPlace:42118' },
      },
    },
  ],
};
