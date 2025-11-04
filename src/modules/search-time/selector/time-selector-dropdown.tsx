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
          />
          <NumberSeriesScrollView
            numberSeries={minutes}
            selectedValue={time.minute}
            onSelect={(minute) => selectTime('minute', minute)}
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
};

const NumberSeriesScrollView = ({
  numberSeries,
  selectedValue,
  onSelect,
}: NumberSeriesScrollViewProps) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
  const initialSelectedValue = useRef(selectedValue);

  useEffect(() => {
    const initialNumberIndex = numberSeries.findIndex(
      (number) => number === initialSelectedValue.current,
    );
    if (initialNumberIndex !== -1 && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        behavior: 'instant',
        top: (initialNumberIndex + numberSeries.length) * numberItemRowHeight, // the numbers are repeated 3 times, this selects from the one in the middle
      });
    }
  }, [initialSelectedValue, numberSeries, theme.spacing.small]);

  // To ensure that the default value can always be selected and aligned on top, repeat the numbers 3 times and select a number in the middle.
  const numberItems = ['paddingBefore', 'default', 'paddingAfter'].flatMap(
    (_, i) =>
      numberSeries.map((num, index) => ({
        key: i * numberSeries.length + index,
        value: num,
      })),
  );

  return (
    <div ref={scrollContainerRef} className={style.scrollView}>
      {numberItems.map((numberItem) => {
        const isSelected = selectedValue === numberItem.value;
        return (
          <Typo.div
            key={numberItem.key}
            textType={isSelected ? 'body__m__strong' : 'body__m'}
            style={{ height: numberItemRowHeight + 'px' }}
            className={and(
              style.numberItem,
              isSelected && style.numberItemSelected,
            )}
            onClick={() => onSelect(numberItem.value)}
          >
            {numberItem.value.toString().padStart(2, '0')}
          </Typo.div>
        );
      })}
    </div>
  );
};
