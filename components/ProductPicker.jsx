// components/ProductPicker.js
import { useState } from "react";

export default function ProductPicker({ onSelect }) {
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!variantId) return;
    onSelect({ variantId, quantity: Number(quantity) || 1 });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
      <h3>Select a product variant</h3>

      <label>Variant ID (GID or numeric)</label>
      <input
        type="text"
        value={variantId}
        onChange={(e) => setVariantId(e.target.value)}
        placeholder="gid://shopify/ProductVariant/1234567890 or 1234567890"
        required
      />

      <label>Quantity</label>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <button type="submit">Use this variant</button>
    </form>
  );
}
