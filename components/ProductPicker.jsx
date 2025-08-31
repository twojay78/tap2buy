// components/ProductPicker.jsx
import { useEffect, useState } from "react";
import { Card, TextField, Button, Select, InlineStack } from "@shopify/polaris";
import { sfQuery } from "../lib/storefront";

const PRODUCTS_QUERY = `
  query Products($query:String, $first:Int=20) {
    products(first:$first, query:$query) {
      edges {
        node {
          id
          title
          featuredImage { url altText }
          variants(first:50) {
            edges {
              node {
                id
                title
                price { amount currencyCode }
              }
            }
          }
        }
      }
    }
  }
`;

export default function ProductPicker({ onPick }) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productIdx, setProductIdx] = useState("0");
  const [variantIdx, setVariantIdx] = useState("0");
  const [error, setError] = useState("");

  async function load(q = "") {
    setLoading(true);
    setError("");
    try {
      const data = await sfQuery(PRODUCTS_QUERY, { query: q || undefined, first: 20 });
      const items = (data?.products?.edges || []).map(e => e.node);
      setProducts(items);
      setProductIdx("0");
      setVariantIdx("0");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const productOptions = products.map((p, i) => ({ label: p.title, value: String(i) }));
  const variants = products[Number(productIdx)]?.variants?.edges?.map(e => e.node) || [];
  const variantOptions = variants.map((v, i) => ({
    label: `${v.title} — ${v.price.amount} ${v.price.currencyCode}`,
    value: String(i),
  }));

  function handleUse() {
    const product = products[Number(productIdx)];
    const variant = variants[Number(variantIdx)];
    if (!variant) return;
    onPick({ product, variant }); // variant.id is the full GID
  }

  return (
    <Card>
      <div style={{ padding: 16, display: "grid", gap: 12 }}>
        <InlineStack gap="200">
          <TextField
            label="Search products"
            value={search}
            onChange={setSearch}
            autoComplete="off"
          />
          <Button loading={loading} onClick={() => load(search)}>Search</Button>
        </InlineStack>

        <Select label="Product" options={productOptions} value={productIdx} onChange={setProductIdx} />
        <Select label="Variant" options={variantOptions} value={variantIdx} onChange={setVariantIdx} />

        {error ? <div style={{ color: "crimson" }}>{error}</div> : null}

        <Button primary onClick={handleUse}>Use this variant</Button>
      </div>
    </Card>
  );
}
