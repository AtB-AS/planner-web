import { ChangeEvent } from 'react';
import style from './labled-input.module.css';

type LabeledInput = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function LabeledInput({
  label,
  placeholder,
  value,
  onChange,
}: LabeledInput) {
  return (
    <div className={style.container}>
      <label className={style.label}>{label}</label>
      <input
        className={style.input}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
