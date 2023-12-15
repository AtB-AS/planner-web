import type { AppProps } from 'next/app';
import '../styles/globals.css';

import { init } from '@atb/modules/firebase';

init();

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
