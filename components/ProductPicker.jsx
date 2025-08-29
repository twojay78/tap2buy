// components/ProductPicker.jsx
import {useEffect, useState} from 'react';
import {Card, TextField, Button, Select} from '@shopify/polaris';
import {sfQuery} from '../lib/storefront';

const PRODUCTS_QUERY = `
  query Products($query:String, $first:Int=20) {
    products(first:$first, query:$query) {
      edges {
        node {
          id
          title
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

export default function ProductPicker({onPick}) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [productIdx, setProductIdx] = useState('0');
  const [variantIdx, setVariantIdx] = useState('0');

  async function load(q='') {
    setLoading(true);
    try {
      const data = await sfQuery(PRODUCTS_QUERY, { query: q || undefined, first: 20 });
      const list = (data?.products?.edges || []).map(e => e.node);
      setItems(list);
      setProductIdx('0');
      setVariantIdx('0');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const productsOptions = items.map((p, i) => ({ label: p.title, value: String(i) }));
  const variants = items[Number(productIdx)]?.variants?.edges?.map(e => e.node) || [];
  const variantsOptions = variants.map((v, i) => ({
    label: `${v.title} — ${v.price.amount} ${v.price.currencyCode}`,
    value: String(i)
  }));

  function pick() {
    const product = items[Number(productIdx)];
    const variant = variants[Number(variantIdx)];
    if (!variant) return;
    onPick({ product, variant });
  }

  return (
    <Card sectioned>
      <div style={{display:'grid', gap:12}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr auto', gap:8}}>
          <TextField label="Search products" value={search} onChange={setSearch} autoComplete="off" />
          <Button loading={loading} onClick={() => load(search)}>Search</Button>
        </div>
        <Select label="Product" options={productsOptions} value={productIdx} onChange={setProductIdx} />
        <Select label="Variant" options={variantsOptions} value={variantIdx} onChange={setVariantIdx} />
        <Button primary onClick={pick}>Use this variant</Button>
      </div>
    </Card>
  );
}
