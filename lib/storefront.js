// lib/storefront.js
export async function sfQuery(query, variables = {}) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN; // e.g. myshop.myshopify.com
  const token  = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const apiVer = '2024-07';

  if (!domain || !token) {
    throw new Error("Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN");
  }

  const res = await fetch(`https://${domain}/api/${apiVer}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (!res.ok || json.errors) {
    const msg = json.errors?.map(e => e.message).join(", ") || `HTTP ${res.status}`;
    throw new Error(`Storefront API error: ${msg}`);
  }
  return json.data;
}
