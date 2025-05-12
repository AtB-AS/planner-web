import {
  Dialog,
  ListLayout,
  Popover,
  Virtualizer,
} from 'react-aria-components';

import { parseTime } from '@internationalized/date';
import style from './time-selector-dropdown.module.css';
import { and } from '@atb/utils/css';
import { Typo } from '@atb/components/typography';

type NumberItem = {
  id: string;
  value: number;
};

type NumberType = 'hours' | 'minutes';

const generateNumberItems = (numberOfItems: number): NumberItem[] =>
  Array.from({ length: numberOfItems }, (_, h) => ({
    id: h.toString(),
    value: h,
  }));
const hours = generateNumberItems(24);
const minutes = generateNumberItems(60);

export type TimeSelectorDropdownProps = {
  /** “HH:mm” (e.g. “08:30”). */
  value: string;
  onChange: (value: string) => void;
};
export default function TimeSelectorDropdown({
  value,
  onChange,
}: TimeSelectorDropdownProps) {
  const time = parseTime(value);
  // const { t } = useTranslation();
  const setTime = (part: NumberType, value: number) => {
    const h = part === 'hours' ? value : time.hour;
    const m = part === 'minutes' ? value : time.minute;
    onChange(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  };

  return (
    <Popover placement="bottom right">
      <Dialog className={style.timeSelectorDialog}>
        <div className={style.scrollViews}>
          <NumberScrollView
            selectedValue={time.hour}
            onSelect={(value) => setTime('hours', value)}
            items={hours}
          />
          <NumberScrollView
            selectedValue={time.minute}
            onSelect={(value) => setTime('minutes', value)}
            items={minutes}
          />
        </div>
      </Dialog>
    </Popover>
  );
}

type NumberScrollViewProps = {
  items: NumberItem[];
  selectedValue: number;
  onSelect: (value: number) => void;
};

const NumberScrollView = ({
  items,
  selectedValue,
  onSelect,
}: NumberScrollViewProps) => {
  console.log('selectedValue', selectedValue);
  return (
    <div className={style.scrollView}>
      <Virtualizer layout={ListLayout} layoutOptions={{ rowHeight: 32 }}>
        {items.map((item) => {
          const isSelected = selectedValue === item.value;
          return (
            <Typo.p
              key={item.id}
              textType={isSelected ? 'body__primary--bold' : 'body__primary'}
              className={and(
                style.numberItem,
                isSelected && style.numberItemSelected,
              )}
              onClick={() => onSelect(item.value)}
            >
              {item.value.toString().padStart(2, '0')}
            </Typo.p>
          );
        })}
      </Virtualizer>
    </div>
  );
};
