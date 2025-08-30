// pages/index.js
import { useState } from 'react';
import { Page, Card, Banner, Button } from '@shopify/polaris';
import ProductPicker from '../components/ProductPicker';

export default function HomePage() {
  const [variantId, setVariantId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function createCheckout() {
    if (!variantId) return setError('Please select a variant first');
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId, quantity }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Checkout failed');
      window.open(json.webUrl, '_blank');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page title="Tap2Buy">
      {error && (
        <Card sectioned>
          <Banner tone="critical">{error}</Banner>
        </Card>
      )}

      <Card sectioned>
        <ProductPicker onPick={({ variant }) => setVariantId(variant.id)} />
        <Button primary onClick={createCheckout} loading={loading}>
          Create Checkout
        </Button>
      </Card>
    </Page>
  );
}
