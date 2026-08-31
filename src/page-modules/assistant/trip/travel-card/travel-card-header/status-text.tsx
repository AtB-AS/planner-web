import { ColorIcon } from '@atb/components/icon';
import { Typo } from '@atb/components/typography';
import style from './status-text.module.css';

export type StatusType = 'error' | 'info' | 'interactive';

type Props = {
  statusType: StatusType;
  text: string;
  showIcon?: boolean;
};

export function StatusText({ statusType, text, showIcon = false }: Props) {
  return (
    <div className={style.container}>
      {showIcon && (
        <ColorIcon icon={statusTypeToColorIcon(statusType)} size="xSmall" />
      )}
      <Typo.span textType="body__s__strong" className={style[statusType]}>
        {text}
      </Typo.span>
    </div>
  );
}

function statusTypeToColorIcon(
  statusType: StatusType,
): 'status/Error' | 'status/Info' | 'status/Warning' {
  switch (statusType) {
    case 'error':
      return 'status/Error';
    case 'interactive':
      return 'status/Warning';
    default:
      return 'status/Info';
  }
}
