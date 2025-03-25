import React, { ReactNode } from 'react';
import { and } from '@atb/utils/css';
import style from './button.module.css';
import { LoadingIcon } from '../loading';

export type ButtonModes =
  | 'interactive_0'
  | 'interactive_0--bordered'
  | 'interactive_0--bordered-light-outline'
  | 'interactive_1'
  | 'interactive_2'
  | 'interactive_2--light-outline'
  | 'interactive_3'
  | 'destructive'
  | 'transparent'
  | 'transparent--underline';

export type RadiusMode = 'top' | 'bottom' | 'top-bottom' | 'none';

export type ButtonBaseProps = {
  /**
   * Button text content
   */
  title?: string;

  /**
   * Button mode
   * @default interactive_2
   */
  mode?: ButtonModes;

  /**
   * If button is disabled or not
   * @default false
   */
  disabled?: boolean;

  /**
   * Button padding size
   * @default 'small'
   */
  size?: 'medium' | 'small' | 'pill' | 'compact';

  /**
   * Set button state
   * @default 'none'
   */
  state?: 'none' | 'active' | 'loading';

  /**
   * Set where to have border radius on button
   * @default 'top-bottom'
   */
  radius?: RadiusMode;

  /**
   * Radius of border
   * @default 'regular'
   */
  radiusSize?: 'regular' | 'circular';

  /**
   * Whether the button is inline or block.
   * @default 'block'
   */
  display?: 'block' | 'inline';
  className?: string;
  testID?: string;

  /**
   * Specify icon to right, left, or both.
   * @see MonoIcon,
   * @default undefined
   */
  icon?: Partial<{
    left: ReactNode;
    right: ReactNode;
  }>;
};

export function getBaseButtonClassName({
  mode = 'interactive_2',
  size = 'small',
  state = 'none',
  radius = 'top-bottom',
  radiusSize = 'regular',
  display = 'block',
  disabled = false,
  className = undefined,
}: ButtonBaseProps) {
  const innerClassName = and(
    style.button,
    style[`button--${mode}`],
    disabled && style[`button--disabled`],
    style[`button--size_${size}`],
    style[`button--state_${state}`],
    style[`button--radius_${radius}`],
    style[`button--radius_${radius}`],
    style[`button--display_${display}`],
    style[`button--radiusSize_${radiusSize}`],
    className,
  );
  return innerClassName;
}

function ButtonBase({ title, icon, state }: ButtonBaseProps) {
  const loadingIcon = state == 'loading' ? <LoadingIcon /> : null;
  const hasLeftIcon = Boolean(icon?.left);
  const loadingIconLeft = hasLeftIcon ? loadingIcon : null;
  const loadingIconRight = !hasLeftIcon ? loadingIcon : null;

  return (
    <>
      {loadingIconLeft ?? icon?.left ?? null}
      {title && <span className={style.button__text}>{title}</span>}
      {loadingIconRight ?? icon?.right ?? null}
    </>
  );
}

export { ButtonBase };
