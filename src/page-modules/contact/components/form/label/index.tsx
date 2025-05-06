import { Typo } from '@atb/components/typography';
import style from './label.module.css';
import { andIf } from '@atb/utils/css';

type LabelProps = {
  label: string;
  htmlFor: string;
  disabled?: boolean;
  isRequired?: boolean;
};

export const Label = ({
  label,
  htmlFor,
  disabled = false,
  isRequired = false,
}: LabelProps) => {
  return (
    <label htmlFor={htmlFor}>
      <Typo.span
        textType="body__primary"
        className={andIf({
          [style.disabled]: disabled,
          [style.required]: isRequired,
        })}
      >
        {label}
      </Typo.span>
    </label>
  );
};

export default Label;
