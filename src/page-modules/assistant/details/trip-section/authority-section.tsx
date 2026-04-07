import { Typo } from '@atb/components/typography';
import { TripRow } from '@atb/modules/trip-details';
import { PageText, useTranslation } from '@atb/translations';

import style from './trip-section.module.css';
import { AuthorityFragment } from '../../journey-gql/trip-with-details.generated';
import { ButtonLink } from '@atb/components/button';
import { MonoIcon } from '@atb/components/icon';
import { useTheme } from '@atb/modules/theme';
import { getConfigUrl, getOrgData } from '@atb/modules/org-data';

export type AuthoritySectionProps = {
  authority: AuthorityFragment;
};

export function AuthoritySection({ authority }: AuthoritySectionProps) {
  const { language, t } = useTranslation();
  const { color } = useTheme();
  const { authorityId, urls } = getOrgData();

  const isCurrentAuthority = authority.id == authorityId;

  if (!isCurrentAuthority && !authority.url) return null;

  const url = isCurrentAuthority
    ? urls.purchaseTicketUrl
      ? getConfigUrl(urls.purchaseTicketUrl, language)
      : undefined
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
