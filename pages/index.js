// pages/index.js
import {useState} from "react";
import {
  Page,
  Layout,
  Card,
  Text,
  TextField,
  Button,
  InlineStack,
  Banner,
  Link
} from "@shopify/polaris";

export default function HomePage() {
  const [variantId, setVariantId] = useState(""); // gid://shopify/ProductVariant/123...
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [error, setError] = useState("");

  async function createCheckout() {
    setLoading(true);
    setCheckoutUrl("");
    setError("");
    try {
      const r = await fetch("/api/checkout/create", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ variantId, quantity })
      });
      const json = await r.json();
      if (!r.ok) throw new Error(json?.error || "Failed to create checkout");
      setCheckoutUrl(json.webUrl);
      // auto-open in a new tab:
      window.open(json.webUrl, "_blank");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page title="Zyppi Tap2Buy">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text variant="headingMd">Create a quick checkout</Text>
            <p className="mt-2">
              Paste a product <b>Variant GID</b> from your store and a quantity, then click
              <i> Create checkout</i>. This will open a Shopify checkout instantly.
            </p>
            <div style={{height: 12}} />
            {error ? (
              <Banner tone="critical" title="Error">
                <p>{error}</p>
              </Banner>
            ) : null}
            {checkoutUrl ? (
              <Banner tone="success" title="Checkout created">
                <p>
                  <Link url={checkoutUrl} target="_blank">Open checkout</Link>
                </p>
              </Banner>
            ) : null}
            <div style={{height: 12}} />
            <TextField
              label="Variant ID (GID)"
              placeholder="gid://shopify/ProductVariant/1234567890"
              value={variantId}
              onChange={setVariantId}
              autoComplete="off"
            />
            <div style={{height: 12}} />
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={setQuantity}
              autoComplete="off"
            />
            <div style={{height: 12}} />
            <InlineStack gap="200">
              <Button primary loading={loading} onClick={createCheckout}>
                Create checkout
              </Button>
              <Button url="/api/health" target="_blank" variant="secondary">
                API health
              </Button>
            </InlineStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
