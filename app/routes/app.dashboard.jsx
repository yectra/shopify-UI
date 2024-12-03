import React, { useState } from "react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  Button,
  TextField,
  Banner,
} from "@shopify/polaris";
import CustomerDiscounts from "./dashboard/app.customerDiscounts";
import Settings from "./dashboard/app.settings" 

export default function Dashboard() {
  const [activePage, setActivePage] = useState("commissions");

  const [affiliateId, setAffiliateId] = useState("");
  const [commissionAmount, setCommissionAmount] = useState("");
  const [payoutDate, setPayoutDate] = useState("");

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted with values:", {
      affiliateId,
      commissionAmount,
      payoutDate,
    });
  };

  const handleReset = () => {
    setAffiliateId("");
    setCommissionAmount("");
    setPayoutDate("");
  };

  const renderContent = () => {
    switch (activePage) {
      case "commissions":
        return (
          <BlockStack gap="500">
            <Banner title="Important" status="info">
              <Text as="p" variant="bodySm">
                Ensure all commission details are accurate for smooth payouts.
              </Text>
            </Banner>
            <Card>
              <BlockStack gap="400" padding="400">
                <Text as="h2" variant="headingMd">
                  Commission Details
                </Text>
                <form onSubmit={handleFormSubmit}>
                  <BlockStack gap="300">
                    <TextField
                      label="Affiliate ID"
                      name="affiliateId"
                      type="text"
                      value={affiliateId}
                      onChange={setAffiliateId}
                      autoComplete="off"
                      placeholder="Enter your affiliate ID"
                    />
                    <TextField
                      label="Commission Amount"
                      name="commissionAmount"
                      type="number"
                      prefix="$"
                      value={commissionAmount}
                      onChange={setCommissionAmount}
                      autoComplete="off"
                      placeholder="Enter the commission amount"
                    />
                    <TextField
                      label="Payout Date"
                      name="payoutDate"
                      type="date"
                      value={payoutDate}
                      onChange={setPayoutDate}
                      autoComplete="off"
                    />
                  </BlockStack>
                  <br />
                  <Button submit primary>
                    Submit
                  </Button>
                  <Button destructive onClick={handleReset}>
                    Reset
                  </Button>
                </form>
              </BlockStack>
            </Card>
          </BlockStack>
        );
      case "customerDiscounts":
        return <CustomerDiscounts />;
      case "settings":
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <Page title="Dashboard" subtitle="Manage your affiliate program">
      <Layout>
        <Layout.Section>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ flex: 2 }}>
              {renderContent()}
            </div>
            <div style={{ flex: 1, marginLeft: "20px" }}>
              <Card>
                <BlockStack gap="300" padding="400">
                  <Text as="h2" variant="headingMd">
                    Navigation
                  </Text>
                  <BlockStack gap="200">
                    <Button
                      size="slim"
                      onClick={() => setActivePage("commissions")}
                      primary={activePage === "commissions"}
                    >
                      Commissions
                    </Button>
                    <Button
                      size="slim"
                      onClick={() => setActivePage("customerDiscounts")}
                      primary={activePage === "customerDiscounts"}
                    >
                      Customer Discounts
                    </Button>
                    <Button
                      size="slim"
                      onClick={() => setActivePage("settings")}
                      primary={activePage === "settings"}
                    >
                      Settings
                    </Button>
                  </BlockStack>
                </BlockStack>
              </Card>
            </div>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
} 