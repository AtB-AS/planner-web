import { ErrorMessage } from '@atb/components/error-message';
import style from './form.module.css';

export type CheckboxProps = {
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  value: string;
} & JSX.IntrinsicElements['textarea'];

export default function Textarea({
  id,
  onChange,
  error,
  value,
}: CheckboxProps) {
  return (
    <>
      <textarea
        id={`textarea__${id}`}
        className={style.textarea}
        value={value}
        onChange={onChange}
      />
      {error && <ErrorMessage message={error} />}
    </>
  );
}
