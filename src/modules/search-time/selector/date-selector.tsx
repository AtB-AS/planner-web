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

import { ModuleText, useTranslation } from '@atb/translations';
import { fromDate, parseDate } from '@internationalized/date';

export type DateSelectorProps = {
  value: Date;
  min: string;
  onChange: (value: string) => void;
};
// export default function TimeSelector({ value, onChange }: TimeSelectorProps) {
//   const { t } = useTranslation();
//   const parsedValue = parseTime(value);

//   return (
//     <TimeField
//       value={parsedValue}
//       onChange={(change) => onChange(change.toString())}
//       hourCycle={24}
//       shouldForceLeadingZeros
//       className={style.timeSelector}
//       data-testid="searchTimeSelector-time"
//       granularity="minute"
//     >
//       <Label className={style.timeSelectorLabel}>
//         {t(ModuleText.SearchTime.time)}
//       </Label>
//       <DateInput className={style.timeSelectorInput}>
//         {(segment) => (
//           <DateSegment
//             className={style.timeSelectorSegment}
//             segment={segment}
//           />
//         )}
//       </DateInput>
//     </TimeField>
//   );
// }

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
    >
      <Label>{t(ModuleText.SearchTime.date)}</Label>
      <Group>
        <DateInput>{(segment) => <DateSegment segment={segment} />}</DateInput>
        <Button>C</Button>
      </Group>
      <Popover>
        <Dialog>
          <Calendar>
            <header>
              <Button slot="previous">◀</Button>
              <Heading />
              <Button slot="next">▶</Button>
            </header>
            <CalendarGrid>
              {(date) => <CalendarCell date={date} />}
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </DatePicker>
  );
}
