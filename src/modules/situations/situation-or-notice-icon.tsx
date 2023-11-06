import React from 'react';
import { getIconForMostCriticalSituationOrNotice } from './utils';
import { NoticeFragment, SituationFragment } from './types';
import { ColorIcon } from '@atb/components/icon';

type SituationOrNoticeIconProps = {
  accessibilityLabel?: string;
  notices?: NoticeFragment[];
  cancellation?: boolean;
} & ({ situations: SituationFragment[] } | { situation: SituationFragment });

export const SituationOrNoticeIcon = ({
  accessibilityLabel,
  notices,
  cancellation,
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

  return <ColorIcon icon={icon} alt={accessibilityLabel} />;
};
