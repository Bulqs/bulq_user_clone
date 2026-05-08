import type { AppProps } from 'next/app';
import '../../globals';

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default MyApp;