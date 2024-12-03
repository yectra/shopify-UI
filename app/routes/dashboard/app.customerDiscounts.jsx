import React, { useState } from "react";
import { Card, BlockStack, Text, TextField, Select, Button, Checkbox, RadioButton } from "@shopify/polaris";

export default function CustomerDiscounts() {
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [applyTo, setApplyTo] = useState("all_products");
  const [searchValue, setSearchValue] = useState("");
  const [minimumRequirement, setMinimumRequirement] = useState("no_minimum");
  const [minimumPurchaseValue, setMinimumPurchaseValue] = useState("");
  const [combinationSelections, setCombinationSelections] = useState({
    product_discounts: false,
    order_discounts: false,
    shipping_discounts: false,
  });
  const [customerEligibility, setCustomerEligibility] = useState("all_customers"); // New state for customer eligibility

  const handleDiscountTypeChange = (value) => setDiscountType(value);
  const handleDiscountValueChange = (value) => setDiscountValue(value);
  const handleApplyToChange = (value) => {
    setApplyTo(value);
    setSearchValue(""); 
  };
  const handleSearchValueChange = (value) => setSearchValue(value);
  const handleMinimumRequirementChange = (value) => setMinimumRequirement(value);
  const handleMinimumPurchaseValueChange = (value) => setMinimumPurchaseValue(value);
  const handleCustomerEligibilityChange = (value) => setCustomerEligibility(value); // Handler for customer eligibility

  const toggleCombinationSelection = (type) => {
    setCombinationSelections((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const getTextFieldPrefix = () => {
    if (discountType === "percentage") return "%";
    if (discountType === "fixed") return "$";
    return null;
  };

  return (
    <Card>
      <BlockStack gap="300" padding="300">
        <Text as="h3" variant="headingSm">
          Discount Rules
        </Text>
        <Text as="p" variant="bodyMd">
          Discount Value
        </Text>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Select
            label="Select discount type"
            options={[
              { label: "Percentage", value: "percentage" },
              { label: "Fixed Amount", value: "fixed" },
              { label: "Free Shipping", value: "free_shipping" },
            ]}
            onChange={handleDiscountTypeChange}
            value={discountType}
          />
          {discountType !== "free_shipping" && (
            <TextField
              label="Enter value"
              value={discountValue}
              onChange={handleDiscountValueChange}
              placeholder="Enter discount value"
              prefix={getTextFieldPrefix()}
              autoComplete="off"
            />
          )}
        </div>
        <Text as="p" variant="bodyMd">
          Apply to
        </Text>
        <Select
          label="Select products to apply the discount"
          options={[
            { label: "All Products", value: "all_products" },
            { label: "Specific Products", value: "specific_products" },
            { label: "Specific Collections", value: "specific_collections" },
          ]}
          onChange={handleApplyToChange}
          value={applyTo}
        />
        {applyTo !== "all_products" && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <TextField
              label=""
              value={searchValue}
              onChange={handleSearchValueChange}
              placeholder={
                applyTo === "specific_products"
                  ? "Search products"
                  : "Search collections"
              }
              autoComplete="off"
            />
            <Button onClick={() => console.log("Browse clicked")} primary>
              Browse
            </Button>
          </div>
        )}
        <Text as="h3" variant="headingSm">
          Minimum Purchase Amount
        </Text>
        <BlockStack>
          <RadioButton
            label="No minimum requirements"
            checked={minimumRequirement === "no_minimum"}
            onChange={() => handleMinimumRequirementChange("no_minimum")}
          />
          <RadioButton
            label="Minimum purchase requirements"
            checked={minimumRequirement === "minimum_purchase"}
            onChange={() => handleMinimumRequirementChange("minimum_purchase")}
          />
        </BlockStack>
        {minimumRequirement === "minimum_purchase" && (
          <TextField
            label=""
            value={minimumPurchaseValue}
            onChange={handleMinimumPurchaseValueChange}
            placeholder="Enter minimum purchase amount"
            prefix="$"
            autoComplete="off"
          />
        )}
        <Text as="h3" variant="headingSm">
          Customer Eligibility
        </Text>
        <BlockStack>
          <RadioButton
            label="All customers"
            checked={customerEligibility === "all_customers"}
            onChange={() => handleCustomerEligibilityChange("all_customers")}
          />
          <RadioButton
            label="Specific customer segments"
            checked={customerEligibility === "specific_customer_segments"}
            onChange={() => handleCustomerEligibilityChange("specific_customer_segments")}
          />
        </BlockStack>
        {customerEligibility === "specific_customer_segments" && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "10px" }}>
            <TextField
              label=""
              placeholder="Search customer segments"
              value={searchValue}
              onChange={handleSearchValueChange}
              autoComplete="off"
            />
            <Button onClick={() => console.log("Browse clicked")} primary>
              Browse
            </Button>
          </div>
        )}

        <Text as="h3" variant="headingSm">
          Combinations
        </Text>
        <BlockStack>
          <Checkbox
            label="Product Discounts"
            checked={combinationSelections.product_discounts}
            onChange={() => toggleCombinationSelection("product_discounts")}
          />
          <Checkbox
            label="Order Discounts"
            checked={combinationSelections.order_discounts}
            onChange={() => toggleCombinationSelection("order_discounts")}
          />
          <Checkbox
            label="Shipping Discounts"
            checked={combinationSelections.shipping_discounts}
            onChange={() => toggleCombinationSelection("shipping_discounts")}
          />
        </BlockStack>
      </BlockStack>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
        <Button primary>Save</Button>
      </div>
    </Card>
  );
}
