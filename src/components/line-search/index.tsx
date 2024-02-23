import { ChangeEvent } from 'react';
import style from './line-search.module.css';

type LineSearchProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function LineSearch({
  label,
  placeholder,
  value,
  onChange,
}: LineSearchProps) {
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
