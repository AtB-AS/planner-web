import type { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';
import {
  computeTicketPlan,
  formatOsloTime,
} from '@atb/page-modules/dev/trip-pattern/utils';
import style from './ticket-plan.module.css';

export type TicketPlanPanelProps = {
  tripPattern: ExtendedTripPatternWithDetailsType;
};

/**
 * Dev-mode panel showing the single tickets a traveller must buy for a trip
 * (zone span, price, validity window and the boardings each covers) and, when
 * cheaper, a 24-hour ticket suggestion. Renders nothing when the org has no
 * tariff config or the trip has no transit legs (`computeTicketPlan` → null).
 */
export function TicketPlanPanel({ tripPattern }: TicketPlanPanelProps) {
  const plan = computeTicketPlan(tripPattern);
  if (!plan) return null;

  return (
    <div
      className={`${style.ticketPlan} ${
        plan.recommendDayTicket ? style.ticketPlanWarn : ''
      }`}
    >
      <span className={style.ticketPlanHeader}>
        {plan.tickets.length > 1
          ? `${plan.recommendDayTicket ? '⚠ ' : ''}${
              plan.tickets.length
            } single tickets · ${plan.singleTotalKr} kr`
          : `1 ticket covers this trip · ${plan.singleTotalKr} kr`}
      </span>
      {plan.tickets.map((ticket, ti) => (
        <div key={ti} className={style.ticketRow}>
          <span>
            {`Ticket ${ti + 1}: ${ticket.fromZone}→${ticket.toZone} · ${
              ticket.zoneCount
            } ${ticket.zoneCount === 1 ? 'zone' : 'zones'} · ${
              ticket.priceKr
            } kr · ${ticket.validityMinutes} min · ${formatOsloTime(
              ticket.activatedAtMs,
            )}–${formatOsloTime(ticket.expiresAtMs)}`}
          </span>
          <span className={style.ticketBoardings}>
            {`covers: ${ticket.boardings
              .map((b) => `${formatOsloTime(b.timeMs)} (${b.label})`)
              .join(', ')}`}
          </span>
          {ti > 0 && (
            <span className={style.ticketTrigger}>
              {`new ticket — previous expired ${formatOsloTime(
                plan.tickets[ti - 1].expiresAtMs,
              )}`}
            </span>
          )}
        </div>
      ))}
      {plan.recommendDayTicket && (
        <span className={style.ticketRecommendation}>
          {`💡 Buy a 24-hour ticket (${plan.dayTicketKr} kr, valid 24h in zone ${
            plan.tickets[0].fromZone
          }) instead — ${
            plan.singleTotalKr > plan.dayTicketKr
              ? `saves ${plan.singleTotalKr - plan.dayTicketKr} kr`
              : 'same price but valid all day'
          }`}
        </span>
      )}
    </div>
  );
}
