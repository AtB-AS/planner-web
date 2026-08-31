import type { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';
import { currentOrg } from '@atb/modules/org-data';
import { Mode } from '@atb/modules/graphql-types';
import style from './trip-inspector.module.css';

export type TripInspectorProps = {
  tripPattern: ExtendedTripPatternWithDetailsType;
  /** Entrance animation delay in seconds, matching the TripPattern stagger. */
  delay?: number;
};

/**
 * Dev-mode inspector panel showing the data behind a trip pattern. Add a
 * new section (label + content) per future data point (fares, operators,
 * ...).
 */
export function TripInspector({ tripPattern, delay = 0 }: TripInspectorProps) {
  const zones = getTripPatternZones(tripPattern);
  const path = getTripPatternPath(tripPattern);

  return (
    <aside
      className={style.tripInspector}
      style={{ animationDelay: `${delay}s` }}
    >
      <span className={style.header}>Inspector</span>
      <div className={style.section}>
        <span className={style.sectionLabel}>Zones</span>
        {zones.length > 0 ? (
          <div className={style.chips}>
            {zones.map((zone) => (
              <span key={zone.id} className={style.zoneChip}>
                {zone.name ? `${zone.name} (${zone.id})` : zone.id}
              </span>
            ))}
          </div>
        ) : (
          <span className={style.empty}>none</span>
        )}
      </div>
      <div className={style.section}>
        {path.length > 0 ? (
          <details className={style.pathDetails}>
            <summary className={style.pathSummary}>
              <span className={style.sectionLabel}>Path</span>
              <span className={style.pathCount}>{path.length} stops</span>
            </summary>
            <ol className={style.path}>
              {path.map((stop, i) => (
                <li key={i} className={style.pathStop}>
                  {stop.via && (
                    <span className={style.pathConnector}>↓ {stop.via}</span>
                  )}
                  <span className={style.pathStopName}>
                    <span className={style.pathStopLabel}>{stop.name}</span>
                    {stop.zone ? (
                      <span className={style.pathZone}>{stop.zone}</span>
                    ) : (
                      <span className={style.pathZoneEmpty}>—</span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </details>
        ) : (
          <>
            <span className={style.sectionLabel}>Path</span>
            <span className={style.empty}>none</span>
          </>
        )}
      </div>
    </aside>
  );
}

type PlaceLike = {
  name?: string | null;
  quay?: { tariffZones?: { id: string; name?: string | null }[] | null } | null;
};

/** The org-specific fare zone (name, else id) of a place, if any. */
function zoneOfPlace(place: PlaceLike | undefined | null): string | undefined {
  const zone = place?.quay?.tariffZones?.find((z) =>
    z?.id?.includes(`${currentOrg.toUpperCase()}:FareZone`),
  );
  return zone?.name ?? zone?.id ?? undefined;
}

type TripLeg = ExtendedTripPatternWithDetailsType['legs'][number];

/**
 * Human-readable label for the leg connecting two stops: the transport mode
 * (and submode when present) plus the line's public code/name, e.g.
 * `bus · localBus 3`. Foot legs are just `walk`.
 */
function legLabel(leg: TripLeg): string {
  if (leg.mode === Mode.Foot) return 'walk';
  const mode = leg.transportSubmode
    ? `${leg.mode} · ${leg.transportSubmode}`
    : leg.mode;
  const line = leg.line?.publicCode ?? leg.line?.name;
  return line ? `${mode} ${line}` : mode;
}

type PathStop = { name: string; zone?: string; via?: string };

/**
 * Builds the ordered list of stops the trip traverses — the first leg's origin
 * followed by each leg's destination — annotating every stop with its fare zone
 * and the leg (`via`) that arrives there, so the zone changes are visible
 * along the route.
 */
function getTripPatternPath(
  tripPattern: ExtendedTripPatternWithDetailsType,
): PathStop[] {
  const legs = tripPattern?.legs ?? [];
  if (legs.length === 0) return [];

  const stops: PathStop[] = [
    {
      name: legs[0].fromPlace?.name ?? '?',
      zone: zoneOfPlace(legs[0].fromPlace),
    },
  ];
  for (const leg of legs) {
    stops.push({
      name: leg.toPlace?.name ?? '?',
      zone: zoneOfPlace(leg.toPlace),
      via: legLabel(leg),
    });
  }
  return stops;
}

/**
 * Collects the unique fare zones (ids containing "ATB:FareZone") the trip
 * passes through, in the order they are first encountered, from the quays of
 * each leg's from/to place. Deduped by zone id.
 */
function getTripPatternZones(
  tripPattern: ExtendedTripPatternWithDetailsType,
): { id: string; name?: string }[] {
  const zones: { id: string; name?: string }[] = [];
  const seen = new Set<string>();

  for (const leg of tripPattern.legs) {
    for (const place of [leg.fromPlace, leg.toPlace]) {
      for (const zone of place?.quay?.tariffZones ?? []) {
        if (
          zone?.id &&
          zone.id.includes(`${currentOrg.toUpperCase()}:FareZone`) &&
          !seen.has(zone.id)
        ) {
          seen.add(zone.id);
          zones.push({ id: zone.id, name: zone.name ?? undefined });
        }
      }
    }
  }

  return zones;
}
