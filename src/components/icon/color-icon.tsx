import { useDarkMode } from '@atb/modules/theme';
import { ColorIcons, icons } from './generated-icons';
import { SizeProps, useSize } from './utils';

export type { SizeProps };

export type { ColorIcons } from './generated-icons';

export type ColorIconProps = Omit<React.JSX.IntrinsicElements['img'], 'src'> & {
  /**
   * Size for icon
   * @default normal
   */
  size?: SizeProps;
  /**
   * What icon to show
   */
  icon: ColorIcons;
};

export function ColorIcon({ icon, size = 'normal', ...props }: ColorIconProps) {
  const [isDarkMode] = useDarkMode();
  const wh = useSize(size);
  const currentIcon = icons['colorIcons'][icon];

  if (!currentIcon.darkable) {
    const totalPath = `/assets/${currentIcon.relative}`;
    // eslint-disable-next-line
    return <img width={wh} height={wh} src={totalPath} {...props} />;
  } else {
    const totalPath = `/assets/${specifyDarkOrLight(
      currentIcon.relative,
      isDarkMode,
    )}`;

    // eslint-disable-next-line
    return <img width={wh} height={wh} src={totalPath} {...props} />;
  }
}

function specifyDarkOrLight(src: string | undefined, isDarkMode: boolean) {
  const paths = src?.replace(/\/(dark|light)\//, '/').split('/') ?? [];
  const darkModeString = isDarkMode ? 'dark' : 'light';
  return [...paths.slice(0, -1), darkModeString, paths.slice(-1)].join('/');
}
