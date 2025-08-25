import {AppProvider} from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}
