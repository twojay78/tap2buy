// pages/index.js
import { useState } from 'react';
import { Page, Card, TextField, Button, Banner } from '@shopify/polaris';

export default function HomePage() {
  const [variantId, setVariantId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId, quantity }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create checkout');
      // Open checkout in new tab — Shopify will automatically show Apple Pay/Google Pay/Shop Pay if supported
      window.open(json.webUrl, '_blank');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Zyppi Tap2Buy">
      <Card sectioned>
        {error && (
          <Banner status="critical">
            <p>{error}</p>
          </Banner>
        )}
        <TextField
          label="Variant ID (gid://shopify/ProductVariant/123456...)"
          value={variantId}
          onChange={setVariantId}
          autoComplete="off"
        />
        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={setQuantity}
          autoComplete="off"
        />
        <Button primary loading={loading} onClick={createCheckout}>
          Create checkout
        </Button>
      </Card>
    </Page>
  );
}
