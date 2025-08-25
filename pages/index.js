import { Page, Layout, Card, Text } from "@shopify/polaris";

export default function HomePage() {
  return (
    <Page title="Zyppi Tap2Buy">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text variant="headingMd">Welcome to Zyppi Tap2Buy 🎉</Text>
            <p>Your app is now connected to Shopify and ready to build!</p>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
