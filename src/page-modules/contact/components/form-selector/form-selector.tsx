import { TranslatedString } from '@atb/translations';
import { SectionCard } from '../section-card';
import { RadioInput } from '../input/radio';

export type FormSelectorOption = {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

type FormSelectorProps = {
  title: TranslatedString;
  options: FormSelectorOption[];
};

const FormSelector = ({ title, options }: FormSelectorProps) => {
  return (
    <SectionCard title={title}>
      <ul>
        {options.map((option, idx) => (
          <RadioInput
            key={idx}
            label={option.label}
            checked={option.checked}
            onChange={(event) => option.onChange(event)}
          />
        ))}
      </ul>
    </SectionCard>
  );
};

export default FormSelector;
