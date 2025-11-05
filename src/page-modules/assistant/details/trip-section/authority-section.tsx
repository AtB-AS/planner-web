import { Typo } from '@atb/components/typography';
import { TripRow } from '@atb/modules/trip-details';
import { PageText, useTranslation } from '@atb/translations';

import style from './trip-section.module.css';
import { AuthorityFragment } from '../../journey-gql/trip-with-details.generated';
import { ButtonLink } from '@atb/components/button';
import { MonoIcon } from '@atb/components/icon';
import { useTheme } from '@atb/modules/theme';
import { getOrgData } from '@atb/modules/org-data';

export type AuthoritySectionProps = {
  authority: AuthorityFragment;
};

export function AuthoritySection({ authority }: AuthoritySectionProps) {
  const { t } = useTranslation();
  const { color } = useTheme();
  const { authorityId } = getOrgData();

  if (!authority.url || authority.id === authorityId) return null;

  return (
    <TripRow>
      <div className={style.authoritySection}>
        <Typo.p textType="body__s" className={style.textColor__secondary}>
          {t(PageText.Assistant.details.tripSection.buyTicketFrom)}
        </Typo.p>
        <ButtonLink
          href={authority.url || '#'}
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
