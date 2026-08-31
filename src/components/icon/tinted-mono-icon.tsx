import { CSSProperties } from 'react';
import { MonoIcons, icons } from './generated-icons';
import { SizeProps, useSize } from './utils';

export type TintedMonoIconProps = {
  icon: MonoIcons;
  size?: SizeProps;
  className?: string;
};

export function TintedMonoIcon({
  icon,
  size = 'normal',
  className,
}: TintedMonoIconProps) {
  const wh = useSize(size);
  const maskUrl = `/assets/${icons['mono'][icon].relative.replace(
    'mono/',
    'mono/dark/',
  )}`;

  const maskStyle: CSSProperties = {
    display: 'inline-block',
    width: wh,
    height: wh,
    backgroundColor: 'currentColor',
    WebkitMaskImage: `url("${maskUrl}")`,
    maskImage: `url("${maskUrl}")`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
  };

  return <span aria-hidden="true" className={className} style={maskStyle} />;
}

export default TintedMonoIcon;
