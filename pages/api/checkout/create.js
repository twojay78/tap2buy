// /pages/api/checkout/create.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { variantGid, quantity } = req.body;

  if (!variantGid) {
    return res.status(400).json({ error: "Missing variantId" });
  }

  try {
    const mutation = `
      mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        lineItems: [
          {
            variantId: variantGid,
            quantity: Number(quantity) || 1,
          },
        ],
        note: "Created by Tap2Buy",   // 👈 order note
        customAttributes: [
          { key: "Source", value: "Tap2Buy App" }, // 👈 marker
        ],
      },
    };

    const response = await fetch(
      `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2023-07/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query: mutation, variables }),
      }
    );

    const result = await response.json();

    if (result.errors || result.data?.checkoutCreate?.userErrors?.length) {
      console.error("Shopify Errors:", result.errors || result.data.checkoutCreate.userErrors);
      return res.status(400).json({
        error: "Shopify error",
        details: result.errors || result.data.checkoutCreate.userErrors,
      });
    }

    const checkout = result.data.checkoutCreate.checkout;

    if (!checkout?.webUrl) {
      return res.status(500).json({ error: "No checkout URL returned" });
    }

    // 👇 NEW: log the checkout URL in Vercel
    console.log("✅ Tap2Buy Checkout created:", checkout.webUrl);

    res.status(200).json({ checkoutUrl: checkout.webUrl });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
