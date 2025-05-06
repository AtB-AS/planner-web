import { Typo } from '@atb/components/typography';
import style from './label.module.css';
import { andIf } from '@atb/utils/css';

type LabelProps = {
  label: string;
  disabled?: boolean;
  isRequired?: boolean;
};

export const Label = ({
  label,
  disabled = false,
  isRequired = false,
}: LabelProps) => {
  return (
    <label>
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
