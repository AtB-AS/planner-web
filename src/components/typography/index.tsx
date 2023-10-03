import type { TextNames } from '@atb-as/theme';
// import style from './typography.module.css';
import { and } from '@atb/utils/css';

type BaseTypographyInternal<E extends React.ElementType = React.ElementType> = {
  children: string | string[];
  textType: TextNames;
  as?: E;
};

export type BaseTypographyProps<E extends React.ElementType> =
  BaseTypographyInternal<E> &
    Omit<React.ComponentProps<E>, keyof BaseTypographyInternal>;

const __DEFAULT_ELEMENT__ = 'span';

export default function BaseTypography<
  E extends React.ElementType = typeof __DEFAULT_ELEMENT__,
>({ as, textType, className, children, ...props }: BaseTypographyProps<E>) {
  const Component = as || __DEFAULT_ELEMENT__;
  const extraClass = `typo-${textType}`;
  return (
    <Component {...props} className={and(extraClass, className)}>
      {children}
    </Component>
  );
}

const supportedTypes = ['div', 'p', 'span', 'h2', 'h3'] as const;
type SupportedTypes = (typeof supportedTypes)[number];

function createConstructor(key: SupportedTypes) {
  return function TypoType(props: BaseTypographyProps<typeof key>) {
    return <BaseTypography as={key} {...props} />;
  };
}

export const Typo = {
  span: createConstructor('span'),
  div: createConstructor('div'),
  p: createConstructor('p'),
  h2: createConstructor('h2'),
  h3: createConstructor('h3'),
};
