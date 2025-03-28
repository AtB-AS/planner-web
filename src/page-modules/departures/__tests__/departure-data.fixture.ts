import {
  TransportMode,
  TransportSubmode,
} from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';
import { ExtendedDeparturesType } from '@atb/page-modules/departures/types.ts';

export const departureDataFixture: ExtendedDeparturesType = {
  stopPlace: {
    id: 'NSR:StopPlace:41613',
    name: 'Prinsens gate',
    latitude: 63.431034,
    longitude: 10.392007,
    transportMode: [TransportMode.Bus],
    transportSubmode: [TransportSubmode.Unknown],
    description: undefined,
    quays: [
      {
        id: 'NSR:Quay:71184',
        name: 'Prinsens gate',
        publicCode: 'P1',
        description: 'ved Bunnpris',
        estimatedCalls: [
          {
            aimedDepartureTime: '2025-04-04T13:55:00+02:00',
            date: '2025-04-04',
            expectedDepartureTime: '2025-04-04T13:55:00+02:00',
            realtime: false,
            cancellation: false,
            quay: {
              id: 'NSR:Quay:71184',
            },
            destinationDisplay: {
              frontText: 'Romolslia via St. Olavs hospital',
              via: [],
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:20_240906066218677_42',
              line: {
                id: 'ATB:Line:2_20',
                description: undefined,
                publicCode: '20',
                transportMode: TransportMode.Bus,
                transportSubmode: TransportSubmode.LocalBus,
              },
              journeyPattern: {
                notices: [],
              },
            },
            notices: [],
            situations: [],
          },
          {
            aimedDepartureTime: '2025-04-04T13:57:00+02:00',
            date: '2025-04-04',
            expectedDepartureTime: '2025-04-04T13:57:00+02:00',
            realtime: false,
            cancellation: false,
            quay: {
              id: 'NSR:Quay:71184',
            },
            destinationDisplay: {
              frontText: 'Kattem via Tiller-Heimdal',
              via: [],
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:1_240516085577730_116',
              line: {
                id: 'ATB:Line:2_1',
                description: undefined,
                publicCode: '1',
                transportMode: TransportMode.Bus,
                transportSubmode: TransportSubmode.LocalBus,
              },
              journeyPattern: {
                notices: [],
              },
            },
            notices: [],
            situations: [],
          },
        ],
        situations: [],
      },
      {
        id: 'NSR:Quay:71181',
        name: 'Prinsens gate',
        publicCode: 'P2',
        description: 'ved AtB Kundesenter',
        estimatedCalls: [
          {
            aimedDepartureTime: '2025-04-04T13:53:00+02:00',
            date: '2025-04-04',
            expectedDepartureTime: '2025-04-04T13:53:00+02:00',
            realtime: false,
            cancellation: false,
            quay: {
              id: 'NSR:Quay:71181',
            },
            destinationDisplay: {
              frontText: 'Pirbadet via Ila-sentrum',
              via: [],
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:21_241010131300098_37',
              line: {
                id: 'ATB:Line:2_21',
                description: undefined,
                publicCode: '21',
                transportMode: TransportMode.Bus,
                transportSubmode: TransportSubmode.LocalBus,
              },
              journeyPattern: {
                notices: [],
              },
            },
            notices: [],
            situations: [],
          },
          {
            aimedDepartureTime: '2025-04-04T13:54:00+02:00',
            date: '2025-04-04',
            expectedDepartureTime: '2025-04-04T13:54:00+02:00',
            realtime: false,
            cancellation: false,
            quay: {
              id: 'NSR:Quay:71181',
            },
            destinationDisplay: {
              frontText: 'Ranheim via Strindheim',
              via: [],
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:1_240516085577583_115',
              line: {
                id: 'ATB:Line:2_1',
                description: undefined,
                publicCode: '1',
                transportMode: TransportMode.Bus,
                transportSubmode: TransportSubmode.LocalBus,
              },
              journeyPattern: {
                notices: [],
              },
            },
            notices: [],
            situations: [],
          },
        ],
        situations: [],
      },
      {
        id: 'NSR:Quay:107493',
        name: 'Prinsens gate',
        publicCode: 'P3',
        description: undefined,
        estimatedCalls: [],
        situations: [],
      },
    ],
  },
};
