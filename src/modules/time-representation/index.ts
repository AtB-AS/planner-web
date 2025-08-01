import { secondsBetween } from '@atb/utils/date';

const DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_SECONDS = 15;

type TimeValues = {
  aimedTime: string;
  expectedTime?: string;
  missingRealTime?: boolean;
  cancelled: boolean;
};

type TimeRepresentationType =
  | 'no-realtime-or-cancelled'
  | 'no-significant-difference'
  | 'significant-difference';

export function getTimeRepresentationType({
  missingRealTime,
  cancelled,
  aimedTime,
  expectedTime,
}: TimeValues): TimeRepresentationType {
  if (missingRealTime || cancelled) {
    return 'no-realtime-or-cancelled';
  }
  if (!expectedTime) {
    return 'no-significant-difference';
  }
  const secondsDifference = Math.abs(secondsBetween(aimedTime, expectedTime));
  return secondsDifference <= DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_SECONDS
    ? 'no-significant-difference'
    : 'significant-difference';
}
