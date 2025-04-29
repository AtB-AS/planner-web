import { ErrorMessage } from '@atb/components/error-message';
import style from './form.module.css';
import { MonoIcon } from '@atb/components/icon';
import { TranslatedString, useTranslation } from '@atb/translations';
import { fromDate } from '@internationalized/date';
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

export type DateSelectorProps = {
  label: TranslatedString;
  value?: string;
  errorMessage?: TranslatedString;
  onChange: (value: string) => void;
};

export default function DateSelector({
  label,
  value,
  errorMessage,
  onChange,
}: DateSelectorProps) {
  const { t } = useTranslation();
  const zonedDateTime = value
    ? fromDate(new Date(value || ''), 'Europe/Oslo')
    : undefined;

  return (
    <div className={style.dateSelectorContainer}>
      <DatePicker
        granularity="day"
        value={zonedDateTime}
        onChange={(e) => onChange(e.toString().slice(0, 10))}
        className={style.dateSelector}
        shouldForceLeadingZeros
      >
        <Label>{t(label)}</Label>
        <Group className={style.calendarSelectorGroup}>
          <DateInput className={style.dateSelectorInput}>
            {(segment) => (
              <DateSegment
                segment={segment}
                className={style.dateSelectorSegment}
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
      {errorMessage && <ErrorMessage message={t(errorMessage)} />}
    </div>
  );
}
