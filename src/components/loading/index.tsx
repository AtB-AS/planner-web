import { ComponentText, useTranslation } from '@atb/translations';
import style from './loading.module.css';
import { ColorIcon, ColorIconProps } from '@atb/components/icon';

export type LoadingProps = {
  /**
   * Loading text string.
   * @example Loading tickets
   */
  text: string;
  testID?: string;
};
export function Loading({ text, testID }: LoadingProps) {
  const { t } = useTranslation();

  return (
    <div
      className={style.loading}
      role="status"
      aria-live="assertive"
      data-testid={testID}
    >
      <ColorIcon
        icon="status/Spinner"
        className={style.loading__icon}
        alt={t(ComponentText.Loading.alt)}
      />
      <p>{text}</p>
    </div>
  );
}

export function LoadingIcon({
  size,
  a11yText,
}: {
  size?: ColorIconProps['size'];
  a11yText?: string;
}) {
  const { t } = useTranslation();

  return (
    <ColorIcon
      icon="status/Spinner"
      size={size}
      role="status"
      className={style.loading__icon}
      alt={a11yText ?? t(ComponentText.Loading.alt)}
    />
  );
}
