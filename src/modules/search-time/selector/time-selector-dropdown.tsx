import { Dialog, Popover } from 'react-aria-components';

import { parseTime } from '@internationalized/date';
import style from './time-selector-dropdown.module.css';
import { and } from '@atb/utils/css';
import { Typo } from '@atb/components/typography';
import { useEffect, useRef } from 'react';
import { useTheme } from '@atb/modules/theme';

const numberItemRowHeight = 32; // px

const getNumbers = (length: number) => Array.from({ length }, (_, i) => i);
const hours = getNumbers(24);
const minutes = getNumbers(60);

export type TimeSelectorDropdownProps = {
  /** “HH:mm” (e.g. “08:30”). */
  selectedTime: string;
  onChange: (time: string) => void;
};
export default function TimeSelectorDropdown({
  selectedTime,
  onChange,
}: TimeSelectorDropdownProps) {
  const theme = useTheme();

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
          <NumbersScrollView
            numbers={hours}
            selectedValue={time.hour}
            onSelect={(hour) => selectTime('hour', hour)}
          />
          <NumbersScrollView
            numbers={minutes}
            selectedValue={time.minute}
            onSelect={(minute) => selectTime('minute', minute)}
          />
        </div>
      </Dialog>
    </Popover>
  );
}

type NumbersScrollViewProps = {
  numbers: number[];
  selectedValue: number;
  onSelect: (number: number) => void;
};

const NumbersScrollView = ({
  numbers,
  selectedValue,
  onSelect,
}: NumbersScrollViewProps) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
  const initialSelectedValue = useRef(selectedValue);

  useEffect(() => {
    const initialNumberIndex = numbers.findIndex(
      (number) => number === initialSelectedValue.current,
    );
    if (initialNumberIndex !== -1 && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        behavior: 'instant',
        top: initialNumberIndex * numberItemRowHeight,
      });
    }
  }, [initialSelectedValue, numbers, theme.spacing.small]);

  return (
    <div ref={scrollContainerRef} className={style.scrollView}>
      {numbers.map((number) => {
        const isSelected = selectedValue === number;
        return (
          <Typo.div
            key={number}
            textType={isSelected ? 'body__primary--bold' : 'body__primary'}
            style={{ height: numberItemRowHeight + 'px' }}
            className={and(
              style.numberItem,
              isSelected && style.numberItemSelected,
            )}
            onClick={() => onSelect(number)}
          >
            {number.toString().padStart(2, '0')}
          </Typo.div>
        );
      })}
    </div>
  );
};
