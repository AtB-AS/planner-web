import {
  DateInput,
  DateSegment,
  Label,
  TimeField,
  Button,
  DialogTrigger,
} from 'react-aria-components';

import { MonoIcon } from '@atb/components/icon';
import { ModuleText, useTranslation } from '@atb/translations';
import { parseTime } from '@internationalized/date';
import style from './selector.module.css';
import TimeSelectorDropdown from './time-selector-dropdown';

export type TimeSelectorProps = {
  selectedTime: string;
  onChange: (value: string) => void;
};
export default function TimeSelector({
  selectedTime,
  onChange,
}: TimeSelectorProps) {
  const { t } = useTranslation();
  const parsedValue = parseTime(selectedTime);

  return (
    <TimeField
      value={parsedValue}
      onChange={(change) => onChange((change || '00:00').toString())}
      hourCycle={24}
      shouldForceLeadingZeros
      className={style.timeSelector}
      data-testid="searchTimeSelector-time"
      granularity="minute"
    >
      <Label className={style.timeSelectorLabel}>
        {t(ModuleText.SearchTime.time)}
      </Label>
      <DateInput className={style.timeSelectorInput}>
        {(segment) => (
          <DateSegment
            className={style.timeSelectorSegment}
            segment={segment}
          />
        )}
      </DateInput>

      <DialogTrigger>
        <Button
          className={style.timePickerButton}
          aria-label={t(ModuleText.SearchTime.time)}
        >
          <MonoIcon icon="time/Time" />
        </Button>

        <TimeSelectorDropdown
          selectedTime={selectedTime || '00:00'}
          onChange={onChange}
        />
      </DialogTrigger>
    </TimeField>
  );
}
