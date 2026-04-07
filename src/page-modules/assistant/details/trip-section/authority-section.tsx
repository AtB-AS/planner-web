import { Typo } from '@atb/components/typography';
import { TripRow } from '@atb/modules/trip-details';
import { PageText, useTranslation } from '@atb/translations';

import style from './trip-section.module.css';
import { AuthorityFragment } from '../../journey-gql/trip-with-details.generated';
import { ButtonLink } from '@atb/components/button';
import { MonoIcon } from '@atb/components/icon';
import { useTheme } from '@atb/modules/theme';
import { getConfigUrl, getOrgData } from '@atb/modules/org-data';
import type { OrgData } from '@atb/modules/org-data';
import type { Language } from '@atb/translations';
import {
  useDevicePlatform,
  type DevicePlatform,
} from '@atb/utils/use-device-platform';

export type AuthoritySectionProps = {
  authority: AuthorityFragment;
};

export function AuthoritySection({ authority }: AuthoritySectionProps) {
  const { language, t } = useTranslation();
  const { color } = useTheme();
  const { authorityId, urls } = getOrgData();
  const devicePlatform = useDevicePlatform();

  const isCurrentAuthority = authority.id == authorityId;

  if (!isCurrentAuthority && !authority.url) return null;

  const url = isCurrentAuthority
    ? getTicketUrlForPlatform(devicePlatform, urls, language)
    : authority.url;

  if (!url) return null;

  return (
    <TripRow>
      <div className={style.authoritySection}>
        <Typo.p textType="body__s" className={style.textColor__secondary}>
          {t(PageText.Assistant.details.tripSection.buyTicketFrom)}
        </Typo.p>
        <ButtonLink
          href={url}
          title={authority.name}
          icon={{ left: <MonoIcon icon="navigation/ExternalLink" /> }}
          mode="secondary"
          backgroundColor={color.background.neutral[0]}
          display="block"
          radiusSize="circular"
          size="pill"
          aProps={{ target: '_blank' }}
        />
      </div>
    </TripRow>
  );
}

function getTicketUrlForPlatform(
  platform: DevicePlatform,
  urls: OrgData['urls'],
  language: Language,
): string | undefined {
  const resolve = (url: OrgData['urls']['purchaseTicketUrl']) =>
    url ? getConfigUrl(url, language) : undefined;

  switch (platform) {
    case 'android':
      return resolve(urls.androidAppUrl) ?? resolve(urls.purchaseTicketUrl);
    case 'ios':
      return resolve(urls.iosAppUrl) ?? resolve(urls.purchaseTicketUrl);
    default:
      return resolve(urls.purchaseTicketUrl);
  }
}
