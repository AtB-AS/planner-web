import { secondsBetween } from '@atb/utils/date';

const DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_SECONDS = 60;

type TimeValues = {
  aimedTime: string;
  expectedTime?: string;
  missingRealTime?: boolean;
};

type TimeRepresentationType =
  | 'no-realtime'
  | 'no-significant-difference'
  | 'significant-difference';

export function getTimeRepresentationType({
  missingRealTime,
  aimedTime,
  expectedTime,
}: TimeValues): TimeRepresentationType {
  if (missingRealTime) {
    return 'no-realtime';
  }
  if (!expectedTime) {
    return 'no-significant-difference';
  }
  const secondsDifference = Math.abs(secondsBetween(aimedTime, expectedTime));
  return secondsDifference <= DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_SECONDS
    ? 'no-significant-difference'
    : 'significant-difference';
}
