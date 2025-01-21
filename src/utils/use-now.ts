import { useState } from 'react';
import useInterval from '@atb/utils/use-interval';

export function useNow(intervalMilliseconds: number = 2500): number {
  const [now, setNow] = useState<number>(Date.now());
  useInterval(() => setNow(Date.now()), intervalMilliseconds);
  return now;
}
