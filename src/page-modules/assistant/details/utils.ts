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
