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

export type InterchangeDetails = {
  publicCode: string;
  fromPlace: string;
};

export function getInterchangeDetails(
  legs: TripPatternWithDetails['legs'],
  id: string | undefined,
): InterchangeDetails | undefined {
  if (!id) return undefined;
  const interchangeLeg = legs.find(
    (leg) => leg.line && leg.serviceJourney?.id === id,
  );

  if (interchangeLeg?.line?.publicCode) {
    return {
      publicCode: interchangeLeg.line.publicCode,
      fromPlace: getPlaceName(
        interchangeLeg.fromPlace.name,
        interchangeLeg.fromPlace.quay?.name,
        interchangeLeg.fromPlace.quay?.publicCode,
      ),
    };
  }
  return undefined;
}
