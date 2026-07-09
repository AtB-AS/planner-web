import { useInView } from 'react-intersection-observer';
import { TravelCardHeader } from './travel-card-header';
import { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';
import { useRefreshedTripPattern } from '@atb/page-modules/assistant/client';
import { TravelCardLegs } from '@atb/page-modules/assistant/trip/travel-card/travel-card-legs';
import { Button } from '@atb/components/button';
import { PageText, useTranslation } from '@atb/translations';
import style from './travel-card.module.css';
import { TintedMonoIcon } from '@atb/components/icon';
import { andIf } from '@atb/utils/css.ts';

type TravelCardProps = {
  tripPattern: ExtendedTripPatternWithDetailsType;
  isOpen: boolean;
  onClick?: () => void;
};

export default function TravelCard({
  tripPattern,
  isOpen,
  onClick,
}: TravelCardProps) {
  const { t } = useTranslation();
  const { ref, inView } = useInView({ rootMargin: '100px' });

  const isCancelled = tripPattern.legs.some(
    (leg) => leg.fromEstimatedCall?.cancellation,
  );

  const { refreshedTripPattern } = useRefreshedTripPattern(tripPattern, inView);
  const displayTripPattern = refreshedTripPattern ?? tripPattern;

  return (
    <div ref={ref} className={style.container}>
      <TravelCardHeader
        tripPattern={displayTripPattern}
        isCancelled={isCancelled}
      />

      <TravelCardLegs tripPattern={displayTripPattern} />
      <Button
        title={
          isOpen
            ? t(PageText.Assistant.trip.tripPattern.seeLess)
            : t(PageText.Assistant.trip.tripPattern.seeMore)
        }
        mode="transparent"
        buttonProps={{
          tabIndex: -1,
          'aria-hidden': true,
        }}
        className={style.seeMoreButton}
        size={'pill'}
        onClick={onClick}
        icon={{
          right: (
            <TintedMonoIcon
              icon="navigation/ExpandMore"
              className={andIf({
                [style.chevron]: true,
                [style.chevron__rotated]: isOpen,
              })}
            />
          ),
        }}
      />
    </div>
  );
}
