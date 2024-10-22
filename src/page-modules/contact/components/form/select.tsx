import { useId } from 'react';
import ErrorMessage from './error-message';
import { Typo } from '@atb/components/typography';

import style from './form.module.css';

export type SelectProps<T> = {
  label: string;
  onChange: (value?: T) => void;
  error?: string;
  value?: T;
  options: T[];
  valueToId: (val: T) => string;
  valueToText: (val: T) => string;
  placeholder?: string;
  disabled?: boolean;
};

export default function Select<T>({
  label,
  onChange,
  error,
  value,
  options,
  valueToId,
  valueToText,
  placeholder,
  disabled,
}: SelectProps<T>) {
  const id = useId();
  const showError = !!error;

  const findItemFromOptions = (id: string) =>
    options.find((opt) => valueToId(opt) == id);

  const onChangeInternal = (val: string) => {
    onChange(findItemFromOptions(val));
  };

  return (
    <div className={style.select}>
      <label>
        <Typo.span textType="body__primary">{label}</Typo.span>
      </label>
      <select
        id={`select-${id}`}
        onChange={(e) => onChangeInternal(e.target.value)}
        value={value ? valueToId(value) : placeholder}
        className={style.select__select}
        disabled={disabled}
      >
        {placeholder && (
          <option value={placeholder} disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={valueToId(option)} value={valueToId(option)}>
            {valueToText(option)}
          </option>
        ))}
      </select>
      {showError && <ErrorMessage message={error} />}
    </div>
  );
}
