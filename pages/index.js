import { useState } from "react";

export default function Home() {
  const [variantInput, setVariantInput] = useState("");
  const [variantGid, setVariantGid] = useState("");
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");

  const useVariant = () => {
    let val = variantInput.trim();
    if (!val) {
      setMessage("Please enter a variant ID");
      return;
    }
    // Accept numeric or full GID
    if (/^\d+$/.test(val)) {
      val = `gid://shopify/ProductVariant/${val}`;
    }
    setVariantGid(val);
    setMessage(`Selected: ${val}`);
  };

const createCheckout = async () => {
  if (!variantGid) {
    setMessage("Please select a variant first");
    return;
  }

  try {
async function handleCreateCheckout() {
  if (!selectedVariantGid) {
    alert('Please select a variant first');
    return;
  }

  try {
    const res = await fetch('/api/checkout/create', {
      method: 'POST',                              // 👈 important: POST not GET
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        variantGid: selectedVariantGid,            // the variant ID from Shopify
        quantity: Number(quantity || 1),
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Request failed (${res.status}): ${text}`);
    }

    const data = await res.json();
    window.open(data.checkoutUrl, '_blank');       // open checkout in new tab
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

 

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Tap2Buy</h1>

      <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8, marginTop: 12 }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
          Select a product variant
        </label>

        <input
          placeholder="Variant ID (GID or number)"
          value={variantInput}
          onChange={(e) => setVariantInput(e.target.value)}
          style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 6 }}
        />

        <button onClick={useVariant} style={{ marginTop: 10, padding: "8px 12px" }}>
          Use this variant
        </button>

        <div style={{ marginTop: 12, color: "#555" }}>
          <strong>Selected Variant GID:</strong> {variantGid || "—"}
        </div>
      </div>

      <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8, marginTop: 12 }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>Quantity</label>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          style={{ width: 120, padding: 10, border: "1px solid #ccc", borderRadius: 6 }}
        />
        <div>
          <button onClick={createCheckout} style={{ marginTop: 12, padding: "10px 14px" }}>
            Create checkout
          </button>
        </div>
      </div>

      {message && <p style={{ marginTop: 12, color: message.startsWith("Error") ? "crimson" : "#333" }}>{message}</p>}
    </div>
  );
}
