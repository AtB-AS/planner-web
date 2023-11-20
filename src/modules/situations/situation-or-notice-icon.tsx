import React from 'react';
import { getIconForMostCriticalSituationOrNotice } from './utils';
import { Notice, Situation } from './types';
import { ColorIcon } from '@atb/components/icon';

type SituationOrNoticeIconProps = {
  accessibilityLabel?: string;
  notices?: Notice[];
  cancellation?: boolean;
  className?: string;
} & ({ situations: Situation[] } | { situation: Situation });

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
