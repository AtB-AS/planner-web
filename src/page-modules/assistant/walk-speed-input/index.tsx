import { RadioSegments } from '@atb/components/radio-segments';
import { Typo } from '@atb/components/typography';
import { PageText, useTranslation } from '@atb/translations';
import style from './walk-speed.module.css';
import { useState } from 'react';

export const SLOW_WALK_SPEED = 0.8;
export const MEDIUM_WALK_SPEED = 1.3;
export const FAST_WALK_SPEED = 2;

export enum WalkSpeedOption {
  SLOW = 'slow',
  MEDIUM = 'medium',
  FAST = 'fast',
}

type Props = {
  onChange: (walkSpeed: number) => void;
  initialValue?: number;
};
export function WalkSpeedInput({ initialValue, onChange }: Props) {
  const { t } = useTranslation();
  const [walkSpeed, setWalkSpeed] = useState<WalkSpeedOption>(
    valueToOption(initialValue),
  );
  const options = [
    WalkSpeedOption.SLOW,
    WalkSpeedOption.MEDIUM,
    WalkSpeedOption.FAST,
  ];

  const getWalkSpeedText = (walkSpeed: WalkSpeedOption) => {
    switch (walkSpeed) {
      case WalkSpeedOption.SLOW:
        return t(PageText.Assistant.search.walkSpeed.options.slow);
      case WalkSpeedOption.MEDIUM:
        return t(PageText.Assistant.search.walkSpeed.options.medium);
      case WalkSpeedOption.FAST:
        return t(PageText.Assistant.search.walkSpeed.options.fast);
    }
  };

  return (
    <div>
      <Typo.h3 textType="body__m" className={style.heading}>
        {t(PageText.Assistant.search.walkSpeed.label)}
      </Typo.h3>
      <RadioSegments
        name="walkSpeedFilter"
        activeIndex={options.indexOf(walkSpeed)}
        className={style.walkSpeedSegments}
        options={options.map((speed) => ({
          onPress: () => {
            setWalkSpeed(speed);
            onChange(walkSpeedOptionMapToValue(speed));
          },
          text: getWalkSpeedText(speed),
        }))}
      />
    </div>
  );
}

export function walkSpeedOptionMapToValue(walkSpeed?: WalkSpeedOption): number {
  switch (walkSpeed) {
    case WalkSpeedOption.SLOW:
      return SLOW_WALK_SPEED;
    case WalkSpeedOption.MEDIUM:
      return MEDIUM_WALK_SPEED;
    case WalkSpeedOption.FAST:
      return FAST_WALK_SPEED;
    default:
      return MEDIUM_WALK_SPEED;
  }
}

export function valueToOption(value?: number): WalkSpeedOption {
  switch (value) {
    case SLOW_WALK_SPEED:
      return WalkSpeedOption.SLOW;
    case MEDIUM_WALK_SPEED:
      return WalkSpeedOption.MEDIUM;
    case FAST_WALK_SPEED:
      return WalkSpeedOption.FAST;
    default:
      return WalkSpeedOption.MEDIUM;
  }
}
