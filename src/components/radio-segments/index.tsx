import { CSSProperties } from 'react';
import style from './radio-segments.module.css';
import { Typo } from '../typography';
import { and } from '@atb/utils/css';

export type SegmentOptions = {
  onPress: (index: number) => void;
  text: string;
  selected?: boolean;
  accessibilityLabel?: string;
};
type RadioSegmentsProps = {
  options: SegmentOptions[];
  activeIndex?: number;
  name: string;
  className?: string;
};
export function RadioSegments({
  options,
  activeIndex,
  name,
  className,
}: RadioSegmentsProps) {
  return (
    <div
      className={and(style.options, className)}
      style={
        {
          '--number-of-options': options.length,
        } as CSSProperties
      }
    >
      {options.map((state, index) => {
        const selected = activeIndex === index;
        return (
          <label key={index} className={style.option}>
            <input
              type="radio"
              name={name}
              value={state.text}
              checked={selected}
              onChange={() => state.onPress(index)}
              className={style.option__input}
              aria-label={state.accessibilityLabel}
            />
            <span className={style.option__label}>
              {selected && <span className={style.option__selected} />}
              <Typo.span
                className={style.option__text}
                textType={selected ? 'body__s__strong' : 'body__s'}
              >
                {state.text}
              </Typo.span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
