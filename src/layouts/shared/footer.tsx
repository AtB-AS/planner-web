/* eslint-disable @next/next/no-img-element */
import { ButtonLink } from '@atb/components/button';
import { useTheme } from '@atb/modules/theme';
import { Language, ModuleText, useTranslation } from '@atb/translations';
import { useLanguageSettings } from '@atb/translations/language-context';
import Link from 'next/link';

import style from './footer.module.css';

// @TODO Replace this with real data
const tempOrgData = {
  privacyDeclarationUrl: 'https://beta.atb.no/private-policy',
  accessibilityStatementUrl:
    'https://uustatus.no/nb/erklaringer/publisert/3004ce8c-c4b5-4828-b984-7829407d63b5',
  termsOfUseUrl: null,
  termsOfUseUrlEnglish: null,
  helpPageUrl: null,
  helpPageUrlEnglish: null,

  facebookLink: 'https://www.facebook.com/atb.no/',
  instagramLink: 'https://www.instagram.com/atb_no/',
  twitterLink: 'https://twitter.com/atb_no',
  fylkeskommuneLogo: '/trl_fylkeskommune.svg',
  fylkeskommuneLogoDark: '/trl_fylkeskommune_dark.svg',
  fylkeskommuneName: 'Trøndelag fylkeskommune',
};

export type FooterProps = {
  withoutSettings?: boolean;
};

export default function Footer({ withoutSettings = false }: FooterProps) {
  const {
    privacyDeclarationUrl,
    accessibilityStatementUrl,
    termsOfUseUrl,
    termsOfUseUrlEnglish,
    helpPageUrl,
    helpPageUrlEnglish,
    instagramLink,
    facebookLink,
    twitterLink,
    fylkeskommuneLogo,
    fylkeskommuneLogoDark,
    fylkeskommuneName,
  } = tempOrgData;

  const { isDarkMode, toggleDarkmode } = useTheme();
  const { t, language } = useTranslation();

  return (
    <footer className={style.footer}>
      <div className={style.footer__content}>
        <div className={style.footer__top}>
          <section className={style.footer__section}>
            <h4 className={style.footer__title}>
              {t(ModuleText.Layout.base.footer.sections.general.header)}
            </h4>

            <ul className={style.footer__linkList}>
              {helpPageUrl ? (
                <li>
                  <a
                    href={
                      language === Language.English && helpPageUrlEnglish
                        ? helpPageUrlEnglish
                        : helpPageUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t(
                      ModuleText.Layout.base.footer.sections.general
                        .helpPageLink,
                    )}
                  </a>
                </li>
              ) : null}
            </ul>
          </section>

          <section className={style.footer__section}>
            <h4 className={style.footer__title}>
              {t(ModuleText.Layout.base.footer.sections.contact.header)}
            </h4>

            <ul className={style.footer__linkList}>
              <li>
                <Link href="/contact">
                  {t(
                    ModuleText.Layout.base.footer.sections.contact.contactLink,
                  )}
                </Link>
              </li>
            </ul>
          </section>

          {!withoutSettings && (
            <section className={style.footer__section}>
              <h4 className={style.footer__title}>
                {t(ModuleText.Layout.base.footer.sections.settings.header)}
              </h4>

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
          <div className={style.footer__some}>
            {facebookLink && (
              <ButtonLink
                mode="interactive_1"
                radius="top-bottom"
                display="inline"
                radiusSize="circular"
                icon={{ left: <img src="/fb.svg" alt="Facebook" /> }}
                href={facebookLink}
                aProps={{
                  target: '_blank',
                  rel: 'noreferrer',
                  title: 'Facebook',
                }}
              />
            )}
            {instagramLink && (
              <ButtonLink
                mode="interactive_1"
                radius="top-bottom"
                display="inline"
                radiusSize="circular"
                icon={{ left: <img src="/ig.svg" alt="Instagram" /> }}
                href={instagramLink}
                aProps={{
                  target: '_blank',
                  rel: 'noreferrer',
                  title: 'Instagram',
                }}
              />
            )}
            {twitterLink && (
              <ButtonLink
                mode="interactive_1"
                radius="top-bottom"
                display="inline"
                radiusSize="circular"
                icon={{ left: <img src="/twitter.svg" alt="Twitter" /> }}
                href={twitterLink}
                aProps={{
                  target: '_blank',
                  rel: 'noreferrer',
                  title: 'Twitter',
                }}
              />
            )}
          </div>

          <div className={style.footer__bottomLinks__mid}>
            <a href={privacyDeclarationUrl} target="_blank" rel="noreferrer">
              {t(ModuleText.Layout.base.footer.bottomLinks.privacy)}
            </a>
            <span aria-hidden="true">•</span>
            <a
              href={accessibilityStatementUrl}
              target="_blank"
              rel="noreferrer"
            >
              {t(
                ModuleText.Layout.base.footer.bottomLinks
                  .accessibilityStatement,
              )}
            </a>

            {termsOfUseUrl && (
              <>
                <span aria-hidden="true">•</span>
                <a
                  href={
                    language === Language.English && termsOfUseUrlEnglish
                      ? termsOfUseUrlEnglish
                      : termsOfUseUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {t(ModuleText.Layout.base.footer.bottomLinks.termsOfUse)}
                </a>
              </>
            )}
          </div>

          {fylkeskommuneName &&
            (fylkeskommuneLogo && fylkeskommuneLogoDark ? (
              <img
                src={isDarkMode ? fylkeskommuneLogoDark : fylkeskommuneLogo}
                alt={fylkeskommuneName}
              />
            ) : (
              fylkeskommuneLogo && (
                <img src={fylkeskommuneLogo} alt={fylkeskommuneName} />
              )
            ))}
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
