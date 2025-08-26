import { Page, Layout, Card, Text, TextField, Button, InlineStack } from "@shopify/polaris";
import { useState } from "react";

export default function HomePage() {
  const [variantId, setVariantId] = useState(""); // e.g. gid://shopify/ProductVariant/1234567890
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState("");

  const createCheckout = async () => {
    setLoading(true);
    setCheckoutUrl("");
    try {
      const r = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity })
      });
      const json = await r.json();
      if (!r.ok) throw new Error(json.error || "Failed");
      setCheckoutUrl(json.webUrl);
      // Optionally auto-open:
      window.open(json.webUrl, "_blank");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Zyppi Tap2Buy">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text variant="headingMd">Create a checkout link</Text>
            <p>Paste a product <b>Variant GID</b> and quantity, then create a checkout.</p>
            <div style={{height: 12}} />
            <TextField label="Variant ID (GID)" value={variantId} onChange={setVariantId} placeholder="gid://shopify/ProductVariant/..." />
            <div style={{height: 12}} />
            <TextField label="Quantity" value={quantity} onChange={setQuantity} type="number" autoComplete="off" />
            <div style={{height: 12}} />
            <InlineStack gap="200">
              <Button primary loading={loading} onClick={createCheckout}>Create checkout</Button>
              {checkoutUrl ? <a href={checkoutUrl} target="_blank" rel="noreferrer">Open checkout</a> : null}
            </InlineStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
