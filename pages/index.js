// pages/index.js
import { useState } from "react";
import {
  Page,
  Layout,
  Card,
  Text,
  TextField,
  Button,
  Banner,
  InlineStack,
  Link,
} from "@shopify/polaris";

export default function HomePage() {
  const [variantInput, setVariantInput] = useState("");
  const [variantGid, setVariantGid] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");

  const normalizeVariantId = (val) => {
    const v = (val || "").trim();
    if (!v) return "";
    // accept either numeric ID or full GID
    return /^\d+$/.test(v) ? `gid://shopify/ProductVariant/${v}` : v;
  };

  const handleUseVariant = () => {
    setError("");
    setCheckoutUrl("");
    const gid = normalizeVariantId(variantInput);
    if (!gid) {
      setError("Please enter a variant ID.");
      return;
    }
    setVariantGid(gid);
  };

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
      const body = ct.includes("application/json")
        ? await res.json()
        : { error: await res.text() };

      if (!res.ok) throw new Error(body?.error || `Request failed (${res.status})`);
      if (!body?.checkoutUrl) throw new Error("No checkout URL returned.");

      setCheckoutUrl(body.checkoutUrl);
      // Open in a new tab right away
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
                Your checkout is ready.{" "}
                <Link url={checkoutUrl} external>
                  Open checkout
                </Link>
              </p>
            </Banner>
          </Layout.Section>
        ) : null}

        <Layout.Section>
          <Card>
            <div style={{ padding: 16, display: "grid", gap: 12 }}>
              <Text as="h2" variant="headingMd">
                Select a product variant
              </Text>
              <TextField
                label="Variant ID"
                helpText="Paste a numeric Variant ID or a full GID (gid://shopify/ProductVariant/...)."
                value={variantInput}
                onChange={setVariantInput}
                autoComplete="off"
              />
              <InlineStack gap="300">
                <Button onClick={handleUseVariant}>Use this variant</Button>
                <Text as="span" tone="subdued">
                  Selected: {variantGid || "—"}
                </Text>
              </InlineStack>
            </div>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <div style={{ padding: 16, display: "grid", gap: 12 }}>
              <Text as="h2" variant="headingMd">
                Create checkout
              </Text>
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
