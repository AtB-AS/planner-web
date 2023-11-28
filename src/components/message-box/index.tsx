import { useTranslation } from '@atb/translations';
import { Theme } from '@atb-as/theme';
import { useTheme } from '@atb/modules/theme';
import { andIf } from '@atb/utils/css';
import { MonoIcon } from '@atb/components/icon';
import { messageTypeToMonoIcon } from '@atb/modules/situations';
import { Button } from '@atb/components/button';
import dictionary from '@atb/translations/dictionary';
import { Typo } from '@atb/components/typography';

import style from './message-box.module.css';

export type MessageBoxProps = {
  type: keyof Theme['static']['status'];
  title?: string;
  message: string;
  noStatusIcon?: boolean;
  onClick?: () => void;
  borderRadius?: boolean;
};

export const MessageBox = ({
  noStatusIcon,
  type,
  message,
  title,
  onClick,
  borderRadius = true,
}: MessageBoxProps) => {
  const { static: staticColors } = useTheme();
  const { t } = useTranslation();
  const backgroundColorStyle = {
    backgroundColor: staticColors['status'][type].background,
    color: staticColors['status'][type].text,
  };

  return (
    <div
      className={andIf({
        [style.container]: true,
        [style.borderRadius]: borderRadius,
      })}
      style={backgroundColorStyle}
    >
      {!noStatusIcon && (
        <MonoIcon className={style.icon} icon={messageTypeToMonoIcon(type)} />
      )}
      <div className={style.content}>
        {title && (
          <Typo.h2 className={style.title} textType="body__primary--bold">
            {title}
          </Typo.h2>
        )}
        <Typo.p className={style.body} textType="body__primary">
          {message}
        </Typo.p>
        {onClick && (
          <Button
            mode="transparent--underline"
            onClick={() => onClick()}
            title={t(dictionary.readMore)}
            className={style.messageBox__button}
            size="compact"
          />
        )}
      </div>
    </div>
  );
};
