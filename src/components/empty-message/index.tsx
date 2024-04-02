import { Image } from '@atb/components/icon';
import { Typo } from '@atb/components/typography';
import style from './empty-message.module.css';

export type EmptyMessageProps = {
  title: string;
  details: string;
};

export default function EmptyMessage({ title, details }: EmptyMessageProps) {
  return (
    <div className={style.container}>
      <div>
        <Image image="EmptyIllustration" alt="" className={style.emptyImage} />
      </div>
      <div className={style.text} role='status'>
        <Typo.h3 textType="body__primary--bold">{title}</Typo.h3>
        <Typo.span textType="body__secondary">{details}</Typo.span>
      </div>
    </div>
  );
}
