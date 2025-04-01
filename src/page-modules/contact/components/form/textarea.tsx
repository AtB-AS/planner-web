import { ErrorMessage } from '@atb/components/error-message';
import style from './form.module.css';

export type CheckboxProps = {
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  value: string;
};

export default function Textarea({ onChange, error, value }: CheckboxProps) {
  return (
    <div>
      <textarea className={style.textarea} value={value} onChange={onChange} />
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
