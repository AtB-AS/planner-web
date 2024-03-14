import { ColorIcon } from '@atb/components/icon';
import { Typo } from '@atb/components/typography';
import { TripRow } from '@atb/modules/trip-details';

import style from './trip-section.module.css';

type RealtimeSectionProps = {
  realtimeText: string;
};

export function RealtimeSection({ realtimeText }: RealtimeSectionProps) {
  return (
    <TripRow>
      <div className={style.realtimeSection}>
        <ColorIcon
          icon="status/Realtime"
          data-testid="rt-indicator"
          size="xSmall"
          role="none"
          alt=""
        />
        <Typo.p
          textType="body__secondary"
          className={style.textColor__secondary}
        >
          {realtimeText}
        </Typo.p>
      </div>
    </TripRow>
  );
}
