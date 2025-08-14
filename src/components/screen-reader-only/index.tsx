import style from './screen-reader-only.module.css';

export type ScreenReaderOnlyProps = {
  text: string;
  role?: React.JSX.IntrinsicElements['div']['role'];
};
export default function ScreenReaderOnly({
  text,
  role,
}: ScreenReaderOnlyProps) {
  return (
    <div className={style.srOnly} role={role}>
      {text}
    </div>
  );
}
