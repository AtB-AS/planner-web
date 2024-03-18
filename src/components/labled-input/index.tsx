import { MessageBox } from '@atb/components/message-box';
import { andIf } from '@atb/utils/css';
import { ChangeEvent, useId } from 'react';
import style from './labled-input.module.css';

export type LabeledInputProps = {
  label: string;
  placeholder: string;
  value: string;
  validationError?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
} & JSX.IntrinsicElements['input'];

export default function LabeledInput({
  label,
  placeholder,
  value,
  onChange,
  validationError,
  ...props
}: LabeledInputProps) {
  const isError = typeof validationError !== 'undefined';
  const prefix = useId();

  const errorLabel = prefix + 'Error';

  const validationStatusProps: JSX.IntrinsicElements['input'] = isError
    ? { 'aria-invalid': 'true', 'aria-describedby': errorLabel }
    : {};
  return (
    <div
      className={andIf({
        [style.container]: true,
        [style['container--error']]: isError,
      })}
    >
      <label className={style.label}>{label}</label>
      <input
        className={style.input}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
        {...validationStatusProps}
      />

      {isError && (
        <MessageBox
          textId={errorLabel}
          message={validationError}
          type="error"
          borderRadius={false}
        />
      )}
    </div>
  );
}
