import {
  ACTIVE_ZONE_NAMES,
  type OwnedTicket,
} from '@atb/page-modules/dev/trip-pattern/utils';
import style from './owned-tickets.module.css';

export type OwnedTicketsEditorProps = {
  value: OwnedTicket[];
  onChange: (next: OwnedTicket[]) => void;
};

const KINDS: OwnedTicket['kind'][] = ['day', 'single', 'period'];
const KIND_LABELS: Record<OwnedTicket['kind'], string> = {
  day: '24-hour',
  single: 'Single',
  period: 'Period',
};

/**
 * Dev-mode editor for the tickets a traveller already holds. Each row is a
 * ticket kind (labelling only), the zones it's valid in, and how many minutes
 * of validity remain at the trip's start (blank = valid the whole trip). The
 * ticket plan subtracts these from every trip's route. Renders nothing for orgs
 * without a tariff config (no zones to pick).
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
    onChange([
      ...value,
      { kind: 'period', zones: [], remainingMinutes: undefined },
    ]);

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
          <select
            className={style.kindSelect}
            value={ticket.kind}
            onChange={(e) =>
              update(index, { kind: e.target.value as OwnedTicket['kind'] })
            }
          >
            {KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {KIND_LABELS[kind]}
              </option>
            ))}
          </select>
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
          <label className={style.minutes}>
            <input
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
            <span>min left</span>
          </label>
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
