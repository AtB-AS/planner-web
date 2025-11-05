import { Typo } from '@atb/components/typography';
import { ColorIcon } from '@atb/components/icon';
import style from './error-message.module.css';

export type ErrorMessageProps = {
  message: string;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div role="alert" className={style.errorMessage}>
      <ColorIcon icon="status/Error" />
      <Typo.span textType="body__s">{message}</Typo.span>
    </div>
  );
}
