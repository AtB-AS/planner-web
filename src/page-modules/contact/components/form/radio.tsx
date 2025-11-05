import { ChangeEvent, useId } from 'react';
import style from './form.module.css';
import { Typo } from '@atb/components/typography';

export type RadioInputProps = {
  label: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
} & React.JSX.IntrinsicElements['input'];

export default function Radio({
  onChange,
  checked,
  label,
  value,
  name,
}: RadioInputProps) {
  const id = useId();
  return (
    <div>
      <input
        id={id}
        type="radio"
        onChange={onChange}
        value={value}
        checked={checked}
        name={name}
        className={style.input__radio}
      />

      <label htmlFor={id} className={style.label__radio}>
        <span className={style.label__radioBox}></span>
        <Typo.span textType="body__m">{label}</Typo.span>
      </label>
    </div>
  );
}
