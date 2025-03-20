import React from 'react';
import { getIconForMostCriticalSituationOrNotice } from './utils';
import { Notice, Situation } from './types';
import { ColorIcon } from '@atb/components/icon';
import {
  NoticeFragment,
  SituationFragment,
} from '@atb/page-modules/assistant/server/journey-planner/journey-gql/trip.generated.ts';

type SituationOrNoticeIconProps = {
  accessibilityLabel?: string;
  notices?: NoticeFragment[];
  cancellation?: boolean;
  className?: string;
} & ({ situations: SituationFragment[] } | { situation: SituationFragment });

export const SituationOrNoticeIcon = ({
  accessibilityLabel,
  notices,
  cancellation,
  className,
  ...props
}: SituationOrNoticeIconProps) => {
  const situations =
    'situation' in props ? [props.situation] : props.situations;

  // TODO: It might be needed to check if the transport is flexible and shows a yellow icon (warning)
  const icon = getIconForMostCriticalSituationOrNotice(
    situations,
    notices,
    cancellation,
  );
  if (!icon) return null;

  return (
    <ColorIcon className={className} icon={icon} alt={accessibilityLabel} />
  );
};
