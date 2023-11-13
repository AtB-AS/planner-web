import { DepartureData } from '../server/journey-planner';

export const departureDataFixture: DepartureData = {
  stopPlace: {
    id: 'NSR:StopPlace:41613',
    name: 'Prinsens gate',
    position: { lat: 63.431034, lon: 10.392007 },
    transportMode: ['bus'],
    transportSubmode: ['unknown'],
    description: '',
  },
  quays: [
    {
      name: 'Prinsens gate',
      id: 'NSR:Quay:71184',
      publicCode: 'P1',
      description: 'ved Bunnpris',
      departures: [
        {
          id: 'ATB:ServiceJourney:71_230306097870252_7024',
          name: 'Dora',
          date: '2023-10-08',
          expectedDepartureTime: '2023-10-08T20:53:15+02:00',
          aimedDepartureTime: '2023-10-08T20:50:00+02:00',
          transportMode: 'bus',
          publicCode: '71',
        },
        {
          id: 'ATB:ServiceJourney:25_230306097862768_7070',
          name: 'Hurtigbåtterminalen',
          date: '2023-10-08',
          expectedDepartureTime: '2023-10-08T20:53:19+02:00',
          aimedDepartureTime: '2023-10-08T20:47:00+02:00',
          transportMode: 'bus',
          publicCode: '25',
        },
      ],
    },
    {
      name: 'Prinsens gate',
      id: 'NSR:Quay:71181',
      publicCode: 'P2',
      description: 'ved AtB Kundesenter',
      departures: [
        {
          id: 'ATB:ServiceJourney:10_230905147222030_7096',
          name: 'Sjetnmarka via Klæbuveien',
          date: '2023-10-08',
          expectedDepartureTime: '2023-10-08T20:55:28+02:00',
          aimedDepartureTime: '2023-10-08T20:54:00+02:00',
          transportMode: 'bus',
          publicCode: '10',
        },
        {
          id: 'ATB:ServiceJourney:20_230306097869036_7048',
          name: 'Romolslia via St. Olavs hospital',
          date: '2023-10-08',
          expectedDepartureTime: '2023-10-08T20:55:32+02:00',
          aimedDepartureTime: '2023-10-08T20:54:00+02:00',
          transportMode: 'bus',
          publicCode: '20',
        },
        {
          id: 'ATB:ServiceJourney:12_230306097866716_7048',
          name: 'Marienborg',
          date: '2023-10-08',
          expectedDepartureTime: '2023-10-08T20:57:11+02:00',
          aimedDepartureTime: '2023-10-08T20:56:00+02:00',
          transportMode: 'bus',
          publicCode: '12',
        },
      ],
    },
  ],
};
