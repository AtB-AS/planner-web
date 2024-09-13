import style from './input.module.css';
import ErrorMessage from './error-message';

export type CheckboxProps = {
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  value: string;
};

export function Textarea({ onChange, error, value }: CheckboxProps) {
  return (
    <div>
      <textarea className={style.textarea} value={value} onChange={onChange} />
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
