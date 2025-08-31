// pages/api/checkout/create.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { variantGid, quantity } = req.body || {};
    if (!variantGid) {
      return res.status(400).json({ error: 'Missing variantId' });
    }

    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!domain || !token) {
      return res.status(500).json({ error: 'Missing Shopify env vars' });
    }

    const query = `
      mutation CheckoutCreate($lineItems: [CheckoutLineItemInput!]!) {
        checkoutCreate(input: { lineItems: $lineItems }) {
          checkout {
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
      lineItems: [
        {
          quantity: Number(quantity || 1),
          variantId: variantGid, // full GID
        },
      ],
    };

    const resp = await fetch(`https://${domain}/api/2024-07/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await resp.json();

    // Optional: log for debugging (view in Vercel runtime logs)
    console.log('checkoutCreate response', JSON.stringify(json));

    const errors = json?.data?.checkoutCreate?.userErrors;
    const url = json?.data?.checkoutCreate?.checkout?.webUrl;

    if (errors && errors.length) {
      return res.status(400).json({ error: errors.map(e => e.message).join(', ') });
    }

    if (!url) {
      return res.status(500).json({ error: 'No checkout URL returned' });
    }

    return res.status(200).json({ checkoutUrl: url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
