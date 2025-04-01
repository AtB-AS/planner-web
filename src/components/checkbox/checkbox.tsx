import { andIf } from '@atb/utils/css';
import style from './checkbox.module.css';
import { useId } from 'react';
import { ColorIcon } from '@atb/components/icon';
import { ErrorMessage } from '../error-message';

export type CheckboxProps = {
  onChange: (checked: boolean) => void;
  error?: string;
  disabled?: boolean;
  readonly?: boolean;
  label: string;
  description?: string;
  checked?: boolean;
  transparent?: boolean;
  onClick?: () => void;
};

export default function Checkbox({
  onChange,
  error,
  disabled = false,
  readonly = false,
  label,
  description,
  checked = false,
  transparent = false,
  onClick,
}: CheckboxProps) {
  const id = useId();

  const className = andIf({
    [style.checkbox]: true,
    [style['checkbox--error']]: !!error,
    [style['checkbox--disabled']]: disabled,
    [style['checkbox--readonly']]: readonly,
    [style['checkbox--transparent']]: transparent,
  });

  const icon = checked ? 'input/CheckboxChecked' : 'input/CheckboxUnchecked';

  return (
    <label htmlFor={`checkbox-${id}`} className={className}>
      <span className={style.checkbox__content}>
        <input
          type="checkbox"
          id={`checkbox-${id}`}
          readOnly={readonly}
          onChange={(e) => onChange(e.target.checked)}
          className={style.checkbox__checkbox}
          checked={checked}
          aria-invalid={!!error}
          onClick={onClick}
        />
        <ColorIcon icon={icon} className={style.checkbox__icon} role="none" />
        <dl>
          <dt className={style.checkbox__label}>{label}</dt>
          <dd className={style.checkbox__description}>{description}</dd>
        </dl>
      </span>
      {!!error && <ErrorMessage message={error} />}
    </label>
  );
}
