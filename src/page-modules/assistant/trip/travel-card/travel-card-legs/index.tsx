import { secondsBetween } from '@atb/utils/date';
import {
  TransportIconWithDuration,
  TransportNotificationBadge,
} from '@atb/modules/transport-mode';
import { isLineFlexibleTransport } from '@atb/modules/flexible';
import {
  ExtendedLegType,
  ExtendedTripPatternWithDetailsType,
} from '@atb/page-modules/assistant';
import {
  getMostCriticalStatus,
  getMsgTypeForMostCriticalSituationOrNotice,
} from '@atb/modules/situations-and-notices';
import { getNoticesForLeg } from '@atb/page-modules/assistant/utils';
import { Statuses } from '@atb/modules/theme';
import { TransportSubmode } from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';
import { OverflowContainer } from '@atb/components/overflow-container';
import { CounterBox } from '@atb/components/counter-box';
import style from './travel-card-legs.module.css';
import { getFilteredLegsByWalkOrWaitTime } from '@atb/page-modules/assistant/trip';
import { isShortWaitTime, isTransferInto } from '@atb/modules/trip-patterns';

type Props = {
  tripPattern: ExtendedTripPatternWithDetailsType;
};

export function TravelCardLegs({ tripPattern }: Props) {
  const filteredLegs = getFilteredLegsByWalkOrWaitTime(tripPattern);

  const staySeated = (idx: number) => {
    const leg = filteredLegs[idx];
    return leg && leg.interchangeTo?.staySeated === true;
  };

  const renderedLegs = filteredLegs
    .map((leg, originalIndex) => ({ leg, originalIndex }))
    .filter(({ originalIndex }) => !staySeated(originalIndex - 1));

  const legNotificationTypes = renderedLegs.map(({ originalIndex }) =>
    getLegNotificationType(filteredLegs, originalIndex),
  );

  return (
    <div className={style.legs}>
      <OverflowContainer
        className={style.legsAndLine}
        overflow={(hiddenCount) => {
          const notificationType = getMostCriticalStatus(
            legNotificationTypes.slice(-hiddenCount),
          );
          return (
            <CounterBox
              count={hiddenCount}
              notification={
                notificationType && (
                  <TransportNotificationBadge
                    notificationType={notificationType}
                  />
                )
              }
            />
          );
        }}
      >
        {renderedLegs.map(({ leg }, i) => (
          <TransportIconWithDuration
            key={leg.id ?? i}
            transportMode={leg.mode}
            transportSubmode={leg.transportSubmode}
            label={
              leg.mode === 'foot'
                ? undefined
                : (leg.line?.publicCode ?? undefined)
            }
            duration={leg.mode === 'foot' ? leg.duration : undefined}
            isFlexible={isLineFlexibleTransport(leg.line)}
            notificationType={legNotificationTypes[i]}
          />
        ))}
      </OverflowContainer>
    </div>
  );
}

function getLegOverflowNotificationType(
  leg: ExtendedLegType,
): Statuses | undefined {
  return getMsgTypeForMostCriticalSituationOrNotice(
    leg.situations,
    getNoticesForLeg(leg),
    leg.fromEstimatedCall?.cancellation,
  );
}

function getLegNotificationType(
  legs: ExtendedLegType[],
  index: number,
): Statuses | undefined {
  const leg = legs[index];
  const situationsMsgType = getLegOverflowNotificationType(leg);
  const railReplacementMsgType =
    leg.transportSubmode === TransportSubmode.RailReplacementBus
      ? ('warning' as const)
      : undefined;
  const bookingMsgType = leg.bookingArrangements
    ? ('warning' as const)
    : undefined;
  const requestStopMsgType =
    leg.fromEstimatedCall?.requestStop || leg.toEstimatedCall?.requestStop
      ? 'info'
      : undefined;
  const shortTransferMsgType: Statuses | undefined = (() => {
    if (!isTransferInto(legs, index)) return undefined;
    // A transfer has a leg before it by definition, so there is a gap to measure.
    const waitSeconds = secondsBetween(
      legs[index - 1].expectedEndTime,
      leg.expectedStartTime,
    );
    return isShortWaitTime(waitSeconds) ? 'info' : undefined;
  })();

  return getMostCriticalStatus([
    situationsMsgType,
    railReplacementMsgType,
    bookingMsgType,
    requestStopMsgType,
    shortTransferMsgType,
  ]);
}
