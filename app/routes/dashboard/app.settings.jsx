import React, { useState } from "react";
import { Card, BlockStack, TextField, Text, Button } from "@shopify/polaris";

export default function Settings() {
  const [programName, setProgramName] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleProgramNameChange = (value) => {
    setProgramName(value);
    setCharCount(value.length);
  };

  return (
    <Card>
      <BlockStack gap="400" padding="400">
        <Text as="h2" variant="headingMd">
          Settings
        </Text>
        <Text as="p" variant="bodyMd">
          Configure your preferences and update your profile settings.
        </Text>
        <Text as="h3" variant="headingSm">
          Program Name
        </Text>
        <TextField
          value={programName}
          onChange={handleProgramNameChange}
          label="Enter program name"
          maxLength={100}
          helperText={`${charCount}/100 characters`}
        />
        <Text as="h3" variant="headingSm">
          Default Affiliate Link
        </Text>
        <Text as="p" variant="bodyMd">
          Any product/collection link from your store is valid.
        </Text>
        <TextField
          value="https://affiliatemarketing-test.myshopify.com"
          disabled
        />
      </BlockStack>
      <br />
      <Button>Save</Button>
    </Card>
  );
}
