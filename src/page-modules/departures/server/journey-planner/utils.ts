import { DepartureQuayFragment } from '@atb/page-modules/departures/journey-gql/departures.generated.ts';

export function sortQuays(a: DepartureQuayFragment, b: DepartureQuayFragment) {
  // Place quays with no departures at the end
  if (a.estimatedCalls.length === 0) return 1;
  if (b.estimatedCalls.length === 0) return -1;

  // Sort by public code
  if (!a.publicCode) return 1;
  if (!b.publicCode) return -1;

  const publicA = parseInt(a.publicCode, 10);
  const publicB = parseInt(b.publicCode, 10);

  if (Number.isNaN(publicA) || Number.isNaN(publicB)) {
    return a.publicCode.localeCompare(b.publicCode);
  }

  return publicA - publicB;
}
