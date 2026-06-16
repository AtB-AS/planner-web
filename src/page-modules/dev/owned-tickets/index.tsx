import {
  ACTIVE_ZONE_NAMES,
  type OwnedTicket,
} from '@atb/page-modules/dev/trip-pattern/utils';
import style from './owned-tickets.module.css';

export type OwnedTicketsEditorProps = {
  value: OwnedTicket[];
  onChange: (next: OwnedTicket[]) => void;
};

// Quick-set presets for the validity-remaining input, in minutes.
const DURATIONS: { minutes: number; label: string }[] = [
  { minutes: 30, label: '30' },
  { minutes: 60, label: '60' },
  { minutes: 90, label: '90' },
  { minutes: 24 * 60, label: '24h' },
];
const DEFAULT_DURATION_MIN = 24 * 60;

/**
 * Dev-mode editor for the tickets a traveller already holds. Each row is the
 * zones the ticket is valid in plus how long it stays valid from the trip's
 * start. The ticket plan subtracts these from every trip's route. Renders
 * nothing for orgs without a tariff config (no zones to pick).
 */
export function OwnedTicketsEditor({
  value,
  onChange,
}: OwnedTicketsEditorProps) {
  if (ACTIVE_ZONE_NAMES.length === 0) return null;

  const update = (index: number, patch: Partial<OwnedTicket>) =>
    onChange(value.map((t, i) => (i === index ? { ...t, ...patch } : t)));

  const remove = (index: number) =>
    onChange(value.filter((_, i) => i !== index));

  const add = () =>
    onChange([...value, { zones: [], remainingMinutes: DEFAULT_DURATION_MIN }]);

  const toggleZone = (index: number, zone: string) => {
    const zones = value[index].zones.includes(zone)
      ? value[index].zones.filter((z) => z !== zone)
      : [...value[index].zones, zone];
    update(index, { zones });
  };

  return (
    <div className={style.ownedTickets}>
      {value.length === 0 && (
        <span className={style.empty}>
          No owned tickets — the plan bills the whole trip.
        </span>
      )}
      {value.map((ticket, index) => (
        <div key={index} className={style.row}>
          <div className={style.zones}>
            {ACTIVE_ZONE_NAMES.map((zone) => (
              <button
                key={zone}
                type="button"
                className={`${style.zoneChip} ${
                  ticket.zones.includes(zone) ? style.zoneChipOn : ''
                }`}
                onClick={() => toggleZone(index, zone)}
              >
                {zone}
              </button>
            ))}
          </div>
          <div className={style.minutes}>
            <span>valid</span>
            <input
              className={style.minutesInput}
              type="number"
              min={0}
              placeholder="∞"
              value={ticket.remainingMinutes ?? ''}
              onChange={(e) =>
                update(index, {
                  remainingMinutes:
                    e.target.value === '' ? undefined : Number(e.target.value),
                })
              }
            />
            <span>min</span>
            <div className={style.presets}>
              {DURATIONS.map((duration) => (
                <button
                  key={duration.minutes}
                  type="button"
                  className={`${style.zoneChip} ${
                    ticket.remainingMinutes === duration.minutes
                      ? style.zoneChipOn
                      : ''
                  }`}
                  onClick={() =>
                    update(index, { remainingMinutes: duration.minutes })
                  }
                >
                  {duration.label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            className={style.remove}
            onClick={() => remove(index)}
            aria-label="Remove ticket"
          >
            ×
          </button>
        </div>
      ))}
      <button type="button" className={style.add} onClick={add}>
        + Add owned ticket
      </button>
    </div>
  );
}
