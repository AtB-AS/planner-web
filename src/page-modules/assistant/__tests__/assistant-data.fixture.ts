import { GeocoderFeature, FeatureCategory } from '@atb/modules/geocoder';
import { NonTransitTripData, TripsType } from '..';
import { ViaTripsWithDetailsQuery } from '@atb/page-modules/assistant/journey-gql/via-trip-with-details.generated';
import {
  Mode,
  TransportSubmode,
} from '@atb/modules/graphql-types/journeyplanner-types_v3.generated';
import { ReportType } from '@atb/modules/graphql-types';

export const fromFeature: GeocoderFeature = {
  id: '638651',
  name: 'Strindheim',
  locality: 'Trondheim',
  category: [FeatureCategory.BYDEL],
  layer: 'address',
  geometry: {
    coordinates: [10.456038846578249, 63.42666114395819],
  },
};

export const toFeature: GeocoderFeature = {
  id: 'NSR:StopPlace:43984',
  name: 'Byåsen skole',
  locality: 'Trondheim',
  category: [FeatureCategory.ONSTREET_BUS],
  layer: 'venue',
  geometry: { coordinates: [10.358037, 63.398886] },
};

export const viaFeature: GeocoderFeature = {
  id: 'NSR:StopPlace:42660',
  name: 'Studentersamfundet',
  locality: 'Trondheim',
  category: [FeatureCategory.ONSTREET_BUS],
  layer: 'venue',
  geometry: { coordinates: [10.394852, 63.422568] },
};

export const tripResult: TripsType = {
  trip: {
    nextPageCursor: 'aaa',
    previousPageCursor: 'bbb',
    tripPatterns: [],
  },
};

export const nonTransitTripResult: NonTransitTripData = {
  footTrip: {
    duration: 0,
    mode: Mode.Bus,
    rentedBike: false,
    compressedQuery: '',
  },
};

export const tripPatternCombinations = [
  [{ from: 0, to: 0, __typename: 'ViaConnection' }],
];
export const tripPatternCombinationList = [[{ from: 0, to: 0 }]];
export const tripPatternsFromVia: ViaTripsWithDetailsQuery['viaTrip']['tripPatternsPerSegment'][0]['tripPatterns'] =
  [
    {
      expectedStartTime: '2024-01-31T18:15:00+01:00',
      expectedEndTime: '2024-01-31T18:56:51+01:00',
      streetDistance: 52.75,
      legs: [
        {
          mode: Mode.Bus,
          distance: 27261.01,
          duration: 2460,
          aimedStartTime: '2024-01-31T18:15:00+01:00',
          aimedEndTime: '2024-01-31T18:56:00+01:00',
          expectedEndTime: '2024-01-31T18:56:00+01:00',
          expectedStartTime: '2024-01-31T18:15:00+01:00',
          intermediateEstimatedCalls: [],
          serviceJourneyEstimatedCalls: [],
          realtime: true,
          line: {
            publicCode: '501',
            flexibleLineType: undefined,
            notices: [],
          },
          fromEstimatedCall: {
            cancellation: false,
            notices: [],
          },
          situations: [],
          fromPlace: {
            name: 'Kristiansund trafikkterminal',
            latitude: 63.1107,
            longitude: 7.732,
            quay: {
              publicCode: '5',
              name: 'Kristiansund trafikkterminal',
              id: 'NSR:Quay:69011',
              situations: [],
            },
          },
          toPlace: {
            name: 'Kårvåg bedehus',
            latitude: 63.0168,
            longitude: 7.4365,
            quay: {
              publicCode: '',
              name: 'Kårvåg bedehus',
              id: 'NSR:Quay:67412',
              situations: [],
            },
          },
          serviceJourney: {
            id: 'MOR:ServiceJourney:501_137_9150000014485585',
            notices: [],
            journeyPattern: { notices: [] },
          },
          transportSubmode: TransportSubmode.RegionalBus,
        },
        {
          mode: Mode.Foot,
          distance: 52.75,
          duration: 51,
          aimedStartTime: '2024-01-31T18:56:00+01:00',
          aimedEndTime: '2024-01-31T18:56:51+01:00',
          expectedEndTime: '2024-01-31T18:56:51+01:00',
          expectedStartTime: '2024-01-31T18:56:00+01:00',
          intermediateEstimatedCalls: [],
          serviceJourneyEstimatedCalls: [],
          realtime: false,
          line: undefined,
          fromEstimatedCall: undefined,
          situations: [],
          fromPlace: {
            name: 'Kårvåg bedehus',
            latitude: 63.0168,
            longitude: 7.4365,
            quay: {
              publicCode: '',
              name: 'Kårvåg bedehus',
              id: 'NSR:Quay:67412',
              situations: [],
            },
          },
          toPlace: {
            name: 'Kårvåg butikk',
            latitude: 63.017,
            longitude: 7.4368,
            quay: {
              publicCode: '',
              name: 'Kårvåg butikk',
              id: 'NSR:Quay:67413',
              situations: [],
            },
          },
          serviceJourney: undefined,
          transportSubmode: undefined,
        },
      ],
    },
    {
      expectedStartTime: '2024-01-31T20:30:00+01:00',
      expectedEndTime: '2024-01-31T21:11:51+01:00',
      streetDistance: 52.75,
      legs: [
        {
          mode: Mode.Bus,
          distance: 27261.01,
          duration: 2460,
          aimedStartTime: '2024-01-31T20:30:00+01:00',
          aimedEndTime: '2024-01-31T21:11:00+01:00',
          expectedEndTime: '2024-01-31T21:11:00+01:00',
          expectedStartTime: '2024-01-31T20:30:00+01:00',
          intermediateEstimatedCalls: [],
          serviceJourneyEstimatedCalls: [],
          realtime: true,
          line: {
            publicCode: '501',
            flexibleLineType: undefined,
            notices: [],
          },
          fromEstimatedCall: {
            cancellation: false,
            notices: [],
          },
          situations: [],
          fromPlace: {
            name: 'Kristiansund trafikkterminal',
            latitude: 63.1107,
            longitude: 7.732,
            quay: {
              publicCode: '5',
              name: 'Kristiansund trafikkterminal',
              id: 'NSR:Quay:69011',
              situations: [],
            },
          },
          toPlace: {
            name: 'Kårvåg bedehus',
            latitude: 63.0168,
            longitude: 7.4365,
            quay: {
              publicCode: '',
              name: 'Kårvåg bedehus',
              id: 'NSR:Quay:67412',
              situations: [],
            },
          },
          serviceJourney: {
            id: 'MOR:ServiceJourney:501_139_9150000014485655',
            notices: [],
            journeyPattern: { notices: [] },
          },
          transportSubmode: TransportSubmode.RegionalBus,
        },
        {
          mode: Mode.Foot,
          distance: 52.75,
          duration: 51,
          aimedStartTime: '2024-01-31T21:11:00+01:00',
          aimedEndTime: '2024-01-31T21:11:51+01:00',
          expectedEndTime: '2024-01-31T21:11:51+01:00',
          expectedStartTime: '2024-01-31T21:11:00+01:00',
          intermediateEstimatedCalls: [],
          serviceJourneyEstimatedCalls: [],
          realtime: false,
          line: undefined,
          fromEstimatedCall: undefined,
          situations: [],
          fromPlace: {
            name: 'Kårvåg bedehus',
            latitude: 63.0168,
            longitude: 7.4365,
            quay: {
              publicCode: '',
              name: 'Kårvåg bedehus',
              id: 'NSR:Quay:67412',
              situations: [],
            },
          },
          toPlace: {
            name: 'Kårvåg butikk',
            latitude: 63.017,
            longitude: 7.4368,
            quay: {
              publicCode: '',
              name: 'Kårvåg butikk',
              id: 'NSR:Quay:67413',
              situations: [],
            },
          },
          serviceJourney: undefined,
          transportSubmode: undefined,
        },
      ],
    },
  ];

export const tripPatternsViaTo: ViaTripsWithDetailsQuery['viaTrip']['tripPatternsPerSegment'][0]['tripPatterns'] =
  [
    {
      expectedStartTime: '2024-01-31T19:10:09+01:00',
      expectedEndTime: '2024-01-31T21:25:00+01:00',
      streetDistance: 108.2,
      legs: [
        {
          mode: Mode.Foot,
          distance: 52.75,
          duration: 51,
          aimedStartTime: '2024-01-31T19:10:09+01:00',
          aimedEndTime: '2024-01-31T19:11:00+01:00',
          expectedEndTime: '2024-01-31T19:11:00+01:00',
          expectedStartTime: '2024-01-31T19:10:09+01:00',
          intermediateEstimatedCalls: [],
          serviceJourneyEstimatedCalls: [],
          realtime: false,
          line: undefined,
          fromEstimatedCall: undefined,
          situations: [],
          fromPlace: {
            name: 'Kårvåg',
            latitude: 63.0168,
            longitude: 7.4365,
            quay: undefined,
          },
          toPlace: {
            name: 'Kårvåg bedehus',
            latitude: 63.017,
            longitude: 7.4368,
            quay: undefined,
          },
          serviceJourney: undefined,
          transportSubmode: undefined,
        },
        {
          mode: Mode.Foot,
          distance: 27367.28,
          duration: 2520,
          aimedStartTime: '2024-01-31T19:11:00+01:00',
          aimedEndTime: '2024-01-31T19:53:00+01:00',
          expectedEndTime: '2024-01-31T19:53:00+01:00',
          expectedStartTime: '2024-01-31T19:11:00+01:00',
          intermediateEstimatedCalls: [],
          serviceJourneyEstimatedCalls: [],
          realtime: true,
          line: {
            publicCode: '501',
            flexibleLineType: undefined,
            notices: [],
          },
          fromEstimatedCall: {
            cancellation: false,
            notices: [],
          },
          situations: [],
          fromPlace: {
            name: 'Kårvåg bedehus',
            latitude: 63.0168,
            longitude: 7.4365,
            quay: {
              publicCode: '',
              name: 'Kårvåg bedehus',
              id: 'NSR:Quay:67412',
              situations: [],
            },
          },
          toPlace: {
            name: 'Kristiansund trafikkterminal',
            latitude: 63.1107,
            longitude: 7.732,
            quay: {
              publicCode: '5',
              name: 'Kristiansund trafikkterminal',
              id: 'NSR:Quay:69011',
              situations: [],
            },
          },
          serviceJourney: {
            id: 'MOR:ServiceJourney:501_130_9150000014488461',
            notices: [],
            journeyPattern: { notices: [] },
          },
          transportSubmode: TransportSubmode.RegionalBus,
        },
        {
          mode: Mode.Foot,
          distance: 455.45,
          duration: 360,
          aimedStartTime: '2024-01-31T19:53:00+01:00',
          aimedEndTime: '2024-01-31T19:59:00+01:00',
          expectedEndTime: '2024-01-31T19:59:00+01:00',
          expectedStartTime: '2024-01-31T19:53:00+01:00',
          intermediateEstimatedCalls: [],
          serviceJourneyEstimatedCalls: [],
          realtime: false,
          line: undefined,
          fromEstimatedCall: undefined,
          situations: [],
          fromPlace: {
            name: 'Kristiansund trafikkterminal',
            latitude: 61.1107,
            longitude: 7.732,
            quay: {
              publicCode: '5',
              name: 'Kristiansund trafikkterminal',
              id: 'NSR:Quay:69011',
              situations: [],
            },
          },
          toPlace: {
            name: 'Kristiansund sentrum',
            latitude: 61.1115,
            longitude: 7.4365,
            quay: {
              publicCode: '3',
              name: 'Kristiansund sentrum',
              id: 'NSR:Quay:69013',
              situations: [],
            },
          },
          serviceJourney: undefined,
          transportSubmode: undefined,
        },
        {
          mode: Mode.Bus,
          distance: 68120.05,
          duration: 4500,
          aimedStartTime: '2024-01-31T20:10:00+01:00',
          aimedEndTime: '2024-01-31T21:25:00+01:00',
          expectedEndTime: '2024-01-31T21:25:00+01:00',
          expectedStartTime: '2024-01-31T20:10:00+01:00',
          intermediateEstimatedCalls: [],
          serviceJourneyEstimatedCalls: [],
          realtime: true,
          line: {
            publicCode: '100',
            flexibleLineType: undefined,
            notices: [],
          },
          fromEstimatedCall: {
            cancellation: false,
            notices: [],
          },
          situations: [
            {
              id: 'UHRTaXR1YXRpb25FbGVtZW50Ok1PUjpTaXR1YXRpb25OdW1iZXI6OTA3NjkxNTAwMDAxNTQyMQ',
              situationNumber: 'MOR:SituationNumber:9076915000015421',
              summary: [
                {
                  language: undefined,
                  value:
                    'Linje 100 innstilles fortløpende fra kl. 1030 og ut dagen',
                },
              ],
              description: [
                {
                  language: undefined,
                  value:
                    'Linje 100 innstilles fortløpende fra kl. 1030 og ut dagen',
                },
              ],
              reportType: ReportType.Incident,
              advice: [{ language: undefined, value: '' }],
              infoLinks: undefined,
              validityPeriod: {
                startTime: '2024-01-31T10:12:39+01:00',
                endTime: '2024-01-31T23:59:00+01:00',
              },
            },
          ],
          fromPlace: {
            name: 'Kristiansund trafikkterminal',
            latitude: 63.1107,
            longitude: 7.732,
            quay: {
              publicCode: '8',
              name: 'Kristiansund trafikkterminal',
              id: 'NSR:Quay:69009',
              situations: [],
            },
          },
          toPlace: {
            name: 'Molde trafikkterminal',
            latitude: 62.7372,
            longitude: 7.1607,
            quay: {
              publicCode: '1',
              name: 'Molde trafikkterminal',
              id: 'NSR:Quay:59001',
              situations: [],
            },
          },
          serviceJourney: {
            id: 'MOR:ServiceJourney:100_135_9150000015681018',
            notices: [],
            journeyPattern: { notices: [] },
          },
          transportSubmode: TransportSubmode.RegionalBus,
        },
      ],
    },
  ];

export const tripPatternsFromViaTo: ViaTripsWithDetailsQuery['viaTrip']['tripPatternsPerSegment'][0]['tripPatterns'] =
  [
    {
      expectedStartTime: '2024-01-31T18:15:00+01:00',
      expectedEndTime: '2024-01-31T21:25:00+01:00',
      legs: [
        {
          mode: Mode.Bus,
          distance: 27261.01,
          duration: 2460,
          aimedStartTime: '2024-01-31T18:15:00+01:00',
          aimedEndTime: '2024-01-31T18:56:00+01:00',
          expectedEndTime: '2024-01-31T18:56:00+01:00',
          expectedStartTime: '2024-01-31T18:15:00+01:00',
          intermediateEstimatedCalls: [],
          serviceJourneyEstimatedCalls: [],
          realtime: true,
          line: {
            publicCode: '501',
            flexibleLineType: undefined,
            notices: [],
          },
          fromEstimatedCall: {
            cancellation: false,
            notices: [],
          },
          situations: [],
          fromPlace: {
            name: 'Kristiansund trafikkterminal',
            latitude: 63.1107,
            longitude: 7.732,
            quay: {
              publicCode: '5',
              name: 'Kristiansund trafikkterminal',
              id: 'NSR:Quay:69011',
              situations: [],
            },
          },
          toPlace: {
            name: 'Kårvåg bedehus',
            latitude: 63.0168,
            longitude: 7.4365,
            quay: {
              publicCode: '',
              name: 'Kårvåg bedehus',
              id: 'NSR:Quay:67412',
              situations: [],
            },
          },
          serviceJourney: {
            id: 'MOR:ServiceJourney:501_137_9150000014485585',
            notices: [],
            journeyPattern: { notices: [] },
          },
          transportSubmode: TransportSubmode.RegionalBus,
        },
        {
          mode: Mode.Foot,
          distance: 52.75,
          duration: 51,
          aimedStartTime: '2024-01-31T18:56:00+01:00',
          aimedEndTime: '2024-01-31T18:56:51+01:00',
          expectedEndTime: '2024-01-31T18:56:51+01:00',
          expectedStartTime: '2024-01-31T18:56:00+01:00',
          intermediateEstimatedCalls: [],
          serviceJourneyEstimatedCalls: [],
          realtime: false,
          line: undefined,
          fromEstimatedCall: undefined,
          situations: [],
          fromPlace: {
            name: 'Kårvåg bedehus',
            latitude: 63.0168,
            longitude: 7.4365,
            quay: {
              publicCode: '',
              name: 'Kårvåg bedehus',
              id: 'NSR:Quay:67412',
              situations: [],
            },
          },
          toPlace: {
            name: 'Kårvåg butikk',
            latitude: 63.017,
            longitude: 7.4368,
            quay: {
              publicCode: '',
              name: 'Kårvåg butikk',
              id: 'NSR:Quay:67413',
              situations: [],
            },
          },
          serviceJourney: undefined,
          transportSubmode: undefined,
        },
        {
          mode: Mode.Foot,
          distance: 52.75,
          duration: 51,
          aimedStartTime: '2024-01-31T19:10:09+01:00',
          aimedEndTime: '2024-01-31T19:11:00+01:00',
          expectedEndTime: '2024-01-31T19:11:00+01:00',
          expectedStartTime: '2024-01-31T19:10:09+01:00',
          intermediateEstimatedCalls: [],
          serviceJourneyEstimatedCalls: [],
          realtime: false,
          line: undefined,
          fromEstimatedCall: undefined,
          situations: [],
          fromPlace: {
            name: 'Kårvåg',
            latitude: 63.0168,
            longitude: 7.4365,
            quay: undefined,
          },
          toPlace: {
            name: 'Kårvåg bedehus',
            latitude: 63.017,
            longitude: 7.4368,
            quay: undefined,
          },
          serviceJourney: undefined,
          transportSubmode: undefined,
        },
        {
          mode: Mode.Foot,
          distance: 27367.28,
          duration: 2520,
          aimedStartTime: '2024-01-31T19:11:00+01:00',
          aimedEndTime: '2024-01-31T19:53:00+01:00',
          expectedEndTime: '2024-01-31T19:53:00+01:00',
          expectedStartTime: '2024-01-31T19:11:00+01:00',
          intermediateEstimatedCalls: [],
          serviceJourneyEstimatedCalls: [],
          realtime: true,
          line: {
            publicCode: '501',
            flexibleLineType: undefined,
            notices: [],
          },
          fromEstimatedCall: {
            cancellation: false,
            notices: [],
          },
          situations: [],
          fromPlace: {
            name: 'Kårvåg bedehus',
            latitude: 63.0168,
            longitude: 7.4365,
            quay: {
              publicCode: '',
              name: 'Kårvåg bedehus',
              id: 'NSR:Quay:67412',
              situations: [],
            },
          },
          toPlace: {
            name: 'Kristiansund trafikkterminal',
            latitude: 63.1107,
            longitude: 7.732,
            quay: {
              publicCode: '5',
              name: 'Kristiansund trafikkterminal',
              id: 'NSR:Quay:69011',
              situations: [],
            },
          },
          serviceJourney: {
            id: 'MOR:ServiceJourney:501_130_9150000014488461',
            notices: [],
            journeyPattern: { notices: [] },
          },
          transportSubmode: TransportSubmode.RegionalBus,
        },
        {
          mode: Mode.Foot,
          distance: 455.45,
          duration: 360,
          aimedStartTime: '2024-01-31T19:53:00+01:00',
          aimedEndTime: '2024-01-31T19:59:00+01:00',
          expectedEndTime: '2024-01-31T19:59:00+01:00',
          expectedStartTime: '2024-01-31T19:53:00+01:00',
          intermediateEstimatedCalls: [],
          serviceJourneyEstimatedCalls: [],
          realtime: false,
          line: undefined,
          fromEstimatedCall: undefined,
          situations: [],
          fromPlace: {
            name: 'Kristiansund trafikkterminal',
            latitude: 61.1107,
            longitude: 7.732,
            quay: {
              publicCode: '5',
              name: 'Kristiansund trafikkterminal',
              id: 'NSR:Quay:69011',
              situations: [],
            },
          },
          toPlace: {
            name: 'Kristiansund sentrum',
            latitude: 61.1115,
            longitude: 7.4365,
            quay: {
              publicCode: '3',
              name: 'Kristiansund sentrum',
              id: 'NSR:Quay:69013',
              situations: [],
            },
          },
          serviceJourney: undefined,
          transportSubmode: undefined,
        },
        {
          mode: Mode.Bus,
          distance: 68120.05,
          duration: 4500,
          aimedStartTime: '2024-01-31T20:10:00+01:00',
          aimedEndTime: '2024-01-31T21:25:00+01:00',
          expectedEndTime: '2024-01-31T21:25:00+01:00',
          expectedStartTime: '2024-01-31T20:10:00+01:00',
          intermediateEstimatedCalls: [],
          serviceJourneyEstimatedCalls: [],
          realtime: true,
          line: {
            publicCode: '100',
            flexibleLineType: undefined,
            notices: [],
          },
          fromEstimatedCall: {
            cancellation: false,
            notices: [],
          },
          situations: [
            {
              id: 'UHRTaXR1YXRpb25FbGVtZW50Ok1PUjpTaXR1YXRpb25OdW1iZXI6OTA3NjkxNTAwMDAxNTQyMQ',
              situationNumber: 'MOR:SituationNumber:9076915000015421',
              summary: [
                {
                  language: undefined,
                  value:
                    'Linje 100 innstilles fortløpende fra kl. 1030 og ut dagen',
                },
              ],
              description: [
                {
                  language: undefined,
                  value:
                    'Linje 100 innstilles fortløpende fra kl. 1030 og ut dagen',
                },
              ],
              reportType: ReportType.Incident,
              advice: [{ language: undefined, value: '' }],
              infoLinks: undefined,
              validityPeriod: {
                startTime: '2024-01-31T10:12:39+01:00',
                endTime: '2024-01-31T23:59:00+01:00',
              },
            },
          ],
          fromPlace: {
            name: 'Kristiansund trafikkterminal',
            latitude: 63.1107,
            longitude: 7.732,
            quay: {
              publicCode: '8',
              name: 'Kristiansund trafikkterminal',
              id: 'NSR:Quay:69009',
              situations: [],
            },
          },
          toPlace: {
            name: 'Molde trafikkterminal',
            latitude: 62.7372,
            longitude: 7.1607,
            quay: {
              publicCode: '1',
              name: 'Molde trafikkterminal',
              id: 'NSR:Quay:59001',
              situations: [],
            },
          },
          serviceJourney: {
            id: 'MOR:ServiceJourney:100_135_9150000015681018',
            notices: [],
            journeyPattern: { notices: [] },
          },
          transportSubmode: TransportSubmode.RegionalBus,
        },
      ],
    },
  ];
