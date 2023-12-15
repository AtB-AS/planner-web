import { Quay } from './validators';

export function sortQuays(a: Quay, b: Quay) {
  // Place quays with no departures at the end
  if (!a.publicCode || a.departures.length === 0) return 1;
  if (!b.publicCode || b.departures.length === 0) return -1;

  const publicA = parseInt(a.publicCode, 10);
  const publicB = parseInt(b.publicCode, 10);

  if (Number.isNaN(publicA) || Number.isNaN(publicB)) {
    return a.publicCode.localeCompare(b.publicCode);
  }

  return publicA - publicB;
}
