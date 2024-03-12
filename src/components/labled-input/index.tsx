import { andIf } from '@atb/utils/css';
import { ChangeEvent } from 'react';
import { MessageBox } from '@atb/components/message-box';
import style from './labled-input.module.css';

export type LabeledInputProps = {
  label: string;
  placeholder: string;
  value: string;
  validation?: {
    message: string;
    status: 'error' | 'warning';
  };
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
} & JSX.IntrinsicElements['input'];

export default function LabeledInput({
  label,
  placeholder,
  value,
  onChange,
  ...props
}: LabeledInputProps) {
  const status = props.validation?.status;

  return (
    <div
      className={andIf({
        [style.container]: true,
        [style['container--error']]: status === 'error',
        [style['container--warning']]: status === 'warning',
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
      />

      {props.validation && (
        <MessageBox
          message={props.validation.message}
          type={status!}
          borderRadius={false}
        />
      )}
    </div>
  );
}
