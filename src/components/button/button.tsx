import React, { MouseEventHandler } from 'react';
import {
  ButtonBase,
  ButtonBaseProps,
  getBaseButtonClassName,
  getButtonStyle,
} from './utils';

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
  buttonProps?: React.JSX.IntrinsicElements['button'];
} & ButtonBaseProps;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ onClick, testID, buttonProps, ...props }, ref) {
    const className = getBaseButtonClassName(props);
    const buttonStyle = getButtonStyle(props);

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={className}
        disabled={props.disabled || props.state === 'loading'}
        aria-disabled={props.disabled || props.state === 'loading'}
        data-testid={testID}
        style={buttonStyle}
        {...buttonProps}
      >
        <ButtonBase {...props} />
      </button>
    );
  },
);

export default Button;
