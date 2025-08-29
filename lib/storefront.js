// lib/storefront.js
export async function shopifyFetch(query, variables = {}) {
  const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2023-07/graphql.json`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    console.error("Shopify API error:", res.statusText);
    throw new Error("Shopify Storefront API request failed");
  }

  const { data, errors } = await res.json();
  if (errors) {
    console.error("Shopify GraphQL errors:", errors);
    throw new Error("Shopify GraphQL returned errors");
  }

  return data;
}
