// pages/index.js
import { useState } from "react";
import ProductPicker from "../components/ProductPicker"; // ⬅️ add this

export default function Home() {
  const [selectedVariantGid, setSelectedVariantGid] = useState("");
  const [qty, setQty] = useState(1);

  // Helper: accept either numeric ID or full GID and return GID
  const toVariantGid = (val) =>
    String(val).startsWith("gid://")
      ? val
      : `gid://shopify/ProductVariant/${val}`;

  const handleSelect = ({ variantId, quantity }) => {
    setSelectedVariantGid(toVariantGid(variantId));
    setQty(quantity);
  };

  const createCheckout = async () => {
    if (!selectedVariantGid) return alert("Pick a variant first");
    const res = await fetch("/api/auth/callback", { method: "GET" }); // keeps Vercel warm; optional
    // Call your existing endpoint that creates a checkout with Storefront GraphQL
    const resp = await fetch("/api/health"); // replace with your real checkout API if you have one
    // If you already have a function that builds the checkout URL, call it here instead.
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Zyppi Tap2Buy</h1>

      {/* picker on the right side of your UI */}
      <ProductPicker onSelect={handleSelect} />

      <div style={{ marginTop: 16 }}>
        <div><strong>Selected Variant GID:</strong> {selectedVariantGid || "—"}</div>
        <div><strong>Quantity:</strong> {qty}</div>
        <button onClick={createCheckout} disabled={!selectedVariantGid}>
          Create checkout
        </button>
      </div>
    </main>
  );
}
