/* eslint-disable @next/next/no-img-element */
import { getStaticMapUrl } from '@atb/components/map';
import { Resvg } from '@resvg/resvg-js';
import { NextApiResponse } from 'next';
import satori, { type Font } from 'satori';

import { readFile } from 'fs/promises';

import { handlerWithDepartureClient } from '@atb/page-modules/departures/server';
import { join } from 'path';
import { theme } from '@atb/modules/theme';
import { getOrgData } from '@atb/modules/org-data';

export default handlerWithDepartureClient<{}>({
  async GET(req, res, { client }) {
    const query = req.query as any;
    const id = query.stopPlaceId as string;
    if (!id) {
      return notfound(res);
    }

    const stopPlace = await client.stopPlace({ id });

    if (!stopPlace) {
      notfound(res);
      return;
    }

    const {
      fylkeskommune,
      urls: {
        sitemapUrls: { prod: prodUrl },
      },
    } = getOrgData();

    const mapUrl = getStaticMapUrl({
      layer: 'venue',
      position: stopPlace.position,
      initialZoom: 18,
      size: {
        width: 1200,
        height: 630,
      },
    });

    const image = await satori(
      <div
        style={{
          color: 'black',
          background: '#f6f6f6',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          position: 'relative',
        }}
      >
        <img alt="Map" width="1200" height="630" src={mapUrl} />

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            background: theme['dark'].static.background.background_0.background,
            color: theme['dark'].static.background.background_0.text,
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
            }}
          >
            <p
              style={{
                fontWeight: 'bold',
                fontSize: '40px',
                padding: 0,
                margin: 0,
              }}
            >
              {stopPlace.name}
            </p>
            <p style={{ padding: 0, margin: 0, fontSize: '24px' }}>
              Se avganger fra holdeplass
            </p>
          </div>

          {fylkeskommune?.logoSrcDark && (
            <img
              src={`${prodUrl}${fylkeskommune.logoSrcDark}`}
              height="40px"
              alt=""
            />
          )}
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: await getFonts(),
      },
    );

    res.setHeader('Content-Type', 'image/png');
    const png = new Resvg(image).render().asPng();
    res.end(png);
  },
});

async function notfound(res: NextApiResponse) {
  const image = await satori(
    <div
      style={{
        color: 'black',
        background: '#f6f6f6',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        fontSize: '32px',
      }}
    >
      <p>Holdeplass ikke funnet</p>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: await getFonts(),
    },
  );

  res.setHeader('Content-Type', 'image/png');
  const png = new Resvg(image).render().asPng();
  return res.end(png);
}

async function getFonts(): Promise<Font[]> {
  return [
    {
      data: await readFile(
        join(process.cwd(), 'public/fonts/Roboto-Regular.ttf'),
      ),
      name: 'Roboto',
      weight: 400,
      style: 'normal',
    },
    {
      data: await readFile(join(process.cwd(), 'public/fonts/Roboto-Bold.ttf')),
      name: 'Roboto',
      weight: 600,
      style: 'normal',
    },
  ];
}
