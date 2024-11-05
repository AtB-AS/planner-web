import style from './form.module.css';
import { TranslatedString, useTranslation } from '@atb/translations';
import { parseTime } from '@internationalized/date';
import {
  DateInput,
  DateSegment,
  Label,
  TimeField,
} from 'react-aria-components';

export type TimeSelectorProps = {
  label: TranslatedString;
  value: string;
  onChange: (value: string) => void;
};
export default function TimeSelector({
  label,
  value,
  onChange,
}: TimeSelectorProps) {
  const { t } = useTranslation();
  const parsedValue = parseTime(value);

  return (
    <div className={style.time_field_container}>
      <Label>{t(label)}</Label>
      <TimeField
        value={parsedValue}
        onChange={(change) => onChange(change.toString())}
        hourCycle={24}
        shouldForceLeadingZeros
        className={style.timeSelector}
        data-testid="searchTimeSelector-time"
        granularity="minute"
      >
        <DateInput className={style.timeSelectorInput}>
          {(segment) => (
            <DateSegment
              className={style.timeSelectorSegment}
              segment={segment}
            />
          )}
        </DateInput>
      </TimeField>
    </div>
  );
}
