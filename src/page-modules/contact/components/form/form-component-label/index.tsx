import { Typo } from '@atb/components/typography';
import style from './form-component-label.module.css';
import { andIf } from '@atb/utils/css';

type FormComponentLabelProps = {
  label: string;
  htmlFor: string;
  disabled?: boolean;
  isRequired?: boolean;
};

export const FormComponentLabel = ({
  label,
  htmlFor,
  disabled = false,
  isRequired = false,
}: FormComponentLabelProps) => {
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

export default FormComponentLabel;
