// pages/api/create.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { variantId, quantity } = req.body || {};
    if (!variantId) return res.status(400).json({ error: "Missing variantId" });

    const qty = Number(quantity) > 0 ? Number(quantity) : 1;

    const domain = process.env.SHOPIFY_STORE_DOMAIN; // e.g. "zyppitap2buy.myshopify.com"
    const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!domain || !token) {
      return res.status(500).json({ error: "Missing Shopify env vars" });
    }

    const url = `https://${domain}/api/2024-07/graphql.json`;

    const mutation = `
      mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout { webUrl id }
          userErrors { field message }
        }
      }
    `;

    const variables = {
      input: {
        lineItems: [{ variantId, quantity: qty }],
        // you can add email, shippingAddress, etc. later
      },
    };

    const sfRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    const data = await sfRes.json().catch(() => ({}));

    if (!sfRes.ok) {
      return res
        .status(sfRes.status)
        .json({ error: `Shopify error ${sfRes.status}`, details: data });
    }

    const payload = data?.data?.checkoutCreate;
    const webUrl = payload?.checkout?.webUrl;
    const errs = payload?.userErrors?.length ? payload.userErrors : null;

    if (errs?.length) {
      return res.status(400).json({ error: "CheckoutCreate userErrors", details: errs });
    }
    if (!webUrl) {
      return res.status(500).json({ error: "No checkout URL returned", details: data });
    }

    return res.status(200).json({ checkoutUrl: webUrl });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Unknown server error" });
  }
}
