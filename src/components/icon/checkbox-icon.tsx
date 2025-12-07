import { useTheme } from '@atb/modules/theme';
import { SizeProps, useSize } from './utils';
import CheckboxChecked from '@atb-as/generate-assets/files/common/colors/icons/input/CheckboxChecked.svg';
import CheckboxUnchecked from '@atb-as/generate-assets/files/common/colors/icons/input/CheckboxUnchecked.svg';
import { FC, SVGProps } from 'react';

export type CheckboxIconProps = Pick<
  React.JSX.IntrinsicElements['div'],
  'className' | 'role'
> & {
  /**
   * Size for icon
   * @default normal
   */
  size?: SizeProps;
  /**
   * Is the checkbox checked?
   */
  checked: boolean;
};
export function CheckBoxIcon({
  checked,
  size = 'normal',
  ...props
}: CheckboxIconProps) {
  const theme = useTheme();
  const wh = useSize('normal');

  const Icon: FC<SVGProps<SVGSVGElement>> = checked
    ? CheckboxChecked
    : CheckboxUnchecked;

  return (
    <Icon
      width={wh}
      height={wh}
      fill={theme.color.interactive[0].default.background}
    />
  );
}
