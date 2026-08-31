import { TravelCardHeader } from './travel-card-header';
import { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';
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

  return (
    <div className={style.container}>
      <TravelCardHeader tripPattern={tripPattern} />

      <TravelCardLegs tripPattern={tripPattern} />
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
