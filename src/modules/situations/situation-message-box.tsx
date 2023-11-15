import { Theme } from '@atb-as/theme';
import {
  getMessageTypeForSituation,
  getSituationSummary,
  messageTypeToColorIcon,
  messageTypeToMonoIcon,
  validateEndTime,
} from './utils';
import { ColorIcon, MonoIcon } from '@atb/components/icon';
import { Typo } from '@atb/components/typography';
import { Situation } from './types';
import { useTranslation, getTextForLanguage } from '@atb/translations';
import { useTheme } from '@atb/modules/theme';
import style from './situation.module.css';
import { Button } from '@atb/components/button';
import { useRef } from 'react';
import dictionary from '@atb/translations/dictionary';
import { Situation as SituationTexts } from '@atb/translations/modules';
import { formatToLongDateTime } from '@atb/utils/date';
export type Props = {
  situation: Situation;
  noStatusIcon?: MessageBoxProps['noStatusIcon'];
};

export const SituationMessageBox = ({ situation, noStatusIcon }: Props) => {
  const { language, t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const messageType = getMessageTypeForSituation(situation);
  const text = getSituationSummary(situation, language);
  const validityPeriodText = useValidityPeriodText(situation.validityPeriod);

  if (!text) return null;

  return (
    <>
      <dialog ref={dialogRef} className={style.dialog}>
        <div className={style.dialog__wrapper}>
          <div className={style.dialog__content}>
            <div className={style.dialog__title}>
              <ColorIcon
                className={style.icon}
                icon={messageTypeToColorIcon(messageType)}
              />
              {situation.summary && (
                <Typo.h2 textType="body__primary--bold">
                  {getTextForLanguage(situation.summary, language)}
                </Typo.h2>
              )}
            </div>

            <Typo.p textType="body__primary">
              {getTextForLanguage(situation.description, language)}
            </Typo.p>

            {validityPeriodText && (
              <div className={style.dialog__validity}>
                <MonoIcon className={style.icon} icon="time/Time" />
                <Typo.p
                  className={style.secondaryTextColor}
                  textType="body__secondary"
                >
                  {validityPeriodText}
                </Typo.p>
              </div>
            )}
          </div>
          <Button
            buttonProps={{ formMethod: 'dialog' }}
            title={t(dictionary.close)}
            mode="interactive_0"
            className={style.dialog__button}
            onClick={() => dialogRef.current?.close()}
          />
        </div>
      </dialog>
      <MessageBox
        type={messageType}
        noStatusIcon={noStatusIcon}
        message={text}
        onClick={() => dialogRef.current?.showModal()}
      />
    </>
  );
};

export type MessageBoxProps = {
  type: keyof Theme['static']['status'];
  title?: string;
  message: string;
  noStatusIcon?: boolean;
  onClick?: () => void;
};

export const MessageBox = ({
  noStatusIcon,
  type,
  message,
  title,
  onClick,
}: MessageBoxProps) => {
  const { static: staticColors } = useTheme();
  const { t } = useTranslation();
  const backgroundColorStyle = {
    backgroundColor: staticColors['status'][type].background,
  };

  return (
    <div className={style.container} style={backgroundColorStyle}>
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

export const useValidityPeriodText = (period?: Situation['validityPeriod']) => {
  const { t, language } = useTranslation();

  const endTime = period?.endTime && validateEndTime(period.endTime);
  if (period?.startTime && endTime) {
    return t(
      SituationTexts.validity.fromAndTo(
        formatToLongDateTime(period.startTime, language),
        formatToLongDateTime(endTime, language),
      ),
    );
  }
  if (period?.startTime) {
    return t(
      SituationTexts.validity.from(
        formatToLongDateTime(period.startTime, language),
      ),
    );
  }
  if (endTime) {
    return t(
      SituationTexts.validity.to(formatToLongDateTime(endTime, language)),
    );
  }

  return undefined;
};
