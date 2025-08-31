// pages/index.js
import { useState } from "react";
import {
  Page, Layout, Card, Text, TextField, Button, Banner, InlineStack, Link,
} from "@shopify/polaris";
import ProductPicker from "../components/ProductPicker";

export default function HomePage() {
  const [variantGid, setVariantGid] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");

  const createCheckout = async () => {
    setError("");
    setCheckoutUrl("");
    if (!variantGid) {
      setError("Please select a variant first.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantGid,
          quantity: Number(quantity || 1),
        }),
      });

      const ct = res.headers.get("content-type") || "";
      const body = ct.includes("application/json") ? await res.json() : { error: await res.text() };
      if (!res.ok) throw new Error(body?.error || `Request failed (${res.status})`);
      if (!body?.checkoutUrl) throw new Error("No checkout URL returned.");

      setCheckoutUrl(body.checkoutUrl);
      window.open(body.checkoutUrl, "_blank");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Tap2Buy">
      <Layout>

        {error ? (
          <Layout.Section>
            <Banner tone="critical" title="Something went wrong">
              <p>{error}</p>
            </Banner>
          </Layout.Section>
        ) : null}

        {checkoutUrl ? (
          <Layout.Section>
            <Banner tone="success" title="Checkout created">
              <p>
                <Link url={checkoutUrl} external>Open checkout</Link>
              </p>
            </Banner>
          </Layout.Section>
        ) : null}

        {/* Product / Variant Picker */}
        <Layout.Section>
          <Card>
            <div style={{ padding: 16, display: "grid", gap: 16 }}>
              <Text as="h2" variant="headingMd">Pick a product & variant</Text>
              <ProductPicker onPick={({ variant }) => setVariantGid(variant.id)} />
              <Text tone="subdued">Selected variant: {variantGid || "—"}</Text>
            </div>
          </Card>
        </Layout.Section>

        {/* Checkout */}
        <Layout.Section>
          <Card>
            <div style={{ padding: 16, display: "grid", gap: 12 }}>
              <Text as="h2" variant="headingMd">Create checkout</Text>
              <TextField
                label="Quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={setQuantity}
                autoComplete="off"
              />
              <InlineStack gap="200">
                <Button primary loading={loading} onClick={createCheckout}>
                  Create checkout
                </Button>
                <Button url="/api/health" target="_blank" variant="secondary">
                  API health
                </Button>
              </InlineStack>
            </div>
          </Card>
        </Layout.Section>

      </Layout>
    </Page>
  );
}
