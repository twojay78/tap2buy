export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});

    const { variantId, quantity = 1 } = req.body || {};
    if (!variantId) return res.status(400).json({error: 'variantId is required'});

    const domain = process.env.NEXT_PUBLIC_STOREFRONT_DOMAIN; // e.g. my-dev-store.myshopify.com
    const token  = process.env.STOREFRONT_API_TOKEN;          // Storefront API access token (private)
    const apiVer = process.env.NEXT_PUBLIC_STOREFRONT_API_VERSION || '2024-07';

    const url = `https://${domain}/api/${apiVer}/graphql.json`;
    const mutation = `
      mutation checkoutCreate($lineItems: [CheckoutLineItemInput!]!) {
        checkoutCreate(input: { lineItems: $lineItems }) {
          checkout { id webUrl }
          userErrors { field message }
        }
      }
    `;
    const variables = { lineItems: [{ variantId, quantity: Number(quantity) }] };

    const r = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token
      },
      body: JSON.stringify({ query: mutation, variables })
    });
    const data = await r.json();

    const err = data?.data?.checkoutCreate?.userErrors?.[0]?.message;
    const webUrl = data?.data?.checkoutCreate?.checkout?.webUrl;

    if (err) return res.status(400).json({error: err});
    if (!webUrl) return res.status(500).json({error: 'No webUrl returned'});

    return res.status(200).json({ webUrl });
  } catch (e) {
    return res.status(500).json({error: e.message || 'Unknown error'});
  }
}
