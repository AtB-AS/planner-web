import { ChangeEvent, DragEvent, useId, useState } from 'react';
import style from './input.module.css';
import { Typo } from '@atb/components/typography';
import { Button } from '@atb/components/button';
import { MonoIcon } from '@atb/components/icon';

export type FileInputProps = {
  label: string;
  onChange?: (files: File[]) => void;
} & Omit<JSX.IntrinsicElements['input'], 'onChange'>;

export function FileInput({ onChange, label, name }: FileInputProps) {
  const id = useId();
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFilesArray = Array.from(event.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFilesArray]);
      if (onChange) {
        onChange([...files, ...newFilesArray]);
      }
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    if (onChange) {
      onChange(updatedFiles);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (event.dataTransfer.files) {
      const droppedFiles = Array.from(event.dataTransfer.files);
      setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
      if (onChange) {
        onChange([...files, ...droppedFiles]);
      }
    }
  };

  return (
    <div onDrop={handleDrop}>
      <input
        id={id}
        type="file"
        onChange={handleFileChange}
        name={name}
        className={style.input__file}
        multiple
        accept="image/*,.pdf,.doc,docx,.txt"
        capture="environment"
      />

      <label htmlFor={id} className={style.label__file}>
        <FileIcon />
        <Typo.span textType="body__primary">{label}</Typo.span>
      </label>

      {files.length > 0 && (
        <div className={style.fileList}>
          {files.map((file, index) => (
            <div key={index} className={style.fileItem}>
              <Button
                size="compact"
                icon={{
                  left: <MonoIcon size="small" icon="actions/Delete" />,
                }}
                onClick={() => handleRemoveFile(index)}
              />
              <Typo.span textType="body__secondary">{file.name}</Typo.span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FileIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.6222 9.08056L10.1092 16.5936C8.40066 18.3021 5.63057 18.3021 3.92203 16.5936C2.21349 14.885 2.21349 12.1149 3.92203 10.4063L11.4351 2.89333C12.5741 1.75431 14.4208 1.75431 15.5598 2.89333C16.6988 4.03236 16.6988 5.8791 15.5598 7.01812L8.34149 14.2365C7.77193 14.8061 6.84856 14.8061 6.27906 14.2365C5.70954 13.667 5.70954 12.7436 6.27906 12.1741L12.6136 5.83961"
        stroke="black"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}