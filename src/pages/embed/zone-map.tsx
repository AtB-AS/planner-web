import EmbedLayout from '@atb/layouts/embed';
import { ZoneMap } from '@atb/page-modules/embed/zone-map';
import { withGlobalData, type WithGlobalData } from '@atb/modules/global-data';
import { withAccessLogging } from '@atb/modules/logging';
import type { NextPage } from 'next';

export type ZoneMapPageProps = WithGlobalData<{}>;

const ZoneMapPage: NextPage<ZoneMapPageProps> = (props) => {
  return (
    <EmbedLayout {...props}>
      <ZoneMap />
    </EmbedLayout>
  );
};

export default ZoneMapPage;

export const getServerSideProps = withAccessLogging(
  withGlobalData(async function () {
    return { props: {} };
  }),
);
