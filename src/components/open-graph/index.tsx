import { getOrgData } from '@atb/modules/org-data';
import Head from 'next/head';
import { useRouter } from 'next/router';

const {
  urls: {
    sitemapUrls: { prod },
  },
} = getOrgData();

export type OpenGraphImageProps = {
  image: string;
};
export function OpenGraphImage({ image }: OpenGraphImageProps) {
  return (
    <Head>
      <meta property="og:image" content={`${prod}${image}`} />
    </Head>
  );
}

export type OpenGraphBaseProps = {
  title: string;
};
export function OpenGraphBase({ title }: OpenGraphBaseProps) {
  const { asPath } = useRouter();

  return (
    <Head>
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${prod}${asPath.slice(1)}`} />
    </Head>
  );
}
