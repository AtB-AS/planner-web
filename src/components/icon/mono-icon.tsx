import { InteractiveColor, TextColorType, Theme } from '@atb-as/theme';
import { MonoIcons, icons } from './generated-icons';
import { SizeProps, useSize } from './utils';
import { useDarkMode, useTheme } from '@atb/modules/theme';
import { colorToOverrideMode } from '@atb/utils/color';

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
  /**
   * Used to override light- or dark mode icon color when MonoIcon is used with an interactive component
   */
  interactiveColor?: keyof Theme['interactive'];
  interactiveState?: keyof InteractiveColor;
};

export function MonoIcon({
  icon,
  size = 'normal',
  overrideMode = 'none',
  interactiveColor,
  interactiveState,
  ...props
}: MonoIconProps) {
  const [isDarkMode] = useDarkMode();
  const currentIcon = icons['mono'][icon];
  const interactiveOverrideColor = useInteractiveThemeColor(
    interactiveColor,
    interactiveState,
  );
  const darkModeString =
    colorToMode(overrideMode) ??
    colorToMode(interactiveOverrideColor) ??
    (isDarkMode ? 'dark' : 'light');
  const totalPath = `/assets/${insertMode(
    currentIcon.relative,
    darkModeString,
  )}`;
  const wh = useSize(size);

  return (
    // eslint-disable-next-line
    <img src={totalPath} width={undefined} height={wh} role="none" alt="" {...props} />
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

function useInteractiveThemeColor(
  interactiveColorName?: keyof Theme['interactive'],
  interactiveState?: keyof InteractiveColor,
): MonoIconProps['overrideMode'] {
  const { interactive } = useTheme();
  if (!interactiveColorName) return 'none';
  const interactiveColor = interactive[interactiveColorName];

  if (!interactiveState)
    return colorToOverrideMode(interactiveColor.default.text);

  return colorToOverrideMode(interactiveColor[interactiveState].text);
}
