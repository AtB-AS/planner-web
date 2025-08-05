import { ErrorMessage } from '@atb/components/error-message';
import style from './form.module.css';
import FileInput, { FileInputProps } from './file-input';
import { Typo } from '@atb/components/typography';
import { andIf } from '@atb/utils/css';

export type CheckboxProps = {
  description?: string;
  value: string;
  error?: string;
  isRequired?: boolean;
  fileInputProps?: FileInputProps;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
} & JSX.IntrinsicElements['textarea'];

export default function Textarea({
  id,
  description,
  onChange,
  error,
  isRequired = false,
  value,
  fileInputProps,
}: CheckboxProps) {
  return (
    <div className={style.textarea_container}>
      {description && (
        <Typo.p
          textType="body__primary"
          className={andIf({
            [style.required]: isRequired,
          })}
        >
          {description}
        </Typo.p>
      )}
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
