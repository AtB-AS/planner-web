import {
  DateInput,
  DateSegment,
  Label,
  TimeField,
  Button,
  DialogTrigger,
  Group,
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
      onChange={(change) => change && onChange(change.toString())}
      hourCycle={24}
      shouldForceLeadingZeros
      className={style.timeSelector}
      data-testid="searchTimeSelector-time"
      granularity="minute"
    >
      <Label className={style.timeSelectorLabel}>
        {t(ModuleText.SearchTime.time)}
      </Label>
      <Group className={style.timeSelectorGroup}>
        <DateInput className={style.timeSelectorInput}>
          {(segment) => (
            <DateSegment
              className={style.timeSelectorSegment}
              segment={segment}
            />
          )}
        </DateInput>

        <DialogTrigger>
          <Button excludeFromTabOrder className={style.timePickerButton}>
            <MonoIcon icon="time/Time" />
          </Button>

          <TimeSelectorDropdown
            selectedTime={selectedTime}
            onChange={onChange}
          />
        </DialogTrigger>
      </Group>
    </TimeField>
  );
}
