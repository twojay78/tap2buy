// pages/index.js
import {useState} from 'react';
import {Page, Card, TextField, Button, Banner, InlineStack, Text} from '@shopify/polaris';
import ProductPicker from '../components/ProductPicker';

export default function HomePage() {
  const [variantId, setVariantId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function createCheckout() {
    setLoading(true);
    setError('');
    try {
      const r = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ variantId, quantity }),
      });
      const json = await r.json();
      if (!r.ok) throw new Error(json.error || 'Failed to create checkout');
      window.open(json.webUrl, '_blank'); // Shopify shows Apple/Google/Shop Pay if supported
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page title="Zyppi Tap2Buy">
      {error && (
        <Card sectioned>
          <Banner tone="critical" title="Error">
            <p>{error}</p>
          </Banner>
        </Card>
      )}

      <ProductPicker onPick={({variant}) => setVariantId(variant.id)} />

      <Card sectioned>
        <Text as="h3" variant="headingMd">Checkout</Text>
        <div style={{height:12}} />
        <TextField label="Selected Variant GID" value={variantId} onChange={setVariantId} autoComplete="off" />
        <TextField label="Quantity" type="number" value={quantity} onChange={setQuantity} autoComplete="off" />
        <div style={{height:12}} />
        <InlineStack gap="200">
          <Button primary loading={loading} onClick={createCheckout}>Create checkout</Button>
          <Button url="/api/health" target="_blank">API health</Button>
        </InlineStack>
      </Card>
    </Page>
  );
}
