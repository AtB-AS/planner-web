import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DatePicker,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Label,
  Popover,
} from 'react-aria-components';

import { MonoIcon } from '@atb/components/icon';
import { ModuleText, useTranslation } from '@atb/translations';
import { fromDate, parseDate } from '@internationalized/date';
import style from './selector.module.css';

export type DateSelectorProps = {
  value: Date;
  min: string;
  onChange: (value: string) => void;
};

export default function DateSelector({
  value,
  onChange,
  min,
}: DateSelectorProps) {
  const { t } = useTranslation();

  return (
    <DatePicker
      granularity="day"
      value={fromDate(value, 'Europe/Oslo')}
      onChange={(e) => onChange(e.toString().slice(0, 10))}
      minValue={parseDate(min)}
      className={style.dateSelector}
      shouldForceLeadingZeros
    >
      <Label className={style.timeSelectorLabel}>
        {t(ModuleText.SearchTime.date)}
      </Label>
      <Group className={style.calendarSelectorGroup}>
        <DateInput className={style.timeSelectorInput}>
          {(segment) => (
            <DateSegment
              className={style.timeSelectorSegment}
              segment={segment}
            />
          )}
        </DateInput>
        <Button className={style.calendarButton}>
          <MonoIcon icon="time/Date" />
        </Button>
      </Group>
      <Popover className={style.calendarDialog} placement="bottom right">
        <Dialog>
          <Calendar>
            <header className={style.calendarDialog__header}>
              <Button
                slot="previous"
                className={style.calendarDialog__headerButtons}
              >
                <MonoIcon icon="navigation/ArrowLeft" />
              </Button>
              <Heading className={style.calendarDialog__title} />
              <Button
                slot="next"
                className={style.calendarDialog__headerButtons}
              >
                <MonoIcon icon="navigation/ArrowRight" />
              </Button>
            </header>
            <CalendarGrid className={style.calendarGrid}>
              {(date) => (
                <CalendarCell
                  date={date}
                  className={style.calendarGrid__cell}
                />
              )}
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </DatePicker>
  );
}
