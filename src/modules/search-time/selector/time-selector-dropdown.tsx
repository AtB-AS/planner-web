import { Dialog, Popover } from 'react-aria-components';

import { parseTime } from '@internationalized/date';
import style from './time-selector-dropdown.module.css';
import { and } from '@atb/utils/css';
import { Typo } from '@atb/components/typography';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTheme } from '@atb/modules/theme';

const numberItemRowHeight = 32; // px

const getNumbers = (length: number) => Array.from({ length }, (_, i) => i);
const hours = getNumbers(24);
const minutes = getNumbers(60);

export type TimeSelectorDropdownProps = {
  /** "HH:mm" (e.g. "08:30"). */
  selectedTime: string;
  onChange: (time: string) => void;
};
export default function TimeSelectorDropdown({
  selectedTime,
  onChange,
}: TimeSelectorDropdownProps) {
  const time = parseTime(selectedTime);

  const selectTime = (timeType: 'hour' | 'minute', timeValue: number) => {
    const h = timeType === 'hour' ? timeValue : time.hour;
    const m = timeType === 'minute' ? timeValue : time.minute;
    onChange(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  };

  return (
    <Popover placement="bottom right">
      <Dialog className={style.timeSelectorDialog}>
        <div
          className={style.scrollViews}
          style={{
            height: numberItemRowHeight * 7, // show 7 rows at the time
          }}
        >
          <NumberSeriesScrollView
            numberSeries={hours}
            selectedValue={time.hour}
            onSelect={(hour) => selectTime('hour', hour)}
            testID="hours"
            label="Hours"
            autoFocus
          />
          <NumberSeriesScrollView
            numberSeries={minutes}
            selectedValue={time.minute}
            onSelect={(minute) => selectTime('minute', minute)}
            testID="minutes"
            label="Minutes"
          />
        </div>
      </Dialog>
    </Popover>
  );
}

type NumberSeriesScrollViewProps = {
  numberSeries: number[];
  selectedValue: number;
  onSelect: (number: number) => void;
  testID?: string;
  label: string;
  autoFocus?: boolean;
};

const NumberSeriesScrollView = ({
  numberSeries,
  selectedValue,
  onSelect,
  testID,
  label,
  autoFocus,
}: NumberSeriesScrollViewProps) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
  const initialSelectedValue = useRef(selectedValue);
  const [focusedValue, setFocusedValue] = useState<number | null>(null);
  const listboxId = useId();

  const scrollToValue = useCallback(
    (value: number, behavior: ScrollBehavior = 'instant') => {
      if (!scrollContainerRef.current) return;
      const index = numberSeries.findIndex((n) => n === value);
      if (index !== -1) {
        scrollContainerRef.current.scrollTo({
          behavior,
          top: (index + numberSeries.length) * numberItemRowHeight,
        });
      }
    },
    [numberSeries],
  );

  useEffect(() => {
    scrollToValue(initialSelectedValue.current);
  }, [scrollToValue, theme.spacing.small]);

  const scrollContainerCallbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      scrollContainerRef.current = node;
      if (node && autoFocus) {
        node.focus({ preventScroll: true });
      }
    },
    [autoFocus],
  );

  const getOptionId = (value: number) => `${listboxId}-option-${value}`;

  // Keyboard handler: Arrow Up/Down to navigate, Enter/Space to select.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const len = numberSeries.length;
    const current = focusedValue ?? selectedValue;
    let next = current;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        next = (current + 1) % len;
        break;
      case 'ArrowUp':
        e.preventDefault();
        next = (current - 1 + len) % len;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect(current);
        return;
      default:
        return;
    }

    setFocusedValue(next);
    scrollToValue(next, 'smooth');
  };

  const handleFocus = () => {
    setFocusedValue(selectedValue);
    scrollToValue(selectedValue, 'smooth');
  };

  const handleBlur = () => {
    setFocusedValue(null);
  };

  // To ensure that the default value can always be selected and aligned on top, repeat the numbers 3 times and select a number in the middle.
  // isMiddle marks the canonical copy used for aria IDs and test IDs.
  const numberItems = ['paddingBefore', 'default', 'paddingAfter'].flatMap(
    (_, i) =>
      numberSeries.map((num, index) => ({
        key: i * numberSeries.length + index,
        value: num,
        isMiddle: i === 1,
      })),
  );

  // Points to the ID of the currently focused option so screen readers
  // announce it while DOM focus remains on the container.
  const activeDescendant =
    focusedValue !== null ? getOptionId(focusedValue) : undefined;

  return (
    <div
      ref={scrollContainerCallbackRef}
      className={style.scrollView}
      role="listbox"
      aria-label={label}
      aria-activedescendant={activeDescendant}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {numberItems.map((numberItem) => {
        const isSelected = selectedValue === numberItem.value;
        const isFocused = focusedValue === numberItem.value;
        return (
          <Typo.div
            key={numberItem.key}
            role="option"
            id={numberItem.isMiddle ? getOptionId(numberItem.value) : undefined}
            aria-selected={isSelected}
            textType={isSelected ? 'body__m__strong' : 'body__m'}
            style={{ height: numberItemRowHeight + 'px' }}
            className={and(
              style.numberItem,
              isSelected && style.numberItemSelected,
              isFocused && style.numberItemFocused,
            )}
            onClick={() => onSelect(numberItem.value)}
            testID={
              numberItem.isMiddle
                ? `time-${testID}-${numberItem.value.toString().padStart(2, '0')}`
                : undefined
            }
          >
            {numberItem.value.toString().padStart(2, '0')}
          </Typo.div>
        );
      })}
    </div>
  );
};
