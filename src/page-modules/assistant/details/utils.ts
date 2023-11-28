import { secondsBetween } from '@atb/utils/date';
import { TripPatternWithDetails } from '../server/journey-planner/validators';

export function formatQuayName(quayName?: string, publicCode?: string | null) {
  if (!quayName) return;
  if (!publicCode) return quayName;
  return `${quayName} ${publicCode}`;
}

export function getPlaceName(
  placeName?: string,
  quayName?: string,
  publicCode?: string,
): string {
  const fallback = placeName ?? '';
  return quayName ? formatQuayName(quayName, publicCode) ?? fallback : fallback;
}

export function formatLineName(
  frontText?: string,
  lineName?: string,
  publicCode?: string,
): string {
  const name = frontText ?? lineName ?? '';
  return publicCode ? `${publicCode} ${name}` : name;
}

export type LegWaitDetails = {
  waitTime: number;
  mustWaitForNextLeg: boolean;
};
export function getLegWaitDetails(
  leg: TripPatternWithDetails['legs'][0],
  nextLeg: TripPatternWithDetails['legs'][0],
): LegWaitDetails | undefined {
  if (!nextLeg) return undefined;
  const waitTime = secondsBetween(
    leg.expectedEndTime,
    nextLeg.expectedStartTime,
  );
  const mustWaitForNextLeg = waitTime > 0;

  return {
    waitTime,
    mustWaitForNextLeg,
  };
}
