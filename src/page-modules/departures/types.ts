import type { FeatureCategory } from '@atb/components/venue-icon';
import type { ServiceJourneyData } from './server/journey-planner/validators';
import type { SearchTime } from '@atb/modules/search-time';

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

export type FromDepartureQuery = {
  searchTime: SearchTime;
  from: GeocoderFeature | null;
  isAddress: boolean;
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
