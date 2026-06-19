import type { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';
import {
  computeTicketPlan,
  formatOsloTime,
  type OwnedTicket,
} from '@atb/page-modules/dev/trip-pattern/utils';
import style from './ticket-plan.module.css';

export type TicketPlanPanelProps = {
  tripPattern: ExtendedTripPatternWithDetailsType;
  /** Tickets the traveller already holds; the plan only bills the rest. */
  ownedTickets?: OwnedTicket[];
};

/**
 * Dev-mode panel showing the single tickets a traveller must buy for a trip
 * (zone span, price, validity window and the boardings each covers) and, when
 * cheaper, a 24-hour ticket suggestion. Tickets the traveller already holds are
 * subtracted from the route, so spans they cover show as "covered" and partial
 * spans are billed for the un-owned zones only. Renders nothing when the org
 * has no tariff config or the trip has no transit legs.
 */
export function TicketPlanPanel({
  tripPattern,
  ownedTickets,
}: TicketPlanPanelProps) {
  const plan = computeTicketPlan(tripPattern, { ownedTickets });
  if (!plan) return null;

  const bought = plan.tickets.filter((ticket) => !ticket.fullyCovered);
  const firstBought = bought[0];

  return (
    <div
      className={`${style.ticketPlan} ${
        plan.recommendDayTicket ? style.ticketPlanWarn : ''
      }`}
    >
      <span className={style.ticketPlanHeader}>
        {bought.length === 0
          ? 'Fully covered by your tickets · 0 kr'
          : bought.length > 1
            ? `${plan.recommendDayTicket ? '⚠ ' : ''}${
                bought.length
              } single tickets · ${plan.singleTotalKr} kr`
            : `1 ticket covers this trip · ${plan.singleTotalKr} kr`}
      </span>
      {plan.tickets.map((ticket, ti) =>
        ticket.fullyCovered ? (
          <div key={ti} className={style.ticketRow}>
            <span className={style.ticketCovered}>
              {`✓ covered by owned ${ticket.coveredZones.join(', ') || 'ticket'}`}
            </span>
            <span className={style.ticketBoardings}>
              {`${ticket.boardings
                .map((b) => `${formatOsloTime(b.timeMs)} (${b.label})`)
                .join(', ')}`}
            </span>
          </div>
        ) : (
          <div key={ti} className={style.ticketRow}>
            <span>
              {`${ticket.fromZone}→${ticket.toZone} · ${ticket.zoneCount} ${
                ticket.zoneCount === 1 ? 'zone' : 'zones'
              } · ${ticket.priceKr} kr · ${
                ticket.validityMinutes
              } min · ${formatOsloTime(ticket.activatedAtMs)}–${formatOsloTime(
                ticket.expiresAtMs,
              )}`}
            </span>
            {ticket.coveredZones.length > 0 && (
              <span className={style.ticketTrigger}>
                {`${ticket.coveredZones.join(', ')} on your owned ticket`}
              </span>
            )}
            <span className={style.ticketBoardings}>
              {`covers: ${ticket.boardings
                .map((b) => `${formatOsloTime(b.timeMs)} (${b.label})`)
                .join(', ')}`}
            </span>
          </div>
        ),
      )}
      {plan.recommendDayTicket && firstBought && (
        <span className={style.ticketRecommendation}>
          {`💡 Buy a 24-hour ticket (${plan.dayTicketKr} kr, valid 24h in zone ${
            firstBought.fromZone
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
