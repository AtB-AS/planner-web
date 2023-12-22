import React, { MouseEventHandler } from 'react';
import { ButtonBase, ButtonBaseProps, getBaseButtonClassName } from './utils';

export type ButtonProps = {
  /** Action when clicked */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Specify testID for easier access when using cypress
   */
  testID?: string;
  /**
   * Pass properties to button element directly
   */
  buttonProps?: JSX.IntrinsicElements['button'];
  /**
   * Define aria-label for voiceover to read.
   */
  ariaLabel?: string;
} & ButtonBaseProps;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ onClick, testID, buttonProps, ariaLabel, ...props }, ref) {
    const className = getBaseButtonClassName(props);
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={className}
        disabled={props.disabled || props.state === 'loading'}
        aria-disabled={props.disabled || props.state === 'loading'}
        data-testid={testID}
        aria-label={ariaLabel}
        {...buttonProps}
      >
        <ButtonBase {...props} />
      </button>
    );
  },
);

export default Button;
