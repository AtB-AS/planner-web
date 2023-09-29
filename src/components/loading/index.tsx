import {ColorIcon, ColorIconProps} from '@atb/assets/color-icon';
import {ComponentText, useTranslation} from '@atb/translations';
import style from './loading.module.css';

export type LoadingProps = {
  /**
   * Loading text string.
   * @example Loading tickets
   */
  text: string;
  testID?: string;
};
export function Loading({text, testID}: LoadingProps) {
  const {t} = useTranslation();

  return (
    <div
      className={style.loading}
      role="alert"
      aria-live="assertive"
      data-testid={testID}
    >
      <ColorIcon
        src="/status/Spinner.svg"
        className={style.loading__icon}
        alt={t(ComponentText.Loading.alt)}
        darkable
      />
      <p>{text}</p>
    </div>
  );
}

export function LoadingIcon({size}: {size?: ColorIconProps['size']}) {
  const {t} = useTranslation();

  return (
    <ColorIcon
      src="/status/Spinner.svg"
      size={size}
      className={style.loading__icon}
      alt={t(ComponentText.Loading.alt)}
      darkable
    />
  );
}
