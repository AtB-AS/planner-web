/* eslint-disable @next/next/no-img-element */
import { ButtonLink } from '@atb/components/button';
import { getConfigUrl, getOrgData } from '@atb/modules/org-data';
import { useTheme } from '@atb/modules/theme';
import { Language, ModuleText, useTranslation } from '@atb/translations';
import { useLanguageSettings } from '@atb/translations/language-context';

import style from './footer.module.css';

export type FooterProps = {
  withoutSettings?: boolean;
};

type SomeLink = {
  href: string;
  iconSrc: string;
  title: string;
};

const { orgId, urls, fylkeskommune } = getOrgData();

export default function Footer({ withoutSettings = false }: FooterProps) {
  const { isDarkMode, toggleDarkmode } = useTheme();
  const { t, language } = useTranslation();

  const someLinks: SomeLink[] = [
    urls.facebookLink && {
      href: urls.facebookLink,
      iconSrc: '/fb.svg',
      title: 'Facebook',
    },
    urls.instagramLink && {
      href: urls.instagramLink,
      iconSrc: '/ig.svg',
      title: 'Instagram',
    },
    urls.twitterLink && {
      href: urls.twitterLink,
      iconSrc: '/twitter.svg',
      title: 'Twitter',
    },
  ].filter(Boolean) as SomeLink[];

  return (
    <footer className={style.footer}>
      <div className={style.footer__content}>
        <div className={style.footer__top}>
          <section className={style.footer__section}>
            <h3 className={style.footer__title}>
              {t(ModuleText.Layout.base.footer.sections.general.header)}
            </h3>

            <ul className={style.footer__linkList}>
              {urls.helpUrl && (
                <li>
                  <a
                    href={getConfigUrl(urls.helpUrl, language)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t(
                      ModuleText.Layout.base.footer.sections.general
                        .helpPageLink,
                    )}
                  </a>
                </li>
              )}
              {urls.ticketsUrl && (
                <li>
                  <a
                    href={getConfigUrl(urls.ticketsUrl, language)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t(
                      ModuleText.Layout.base.footer.sections.general
                        .ticketPricesPageLink,
                    )}
                  </a>
                </li>
              )}
            </ul>
          </section>

          <section className={style.footer__section}>
            <h3 className={style.footer__title}>
              {t(ModuleText.Layout.base.footer.sections.contact.header)}
            </h3>

            <ul className={style.footer__linkList}>
              {urls.supportUrl ? (
                <li>
                  <a
                    href={getConfigUrl(urls.supportUrl, language)}
                    target={orgId === 'fram' ? undefined : '_blank'}
                    rel="noreferrer"
                  >
                    {t(
                      ModuleText.Layout.base.footer.sections.general
                        .supportPageLink,
                    )}
                  </a>
                </li>
              ) : null}
            </ul>
          </section>

          {!withoutSettings && (
            <section className={style.footer__section}>
              <h3 className={style.footer__title}>
                {t(ModuleText.Layout.base.footer.sections.settings.header)}
              </h3>

              <ul className={style.footer__linkList}>
                <LanguageSelections />
                <li>
                  <button
                    className={style.buttonLink}
                    onClick={() => toggleDarkmode(!isDarkMode)}
                  >
                    {isDarkMode
                      ? t(
                          ModuleText.Layout.base.footer.sections.settings
                            .toggleLightMode,
                        )
                      : t(
                          ModuleText.Layout.base.footer.sections.settings
                            .toggleDarkMode,
                        )}
                  </button>
                </li>
              </ul>

              <p className={style.footer__cookieWarning}>
                {t(
                  ModuleText.Layout.base.footer.sections.settings
                    .cookiesWarning,
                )}
              </p>
            </section>
          )}
        </div>

        <hr />

        <section className={style.footer__bottomLinks}>
          {someLinks.length > 0 && (
            <div className={style.footer__some}>
              {someLinks.map((link) => (
                <ButtonLink
                  key={link.href}
                  mode={isDarkMode ? 'interactive_2' : 'interactive_1'}
                  radius="top-bottom"
                  display="inline"
                  radiusSize="circular"
                  icon={{ left: <img src={link.iconSrc} alt={link.title} /> }}
                  href={link.href}
                  aProps={{
                    target: '_blank',
                    rel: 'noreferrer',
                    title: link.title,
                  }}
                />
              ))}
            </div>
          )}

          <div className={style.footer__bottomLinks__mid}>
            <a
              href={getConfigUrl(urls.privacyDeclarationUrl, language)}
              target="_blank"
              rel="noreferrer"
            >
              {t(ModuleText.Layout.base.footer.bottomLinks.privacy)}
            </a>
            <span aria-hidden="true">•</span>
            <a
              href={getConfigUrl(urls.accessibilityStatementUrl, language)}
              target="_blank"
              rel="noreferrer"
            >
              {t(
                ModuleText.Layout.base.footer.bottomLinks
                  .accessibilityStatement,
              )}
            </a>
          </div>

          {fylkeskommune && (
            <img
              src={
                isDarkMode ? fylkeskommune.logoSrcDark : fylkeskommune.logoSrc
              }
              alt={fylkeskommune.name}
            />
          )}
        </section>
      </div>
    </footer>
  );
}

function LanguageSelections() {
  const { language, setLanguage } = useLanguageSettings();
  const { t } = useTranslation();
  return (
    <>
      {language !== Language.Norwegian && (
        <li>
          <button
            className={style.buttonLink}
            onClick={() => setLanguage(Language.Norwegian)}
          >
            {t(
              ModuleText.Layout.base.footer.sections.settings.setLanguage.norsk,
            )}
          </button>
        </li>
      )}
      {language !== Language.English && (
        <li>
          <button
            className={style.buttonLink}
            onClick={() => setLanguage(Language.English)}
            data-testid="setLanguageToEnglish"
          >
            {t(
              ModuleText.Layout.base.footer.sections.settings.setLanguage
                .english,
            )}
          </button>
        </li>
      )}
      {language !== Language.Nynorsk && (
        <li>
          <button
            className={style.buttonLink}
            onClick={() => setLanguage(Language.Nynorsk)}
          >
            {t(
              ModuleText.Layout.base.footer.sections.settings.setLanguage
                .nynorsk,
            )}
          </button>
        </li>
      )}
    </>
  );
}
