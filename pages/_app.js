// pages/_app.js
import '@shopify/polaris/build/esm/styles.css';
import { AppProvider } from '@shopify/polaris';

export default function MyApp({ Component, pageProps }) {
  return (
    <AppProvider i18n={{}}>
      <Component {...pageProps} />
    </AppProvider>
  );
}
