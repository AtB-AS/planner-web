import {
  ZoneMap,
  parseZoneMapQuery,
  type ZoneMapProps,
} from '@atb/page-modules/embed/zone-map';
import { withAccessLogging } from '@atb/modules/logging';
import { getLocalesFromAcceptLanguage } from '@atb/translations';
import type { NextPage } from 'next';

const ZoneMapPage: NextPage<ZoneMapProps> = (props) => <ZoneMap {...props} />;

export default ZoneMapPage;

export const getServerSideProps = withAccessLogging<ZoneMapProps>(
  async function ({ query, req }) {
    return {
      props: {
        ...parseZoneMapQuery(query),
        language: getLocalesFromAcceptLanguage(
          req.headers['accept-language'] ?? '',
        ),
      },
    };
  },
);
