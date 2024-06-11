import { useTranslation } from '@atb/translations';
import { Theme } from '@atb-as/theme';
import { useTheme } from '@atb/modules/theme';
import { andIf } from '@atb/utils/css';
import { MonoIcon, MonoIconProps } from '@atb/components/icon';
import { messageTypeToMonoIcon } from '@atb/modules/situations';
import { Button } from '@atb/components/button';
import dictionary from '@atb/translations/dictionary';
import { Typo } from '@atb/components/typography';

import style from './message-box.module.css';
import { colorToOverrideMode } from '@atb/utils/color';
import { screenReaderPause } from '@atb/components/typography/utils';

export type MessageMode = keyof Theme['static']['status'];

export type MessageBoxProps = {
  type: MessageMode;
  title?: string;
  textId?: string;
  message: string;
  noStatusIcon?: boolean;
  onClick?: () => void;
  borderRadius?: boolean;
};

export const MessageBox = ({
  noStatusIcon,
  type,
  message,
  textId,
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
  const overrideMode = useStatusThemeColor(type);
  const aria = modeToAria(type);

  if (message === '') return null;

  return (
    <div
      className={andIf({
        [style.container]: true,
        [style.borderRadius]: borderRadius,
      })}
      style={backgroundColorStyle}
    >
      {!noStatusIcon && (
        <MonoIcon
          className={style.icon}
          icon={messageTypeToMonoIcon(type)}
          overrideMode={overrideMode}
        />
      )}
      <div className={style.content}>
        {title && (
          <Typo.h2 className={style.title} textType="body__primary--bold">
            {title}
          </Typo.h2>
        )}
        <Typo.p
          className={style.body}
          textType="body__primary"
          id={textId}
          {...aria}
        >
          {message}
        </Typo.p>
        {onClick && (
          <Button
            mode="transparent--underline"
            onClick={() => onClick()}
            title={t(dictionary.readMore)}
            className={style.messageBox__button}
            size="compact"
            buttonProps={{
              'aria-label': `${message}${screenReaderPause}${t(
                dictionary.readMore,
              )}`,
            }}
          />
        )}
      </div>
    </div>
  );
};

function useStatusThemeColor(mode: MessageMode): MonoIconProps['overrideMode'] {
  const {
    static: { status },
  } = useTheme();

  let overrideColor: MonoIconProps['overrideMode'] = undefined;

  switch (mode) {
    case 'error':
      overrideColor = colorToOverrideMode(status.error.text);
      break;
    case 'valid':
      overrideColor = colorToOverrideMode(status.valid.text);
      break;
    case 'warning':
      overrideColor = colorToOverrideMode(status.warning.text);
      break;
    case 'info':
      overrideColor = colorToOverrideMode(status.info.text);
      break;
  }

  return overrideColor;
}

function modeToAria(mode: MessageMode): JSX.IntrinsicElements['div'] {
  switch (mode) {
    case 'error':
      return { role: 'alert' };
    case 'valid':
      return { 'aria-live': 'polite' };
    case 'warning':
      return { 'aria-live': 'polite' };
    case 'info':
      return { role: 'status' };
  }
}
