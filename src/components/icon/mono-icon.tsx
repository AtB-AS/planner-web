import { TextColorType } from '@atb-as/theme';
import { MonoIcons, icons } from './generated-icons';
import { SizeProps, useSize } from './utils';
import { useDarkMode } from '@atb/modules/theme';

export type { SizeProps };
export type MonoIconProps = Omit<JSX.IntrinsicElements['img'], 'src'> & {
  /**
   * Size for icon
   * @default normal
   */
  size?: SizeProps;
  /**
   * What icon to show
   */
  icon: MonoIcons;
  /**
   * Whether or not to override darkmode/light mode
   * @default none
   */
  overrideMode?: 'none' | 'dark' | 'light';
};

export function MonoIcon({
  icon,
  size = 'normal',
  overrideMode = 'none',
  ...props
}: MonoIconProps) {
  const [isDarkMode] = useDarkMode();
  const currentIcon = icons['mono'][icon];
  const darkModeString =
    colorToMode(overrideMode) ?? (isDarkMode ? 'dark' : 'light');
  const totalPath = `/assets/${insertMode(
    currentIcon.relative,
    darkModeString,
  )}`;
  const wh = useSize(size);

  return (
    // eslint-disable-next-line
    <img src={totalPath} width={wh} height={wh} role="none" alt="" {...props} />
  );
}

export default MonoIcon;

function insertMode(relative: string, mode: TextColorType) {
  return relative.replace('mono/', `mono/${mode}/`);
}

function colorToMode(
  color: MonoIconProps['overrideMode'],
): TextColorType | undefined {
  if (color == 'none') return undefined;
  return color == 'dark' ? 'dark' : 'light';
}
