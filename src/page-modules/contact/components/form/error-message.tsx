import { Typo } from '@atb/components/typography';
import { ColorIcon } from '@atb/components/icon';
import style from './form.module.css';

export type ErrorMessageProps = {
  message: string;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div role="alert" className={style.errorMessage}>
      <ColorIcon icon="status/Error" />
      <Typo.span textType="body__secondary">{message}</Typo.span>
    </div>
  );
}
