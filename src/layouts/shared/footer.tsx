/* eslint-disable @next/next/no-img-element */
import { ButtonLink } from '@atb/components/button';
import { getConfigUrl, getOrgData } from '@atb/modules/org-data';
import { useTheme } from '@atb/modules/theme';
import { Language, ModuleText, useTranslation } from '@atb/translations';
import { useLanguageSettings } from '@atb/translations/language-context';

import style from './footer.module.css';
import { getButtonStyleForColor } from '@atb/components/button/utils.tsx';
import { useOrgThemeDefinitions } from '@atb/utils/org-theme-definitions.ts';
import { shouldShowContactPage } from '@atb/page-modules/contact';

export type FooterProps = {
  withoutSettings?: boolean;
};

type SomeLink = {
  href: string;
  iconSrc: string;
  title: string;
};

const { urls, fylkeskommune, featureConfig, orgId } = getOrgData();

export default function Footer({ withoutSettings = false }: FooterProps) {
  const { isDarkMode, toggleDarkmode } = useTheme();
  const { t, language } = useTranslation();
  const { color } = useTheme();
  const buttonStyle = getButtonStyleForColor(color.background.accent['4']);

  const iconSrc = (name: string) =>
    orgId === 'atb' ? `/${name}_dark.svg` : `/${name}.svg`;

  const someLinks: SomeLink[] = [
    urls.facebookLink && {
      href: urls.facebookLink,
      iconSrc: iconSrc('fb'),
      title: 'Facebook',
    },
    urls.instagramLink && {
      href: urls.instagramLink,
      iconSrc: iconSrc('ig'),
      title: 'Instagram',
    },
    urls.twitterLink && {
      href: urls.twitterLink,
      iconSrc: iconSrc('twitter'),
      title: 'Twitter',
    },
  ].filter(Boolean) as SomeLink[];

  const isForcingTheme = featureConfig?.forceTheme !== undefined;
  const { fylkeskommuneLogo } = useOrgThemeDefinitions();

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
                    href={
                      shouldShowContactPage()
                        ? '/contact'
                        : getConfigUrl(urls.supportUrl, language)
                    }
                    target={
                      isExternalUrl(getConfigUrl(urls.supportUrl, language))
                        ? '_blank'
                        : undefined
                    }
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
                {t(
                  !isForcingTheme
                    ? ModuleText.Layout.base.footer.sections.settings.header
                    : ModuleText.Layout.base.footer.sections.settings
                        .forcedThemeHeader,
                )}
              </h3>

              <ul className={style.footer__linkList}>
                <LanguageSelections />
                {!isForcingTheme && (
                  <li>
                    <button
                      className={style.buttonLink}
                      style={buttonStyle}
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
                )}
              </ul>

              <p className={style.footer__cookieWarning}>
                {t(
                  !isForcingTheme
                    ? ModuleText.Layout.base.footer.sections.settings
                        .cookiesWarning
                    : ModuleText.Layout.base.footer.sections.settings
                        .languageCookiesWarning,
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
                  mode="secondary"
                  backgroundColor={color.background.accent['4']}
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
            <img src={fylkeskommuneLogo} alt={fylkeskommune.name} />
          )}
        </section>
      </div>
    </footer>
  );
}

function LanguageSelections() {
  const { language, setLanguage } = useLanguageSettings();
  const { t } = useTranslation();
  const { color } = useTheme();
  const buttonStyle = getButtonStyleForColor(color.background.accent['4']);

  return (
    <>
      {language !== Language.Norwegian && (
        <li>
          <button
            className={style.buttonLink}
            onClick={() => setLanguage(Language.Norwegian)}
            style={buttonStyle}
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
            style={buttonStyle}
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
            style={buttonStyle}
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

function isExternalUrl(url: string) {
  try {
    const currentHostname = window.location.hostname;
    const urlHostname = new URL(url).hostname;
    return urlHostname !== currentHostname;
  } catch {
    return false;
  }
}
