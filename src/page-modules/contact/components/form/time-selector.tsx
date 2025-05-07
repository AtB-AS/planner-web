import { ErrorMessage } from '@atb/components/error-message';
import style from './form.module.css';
import { TranslatedString, useTranslation } from '@atb/translations';
import { parseTime } from '@internationalized/date';
import { DateInput, DateSegment, TimeField } from 'react-aria-components';
import Label from './label';

export type TimeSelectorProps = {
  id: string;
  label: string;
  value?: string;
  isRequired?: boolean;
  errorMessage?: TranslatedString;
  onChange: (value: string) => void;
};
export default function TimeSelector({
  id,
  label,
  value,
  isRequired,
  errorMessage,
  onChange,
}: TimeSelectorProps) {
  const { t } = useTranslation();
  const parsedValue = value ? parseTime(value) : undefined;

  return (
    <div className={style.timeSelectorContainer}>
      <TimeField
        id={`time_selector__${id}`}
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
        <Label
          label={label}
          htmlFor={`time-selector-${id}`}
          isRequired={isRequired}
        />

        <DateInput className={style.timeSelectorInput}>
          {(segment) => (
            <DateSegment
              className={style.timeSelectorSegment}
              segment={segment}
            />
          )}
        </DateInput>
      </TimeField>
      <input id={`time_selector__${id}`} type="hidden" value={value ?? ''} />
      {errorMessage && <ErrorMessage message={t(errorMessage)} />}
    </div>
  );
}
