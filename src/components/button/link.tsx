import Link from 'next/link';
import React from 'react';
import {
  ButtonBase,
  ButtonBaseProps,
  getBaseButtonClassName,
  getButtonStyle,
} from './utils';

import { UrlObject } from 'url';

export type ButtonLinkProps = {
  /**
   * Link or UrlObject passed to next/link
   */
  href: string | UrlObject;
  /**
   * Optional additional onClick if you want to
   * enrich click actions with JavaScript function
   */
  onClick?: React.JSX.IntrinsicElements['a']['onClick'];
  /**
   * Specify properties to underlying a tag
   */
  aProps?: React.JSX.IntrinsicElements['a'];
  /**
   * If we should do shallow routing or not.
   * Shallow routing will not trigger server side props
   * @default false
   */
  shallow?: boolean;
} & ButtonBaseProps;

export function ButtonLink({
  href,
  onClick,
  testID,
  aProps = {},
  shallow = false,
  ...props
}: ButtonLinkProps) {
  const className = getBaseButtonClassName(props);
  const extraProps = props.state == 'active' ? { 'aria-current': true } : {};
  const buttonStyle = getButtonStyle(props);

  if (props.disabled || props.state == 'loading') {
    return (
      <a
        className={className}
        role="link"
        aria-disabled
        data-testid={testID}
        {...extraProps}
        {...aProps}
      >
        <ButtonBase {...props} />
      </a>
    );
  }

  return (
    <Link href={href} shallow={shallow} legacyBehavior>
      <a
        className={className}
        onClick={onClick}
        {...extraProps}
        {...aProps}
        style={buttonStyle}
        data-testid={testID}
      >
        <ButtonBase {...props} />
      </a>
    </Link>
  );
}

export default ButtonLink;
