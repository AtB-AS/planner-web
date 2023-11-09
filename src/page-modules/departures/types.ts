import { FeatureCategory } from '@atb/components/venue-icon';
import { ServiceJourneyData } from './server/journey-planner/validators';

export type GeocoderFeature = {
  id: string;
  name: string;
  locality?: string;
  category: FeatureCategory[];
  layer: 'address' | 'venue';
  geometry: {
    coordinates: number[];
  };
  street?: string;
};

export type EstimatedCallMetadata = {
  group: 'passed' | 'trip' | 'after';
  isStartOfServiceJourney: boolean;
  isEndOfServiceJourney: boolean;
  isStartOfGroup: boolean;
  isEndOfGroup: boolean;
};

export type EstimatedCallWithMetadata =
  ServiceJourneyData['estimatedCalls'][0] & {
    metadata: EstimatedCallMetadata;
  };
