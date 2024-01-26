import { useTheme, theme } from '@atb/modules/theme';

export type SizeProps = keyof typeof theme.light.icon.size;

export function useSize(size: SizeProps) {
  const theme = useTheme();

  switch (size) {
    case 'xSmall':
      return theme.icon.size.xSmall;
    case 'small':
      return theme.icon.size.small;
    case 'normal':
      return theme.icon.size.normal;
    case 'large':
      return theme.icon.size.large;
  }
}
