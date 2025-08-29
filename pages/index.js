// pages/index.js
import { useState } from 'react';
import { AppProvider, Page, Layout, Card } from '@shopify/polaris';
import ProductPicker from '../components/ProductPicker';

export default function Home() {
  const [chosen, setChosen] = useState(null);

  return (
    <AppProvider>
      <Page title="Zyppi Tap2Buy">
        <Layout>
          <Layout.Section>
            <ProductPicker onPick={setChosen} />
          </Layout.Section>

          {chosen && (
            <Layout.Section>
              <Card sectioned>
                <p><strong>Selected Product:</strong> {chosen.product.title}</p>
                <p><strong>Variant:</strong> {chosen.variant.title}</p>
                <p><strong>Price:</strong> {chosen.variant.price.amount} {chosen.variant.price.currencyCode}</p>
              </Card>
            </Layout.Section>
          )}
        </Layout>
      </Page>
    </AppProvider>
  );
}
