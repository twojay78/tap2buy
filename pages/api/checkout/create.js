// pages/api/checkout/create.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { variantId, quantity } = req.body || {};
    if (!variantId) return res.status(400).json({ error: "Missing variantId" });

    const qty = Number(quantity) > 0 ? Number(quantity) : 1;

    const domain = process.env.SHOPIFY_STORE_DOMAIN; // e.g. myshop.myshopify.com
    const token  = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    if (!domain || !token) {
      return res.status(500).json({ error: "Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN" });
    }

    const mutation = `
      mutation CreateCheckout($variantId: ID!, $quantity: Int!) {
        checkoutCreate(input: { lineItems: [{ variantId: $variantId, quantity: $quantity }] }) {
          checkout { webUrl }
          userErrors { field message }
        }
      }
    `;

    const sfRes = await fetch(`https://${domain}/api/2024-07/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query: mutation,
        variables: { variantId, quantity: qty },
      }),
    });

    const data = await sfRes.json().catch(() => ({}));
    if (!sfRes.ok) return res.status(sfRes.status).json({ error: `Storefront API ${sfRes.status}`, data });

    const errs = data?.data?.checkoutCreate?.userErrors;
    if (Array.isArray(errs) && errs.length) {
      return res.status(400).json({ error: errs.map(e => e.message).join(", ") });
    }

    const url = data?.data?.checkoutCreate?.checkout?.webUrl;
    if (!url) return res.status(500).json({ error: "No checkout URL returned", data });

    return res.status(200).json({ checkoutUrl: url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
