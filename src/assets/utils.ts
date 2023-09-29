import { useTheme } from '@atb/modules/theme';

export type SizeProps = 'small' | 'normal' | 'large' | 'x-large';

export function useSize(size: SizeProps) {
  const theme = useTheme();

  switch (size) {
    case 'small':
      return theme.icon.size.small;
    case 'normal':
      return theme.icon.size.normal;
    case 'large':
      return theme.icon.size.large;
    case 'x-large':
      // @TODO This should in the design system at some point
      return 40;
  }
}
