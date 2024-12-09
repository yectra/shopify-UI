import React, { useState } from "react";
import {
  Card,
  BlockStack,
  Text,
  TextField,
  Button,
  Banner,
} from "@shopify/polaris";

export default function Commissions() {
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

  return (
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
  );
}