import { DEFAULT_ZONE_MAP_ZOOM } from '@atb/page-modules/embed/zone-map';
import dynamic from 'next/dynamic';
import style from './embed-docs.module.css';

// Client only, the syntax highlighter tokenizes differently on the server and
// causes a hydration mismatch.
const CopyMarkup = dynamic(
  () => import('@atb/page-modules/widget').then((mod) => mod.CopyMarkup),
  { ssr: false },
);

const html = String.raw;

export type EmbedDocsProps = {
  urlBase: string;
};

export function EmbedDocs({ urlBase }: EmbedDocsProps) {
  const zoneMapUrl = `${urlBase}/embed/zone-map`;

  const basicExample = html`
    <iframe
      src="${zoneMapUrl}"
      title="Zone map"
      width="100%"
      height="500"
      style="border: 0;"
      loading="lazy"
    ></iframe>
  `;

  const positionExample = html`
    <iframe
      src="${zoneMapUrl}?lat=63.43&lon=10.39&zoom=11"
      title="Zone map"
      width="100%"
      height="500"
      style="border: 0;"
      loading="lazy"
    ></iframe>
  `;

  return (
    <div className={style.main}>
      <h1>Embed documentation</h1>
      <p>
        Pages that can be embedded on your own website using an{' '}
        <code>iframe</code>.
      </p>

      <h2>Zone map</h2>
      <p>
        A map showing all fare zones. By default the map starts zoomed to fit
        all zones, and the center button fits all zones again.
      </p>

      <iframe
        className={style.demo}
        src="/embed/zone-map"
        title="Zone map"
        loading="lazy"
      />

      <h3>Installation</h3>
      <p>Copy the HTML below into your website.</p>
      <CopyMarkup content={basicExample} />

      <h3>Options</h3>
      <p>Options are set as query parameters on the URL.</p>

      <table className={style.table}>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Description</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>lat</code>
            </td>
            <td>Latitude to start the map at (-90 to 90).</td>
            <td>Fit all zones</td>
          </tr>
          <tr>
            <td>
              <code>lon</code>
            </td>
            <td>Longitude to start the map at (-180 to 180).</td>
            <td>Fit all zones</td>
          </tr>
          <tr>
            <td>
              <code>zoom</code>
            </td>
            <td>Zoom level to start the map at (0 to 22).</td>
            <td>{DEFAULT_ZONE_MAP_ZOOM}</td>
          </tr>
        </tbody>
      </table>

      <p>
        <code>lat</code> and <code>lon</code> must both be set to start at a
        position. <code>zoom</code> is only used together with them. Invalid
        values are ignored and the default is used instead.
      </p>

      <CopyMarkup content={positionExample} />
    </div>
  );
}
