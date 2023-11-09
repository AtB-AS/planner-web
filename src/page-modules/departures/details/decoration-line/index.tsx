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
          className={[
            style.decorationMarker,
            style.decorationMarker__start,
          ].join(' ')}
          style={colorStyle}
        />
      )}
      {hasCenter && (
        <div
          className={[
            style.decorationMarker,
            style.decorationMarker__center,
          ].join(' ')}
          style={colorStyle}
        />
      )}
      {hasEnd && (
        <div
          className={[style.decorationMarker, style.decorationMarker__end].join(
            ' ',
          )}
          style={colorStyle}
        />
      )}
    </div>
  );
}
