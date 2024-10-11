import {
  DateInput,
  DateSegment,
  Label,
  TimeField,
} from 'react-aria-components';

import { ModuleText, useTranslation } from '@atb/translations';
import { parseTime } from '@internationalized/date';
import style from './inputs.module.css';

export type TimeSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};
export default function TimeInput({ value, onChange }: TimeSelectorProps) {
  const { t } = useTranslation();
  const parsedValue = parseTime(value);

  return (
    <TimeField
      value={parsedValue}
      onChange={(change) => onChange(change.toString())}
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
    </TimeField>
  );
}
