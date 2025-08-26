// pages/index.js
import { Page, Card, Text, Button } from '@shopify/polaris';

export default function Home() {
  async function ping() {
    try {
      await fetch('/api/health');
      alert('API OK');
    } catch (e) {
      alert('API error');
    }
  }

  return (
    <Page title="Zyppi Tap2Buy">
      <Card sectioned>
        <Text as="h2" variant="headingMd">Zyppi Tap2Buy</Text>
        <p style={{ marginTop: 12 }}>
          Polaris is loaded. This page is served from Vercel and embedded in Shopify.
        </p>
        <div style={{ height: 12 }} />
        <Button onClick={ping}>Ping API</Button>
      </Card>
    </Page>
  );
}
