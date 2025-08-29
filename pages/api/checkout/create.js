// pages/api/checkout/create.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { variantId, quantity = 1 } = req.body;

  if (!variantId) {
    return res.status(400).json({ error: 'variantId is required' });
  }

  try {
    const domain = process.env.NEXT_PUBLIC_STOREFRONT_DOMAIN; // e.g. mystore.myshopify.com
    const token = process.env.STOREFRONT_API_TOKEN;           // Storefront API token
    const apiVersion = process.env.NEXT_PUBLIC_STOREFRONT_API_VERSION || '2024-07';

    const url = `https://${domain}/api/${apiVersion}/graphql.json`;

    const mutation = `
      mutation checkoutCreate($lineItems: [CheckoutLineItemInput!]!) {
        checkoutCreate(input: { lineItems: $lineItems }) {
          checkout {
            webUrl
          }
          userErrors {
            message
          }
        }
      }
    `;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          lineItems: [{ variantId, quantity: parseInt(quantity, 10) }],
        },
      }),
    });

    const data = await response.json();
    const checkout = data?.data?.checkoutCreate?.checkout;
    const error = data?.data?.checkoutCreate?.userErrors?.[0]?.message;

    if (error) return res.status(400).json({ error });
    if (!checkout?.webUrl) return res.status(500).json({ error: 'No checkout URL returned' });

    return res.status(200).json({ webUrl: checkout.webUrl });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
