import { InteractiveColor, Theme } from '@atb-as/theme';
import { TextColorType } from '@atb-as/theme';
import { colorToOverrideColor } from '@atb/utils/color';
import { ImageProps } from 'next/image';
import { SizeProps, useSize } from './utils';
import { useDarkMode, useTheme } from '@atb/modules/theme';

export type { SizeProps };
export type MonoIconProps = Omit<ImageProps, 'alt'> & {
  alt?: string;
  size?: SizeProps;
  overrideColor?: 'white' | 'black';
  /**
   * Used to override light- or dark mode icon color when MonoIcon is used with an interactive component
   */
  interactiveColor?: keyof Theme['interactive'];
  interactiveState?: keyof InteractiveColor;
};

export function MonoIcon({
  src,
  size = 'normal',
  overrideColor,
  alt = '',
  interactiveColor,
  interactiveState,
  ...props
}: MonoIconProps) {
  const [isDarkMode] = useDarkMode();
  const interactiveOverrideColor = useInteractiveThemeColor(
    interactiveColor,
    interactiveState,
  );
  const darkModeString =
    colorToMode(overrideColor) ??
    colorToMode(interactiveOverrideColor) ??
    (isDarkMode ? 'dark' : 'light');
  const totalPath = `/assets/mono/${darkModeString}/${src}`;
  const wh = useSize(size);
  return (
    // eslint-disable-next-line
    <img
      src={totalPath}
      width={wh}
      height={wh}
      role="none"
      alt={alt}
      {...props}
    />
  );
}

function colorToMode(
  color?: MonoIconProps['overrideColor'],
): TextColorType | undefined {
  if (!color) return undefined;
  return color == 'black' ? 'light' : 'dark';
}

function useInteractiveThemeColor(
  interactiveColorName?: keyof Theme['interactive'],
  interactiveState?: keyof InteractiveColor,
): MonoIconProps['overrideColor'] | undefined {
  const { interactive } = useTheme();
  if (!interactiveColorName) return undefined;
  const interactiveColor = interactive[interactiveColorName];

  if (!interactiveState)
    return colorToOverrideColor(interactiveColor.default.text);

  return colorToOverrideColor(interactiveColor[interactiveState].text);
}
