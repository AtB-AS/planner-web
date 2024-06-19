import { AppCookiesProvider } from '@atb/modules/cookies';
import { WithGlobalData } from '@atb/layouts/global-data';
import { AppLanguageProvider } from '@atb/translations';
import { BaseLayout, BaseLayoutProps } from './base';
import { GlobalMessageContextProvider } from '@atb/modules/global-messages';

type DefaultLayoutProps = BaseLayoutProps & WithGlobalData<{}>;
function DefaultLayout<T>({
  initialCookies,
  headersAcceptLanguage,
  ...pageProps
}: DefaultLayoutProps) {
  return (
    <AppCookiesProvider initialCookies={initialCookies}>
      <AppLanguageProvider serverAcceptLanguage={headersAcceptLanguage}>
        <GlobalMessageContextProvider>
          <BaseLayout {...pageProps} />
        </GlobalMessageContextProvider>
      </AppLanguageProvider>
    </AppCookiesProvider>
  );
}

export default DefaultLayout;
