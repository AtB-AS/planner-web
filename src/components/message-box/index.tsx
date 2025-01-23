import { useTranslation } from '@atb/translations';
import { StatusColorName, useTheme } from '@atb/modules/theme';
import { andIf } from '@atb/utils/css';
import { MonoIcon, MonoIconProps } from '@atb/components/icon';
import { messageTypeToMonoIcon } from '@atb/modules/situations';
import { Button } from '@atb/components/button';
import dictionary from '@atb/translations/dictionary';
import { Typo } from '@atb/components/typography';

import style from './message-box.module.css';
import { colorToOverrideMode } from '@atb/utils/color';
import { screenReaderPause } from '@atb/components/typography/utils';
import { HTMLAttributes } from 'react';

export type MessageMode = StatusColorName;

export type MessageBoxProps = {
  type: MessageMode;
  title?: string;
  textId?: string;
  message: string;
  noStatusIcon?: boolean;
  onClick?: () => void;
  onDismiss?: () => void;
  borderRadius?: boolean;
  subtle?: boolean;
};

export const MessageBox = ({
  noStatusIcon,
  type,
  message,
  textId,
  title,
  onClick,
  onDismiss,
  borderRadius = true,
  subtle = false
}: MessageBoxProps) => {
  const { color: {status} } = useTheme();
  const { t } = useTranslation();
  const backgroundColorStyle: HTMLAttributes<HTMLDivElement>['style'] = {
    borderColor: subtle ? undefined : status[type].primary.background,
    backgroundColor: subtle ? undefined : status[type].secondary.background,
    color: status[type].secondary.foreground.primary,
  };
  const overrideMode = useStatusThemeColor(type);
  const aria = modeToAria(type);

  if (message === '') return null;

  return (
    <div
      className={andIf({
        [style.container]: true,
        [style.borderRadius]: borderRadius,
        [style.subtle]: subtle
      })}
      style={backgroundColorStyle}
    >
      {!noStatusIcon && (
        <MonoIcon
          icon={messageTypeToMonoIcon(type)}
          overrideMode={overrideMode}
        />
      )}
      <div className={style.content}>
        {title && <Typo.h2 textType="body__primary--bold">{title}</Typo.h2>}
        <Typo.p textType="body__primary" id={textId} {...aria}>
          {message}
        </Typo.p>
        {onClick && (
          <Button
            mode="transparent--underline"
            onClick={() => onClick()}
            title={t(dictionary.readMore)}
            size="compact"
            buttonProps={{
              'aria-label': `${message}${screenReaderPause}${t(
                dictionary.readMore,
              )}`,
            }}
          />
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={style.message__close}
        >
          <MonoIcon
            icon="actions/Close"
            aria-label={t(dictionary.close)}
            overrideMode={overrideMode}
          />
        </button>
      )}
    </div>
  );
};

function useStatusThemeColor(mode: MessageMode): MonoIconProps['overrideMode'] {
  const { color: {status} } = useTheme();

  let overrideColor: MonoIconProps['overrideMode'] = undefined;

  switch (mode) {
    case 'error':
      overrideColor = colorToOverrideMode(status.error.secondary.foreground.primary);
      break;
    case 'valid':
      overrideColor = colorToOverrideMode(status.valid.secondary.foreground.primary);
      break;
    case 'warning':
      overrideColor = colorToOverrideMode(status.warning.secondary.foreground.primary);
      break;
    case 'info':
      overrideColor = colorToOverrideMode(status.info.secondary.foreground.primary);
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
