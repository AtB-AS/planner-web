import { and } from '@atb/utils/css';
import style from './decoration-line.module.css';

type DecorationLineProps = {
  hasStart?: boolean;
  hasCenter?: boolean;
  hasEnd?: boolean;
  color: string;
};

export default function DecorationLine({
  color,
  hasStart,
  hasCenter,
  hasEnd,
}: DecorationLineProps) {
  const colorStyle = { backgroundColor: color };
  return (
    <div className={style.decoration} style={colorStyle}>
      {hasStart && (
        <div
          className={and(style.decorationMarker, style.decorationMarker__start)}
          style={colorStyle}
        />
      )}
      {hasCenter && (
        <div
          className={and(
            style.decorationMarker,
            style.decorationMarker__center,
          )}
          style={colorStyle}
        />
      )}
      {hasEnd && (
        <div
          className={and(style.decorationMarker, style.decorationMarker__end)}
          style={colorStyle}
        />
      )}
    </div>
  );
}
