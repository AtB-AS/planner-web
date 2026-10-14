import {
  DateInput,
  DateSegment,
  Label,
  TimeField,
  Button,
  DialogTrigger,
  Group,
} from 'react-aria-components';
import { useState } from 'react';

import { MonoIcon, TintedMonoIcon } from '@atb/components/icon';
import { ModuleText, useTranslation } from '@atb/translations';
import { parseTime } from '@internationalized/date';
import style from './selector.module.css';
import TimeSelectorDropdown from './time-selector-dropdown';

export type TimeSelectorProps = {
  selectedTime: string;
  onChange: (value: string) => void;
  onValueChanged: (isChanged: boolean) => void;
};
export default function TimeSelector({
  selectedTime,
  onChange,
  onValueChanged,
}: TimeSelectorProps) {
  const { t } = useTranslation();
  const parsedValue = parseTime(selectedTime);
  const [isOpen, setOpen] = useState(false);

  return (
    <TimeField
      value={parsedValue}
      onChange={(change) => {
        onValueChanged(true);
        change && onChange(change.toString());
      }}
      hourCycle={24}
      shouldForceLeadingZeros
      className={style.timeSelector}
      data-testid="searchTimeSelector-time"
      granularity="minute"
    >
      <Button className={style.editButton} onPress={() => setOpen(true)}>
        <MonoIcon icon="time/Time" className={style.selectorIcon} />
      </Button>
      <Label className={style.timeSelectorLabel}>
        {t(ModuleText.SearchTime.time)}
      </Label>
      <Group className={style.timeSelectorGroup}>
        <DateInput className={style.timeSelectorInput}>
          {(segment) => (
            <DateSegment
              className={style.timeSelectorSegment}
              segment={segment}
              data-testid={`time-${segment.type}`}
            />
          )}
        </DateInput>

        <DialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
          <Button className={style.editButton} data-testid="timePickerButton">
            <TintedMonoIcon icon="actions/Edit" />
          </Button>

          <TimeSelectorDropdown
            selectedTime={selectedTime}
            onChange={(time) => {
              onChange(time);
              onValueChanged(true);
            }}
            data-testid={`time-${selectedTime}`}
          />
        </DialogTrigger>
      </Group>
    </TimeField>
  );
}
