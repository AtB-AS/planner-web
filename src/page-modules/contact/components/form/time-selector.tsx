import style from './form.module.css';
import { TranslatedString, useTranslation } from '@atb/translations';
import { parseTime } from '@internationalized/date';
import ErrorMessage from './error-message';
import {
  DateInput,
  DateSegment,
  Label,
  TimeField,
} from 'react-aria-components';

export type TimeSelectorProps = {
  label: TranslatedString;
  value?: string;
  errorMessage?: TranslatedString;
  onChange: (value: string) => void;
};
export default function TimeSelector({
  label,
  value,
  errorMessage,
  onChange,
}: TimeSelectorProps) {
  const { t } = useTranslation();
  const parsedValue = value ? parseTime(value) : undefined;

  return (
    <div className={style.timeSelectorContainer}>
      <Label>{t(label)}</Label>
      <TimeField
        value={parsedValue}
        onChange={(change) => {
          if (!change) return;
          onChange(change.toString());
        }}
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
      {errorMessage && <ErrorMessage message={t(errorMessage)} />}
    </div>
  );
}
