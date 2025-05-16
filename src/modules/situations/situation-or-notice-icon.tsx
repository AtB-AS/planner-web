import React from 'react';
import { getIconForMostCriticalSituationOrNotice } from './utils';
import { ColorIcon, SizeProps } from '@atb/components/icon';
import {
  NoticeFragment,
  SituationFragment,
} from '@atb/page-modules/assistant/journey-gql/trip-with-details.generated.ts';
import { PageText, useTranslation } from '@atb/translations';

type SituationOrNoticeIconProps = {
  accessibilityLabel?: string;
  notices?: NoticeFragment[];
  cancellation?: boolean;
  className?: string;
  iconSize?: SizeProps;
} & ({ situations: SituationFragment[] } | { situation: SituationFragment });

export const SituationOrNoticeIcon = ({
  accessibilityLabel,
  notices,
  cancellation,
  className,
  iconSize = 'normal',
  ...props
}: SituationOrNoticeIconProps) => {
  const situations =
    'situation' in props ? [props.situation] : props.situations;

  const { t } = useTranslation();

  // TODO: It might be needed to check if the transport is flexible and shows a yellow icon (warning)
  const icon = getIconForMostCriticalSituationOrNotice(
    situations,
    notices,
    cancellation,
  );
  if (!icon) return null;

  return (
    <ColorIcon
      className={className}
      size={iconSize}
      icon={icon}
      alt={t(PageText.Assistant.trip.tripPattern.hasSituationsTip)}
    />
  );
};
