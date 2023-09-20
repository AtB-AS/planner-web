import { getGlobalCookies } from '@atb/modules/cookies';
import { DEFAULT_LANGUAGE } from '@atb/translations';
import { getLocalesFromAcceptLanguage } from '@atb/translations/language-context';
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

type Props = {
  darkmode?: boolean;
  language?: string;
};

class MyDocument extends Document<Props> {
  static async getInitialProps(ctx: DocumentContext) {
    const d = getGlobalCookies(ctx.req as any);
    const initialProps = await Document.getInitialProps(ctx);
    const language =
      d.initialCookies.language ||
      getLocalesFromAcceptLanguage(d.headersAcceptLanguage);

    return { ...initialProps, darkmode: d.initialCookies.darkmode, language };
  }

  render() {
    const className = this.props.darkmode ? 'dark' : 'light override-light';
    const language = this.props.language || DEFAULT_LANGUAGE;
    return (
      <Html lang={language} className={className}>
        <Head>
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com/"
            crossOrigin=""
          />

          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
