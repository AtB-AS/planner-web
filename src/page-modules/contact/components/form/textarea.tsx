import { ErrorMessage } from '@atb/components/error-message';
import style from './form.module.css';
import FileInput, { FileInputProps } from './file-input';
import { Typo } from '@atb/components/typography';

export type CheckboxProps = {
  description?: string;
  value: string;
  error?: string;
  fileInputProps?: FileInputProps;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
} & JSX.IntrinsicElements['textarea'];

export default function Textarea({
  id,
  description,
  onChange,
  error,
  value,
  fileInputProps,
}: CheckboxProps) {
  return (
    <div className={style.textarea_container}>
      {description && <Typo.p textType="body__primary">{description}</Typo.p>}
      <textarea
        id={`textarea__${id}`}
        className={style.textarea}
        value={value}
        onChange={onChange}
      />
      {fileInputProps && <FileInput {...fileInputProps} />}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
