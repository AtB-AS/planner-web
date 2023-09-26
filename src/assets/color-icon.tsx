import { SizeProps, useSize } from './utils';
import { useDarkMode } from '@atb/modules/theme';

export type { SizeProps };

export type ColorIconProps = JSX.IntrinsicElements['img'] & {
  size?: SizeProps;
  darkable?: boolean;
};

export function ColorIcon({
  src,
  size = 'normal',
  darkable = false,
  ...props
}: ColorIconProps) {
  const [isDarkMode] = useDarkMode();
  const wh = useSize(size);

  if (!darkable) {
    const totalPath = `/assets/colors/icons/${src}`;
    // eslint-disable-next-line
    return <img width={wh} height={wh} src={totalPath} {...props} />;
  } else {
    const totalPath = `/assets/colors/icons/${specifyDarkOrLight(
      src,
      isDarkMode,
    )}`;

    // eslint-disable-next-line
    return <img width={wh} height={wh} src={totalPath} {...props} />;
  }
}

function specifyDarkOrLight(src: string | undefined, isDarkMode: boolean) {
  const paths = src?.split('/') ?? [];
  const darkModeString = isDarkMode ? 'dark' : 'light';
  return [...paths.slice(0, -1), darkModeString, paths.slice(-1)].join('/');
}
