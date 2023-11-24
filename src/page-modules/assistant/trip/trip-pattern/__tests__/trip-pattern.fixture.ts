import { TripPattern } from '../../../server/journey-planner/validators';

export const tripPatternFixture: TripPattern = {
  expectedStartTime: '2023-01-01T00:00:00+01:00',
  expectedEndTime: '2023-01-01T01:00:00+01:00',
  duration: 3600,
  walkDistance: 0,
  legs: [
    {
      mode: 'bus',
      distance: 1,
      duration: 1,
      aimedStartTime: '2023-01-01T00:00:00+01:00',
      expectedEndTime: '2023-01-01T01:00:00+01:00',
      expectedStartTime: '2023-01-01T00:00:00+01:00',
      realtime: false,
      transportSubmode: 'regionalBus',
      line: {
        publicCode: '1',
        flexibleLineType: null,
        notices: [],
      },
      fromEstimatedCall: {
        notices: [],
      },
      situations: [],
      fromPlace: {
        name: 'From',
        quay: {
          publicCode: '1',
          name: 'From',
          id: 'NSR:Quay:1',
          situations: [],
        },
      },
      serviceJourney: {
        id: 'ATB:ServiceJourney:1',
        notices: [],
        journeyPattern: {
          notices: [],
        },
      },
    },
  ],
};
