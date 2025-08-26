import '@shopify/polaris/build/esm/styles.css';
import { AppProvider } from '@shopify/polaris';

function MyApp({ Component, pageProps }) {
  return (
    <AppProvider i18n={{}}>
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default MyApp;
