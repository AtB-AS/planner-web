import EmbedLayout from '@atb/layouts/embed';
import { setEmbedFrameAncestors } from '@atb/page-modules/embed/frame-ancestors';
import {
  parseZoneMapQuery,
  ZoneMap,
  type ZoneMapProps,
} from '@atb/page-modules/embed/zone-map';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';
import { withAccessLogging } from '@atb/modules/logging';
import type { NextPage } from 'next';

export type ZoneMapPageProps = WithGlobalData<ZoneMapProps>;

const ZoneMapPage: NextPage<ZoneMapPageProps> = (props) => {
  return (
    <EmbedLayout {...props}>
      <ZoneMap position={props.position} zoom={props.zoom} />
    </EmbedLayout>
  );
};

export default ZoneMapPage;

export const getServerSideProps = withAccessLogging(
  withGlobalData<ZoneMapProps>(async function ({ query, res }) {
    setEmbedFrameAncestors(res);
    return { props: parseZoneMapQuery(query) };
  }),
);
