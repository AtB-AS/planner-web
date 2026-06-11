import type { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';
import { currentOrg } from '@atb/modules/org-data';
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
    </aside>
  );
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
