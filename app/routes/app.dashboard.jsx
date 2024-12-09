import React, { useState } from "react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  Button,
  Icon,
  TextField,
  Select,
  Modal,
} from "@shopify/polaris";
import { ArrowLeftIcon } from "@shopify/polaris-icons";
import CustomerDiscounts from "./dashboard/app.customerDiscounts";
import Settings from "./dashboard/app.settings";
import Commissions from "./dashboard/app.commissions";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("");
  const [showProgramFields, setShowProgramFields] = useState(false);
  const [programName, setProgramName] = useState("");
  const [programDescription, setProgramDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [programType, setProgramType] = useState("");
  const [modalActive, setModalActive] = useState(false); // Modal state for discard confirmation

  const renderContent = () => {
    switch (activePage) {
      case "commissions":
        return <Commissions />;
      case "customerDiscounts":
        return <CustomerDiscounts />;
      case "settings":
        return <Settings />;
      default:
        return null;
    }
  };

  // Handler for showing the modal to confirm discard
  const handleDiscard = () => {
    setModalActive(true); // Open the modal for discard confirmation
  };

  // Reset form and close modal
  const handleDiscardConfirm = () => {
    setProgramName("");
    setProgramDescription("");
    setStartDate("");
    setEndDate("");
    setProgramType("");
    setShowProgramFields(false); // Close the form
    setModalActive(false); // Close the modal
  };

  // Close the modal without discarding the form
  const handleDiscardCancel = () => {
    setModalActive(false); // Just close the modal
  };

  return (
    <Page title="Dashboard" subtitle="Manage your affiliate program">
      <Layout>
        <Layout.Section>
          {activePage ? (
            // Only show the selected page content
            <div>
              <div style={{ marginBottom: "20px" }}>
                <Button
                  icon={<Icon source={ArrowLeftIcon} />}
                  onClick={() => setActivePage("")}
                  plain
                >
                  Back to Dashboard
                </Button>
              </div>
              {renderContent()}
            </div>
          ) : (
            // Show the main dashboard content if no active page is selected
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ flex: 2 }}>
                <Card style={{ marginTop: "20px", padding: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text as="h2" variant="headingMd">
                      Programs
                    </Text>
                    <Button
                      variant="primary"
                      monochrome
                      style={{ backgroundColor: "black", color: "white" }}
                      onClick={() => setShowProgramFields(true)} // Clicking "Create Program" always shows the form
                    >
                      Create Program
                    </Button>
                  </div>
                  {showProgramFields && (
                    <div style={{ marginTop: "20px" }}>
                      <BlockStack gap="6">
                        <div style={{ marginBottom: "14px" }}>
                          <Text>Name of the program</Text>
                          <TextField
                            labelHidden
                            placeholder="Program Name"
                            value={programName}
                            onChange={(value) => setProgramName(value)}
                          />
                        </div>

                        <div style={{ marginBottom: "14px" }}>
                          <Text>Description</Text>
                          <TextField
                            labelHidden
                            placeholder="Enter program description"
                            value={programDescription}
                            onChange={(value) => setProgramDescription(value)}
                            multiline
                          />
                        </div>

                        <div style={{ marginBottom: "14px" }}>
                          <Text>Start Date</Text>
                          <TextField
                            type="date"
                            value={startDate}
                            onChange={(value) => setStartDate(value)}
                          />
                        </div>

                        <div style={{ marginBottom: "14px" }}>
                          <Text>End Date</Text>
                          <TextField
                            type="date"
                            value={endDate}
                            onChange={(value) => setEndDate(value)}
                          />
                        </div>

                        <div style={{ marginBottom: "14px" }}>
                          <Text>Program Type</Text>
                          <Select
                            labelHidden
                            options={[
                              { label: "Referral", value: "referral" },
                              { label: "Loyalty", value: "loyalty" },
                              { label: "Partner", value: "partner" },
                            ]}
                            value={programType}
                            onChange={(value) => setProgramType(value)}
                          />
                        </div>
                      </BlockStack>
                    </div>
                  )}
                  {/* Add Save and Discard buttons here */}
                  {showProgramFields && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                      }}
                    >
                      <Button
                        variant="primary"
                        tone="critical"
                        onClick={handleDiscard} // Show the discard modal when clicked
                      >
                        Discard
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => {
                          console.log("Saved program data:", {
                            programName,
                            programDescription,
                            startDate,
                            endDate,
                            programType,
                          });
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  )}
                </Card>
                <br></br>

                {/* Add Program History card */}
                <Card title="Program History" sectioned>
                  <Text variant="headingSm">Program History</Text>
                  <Text variant="bodyMd">
                    Here you can see the history of all programs created.
                  </Text>
                </Card>
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
          )}

          {/* Discard Confirmation Modal */}
          <Modal
            open={modalActive}
            onClose={handleDiscardCancel}
            title="Are you sure?"
            primaryAction={{
              content: "Approve",
              onAction: handleDiscardConfirm, // Reset the form when approved
            }}
            secondaryActions={[
              {
                content: "Cancel",
                onAction: handleDiscardCancel, 
              },
            ]}
          >
            <Modal.Section>
              <Text variant="bodyMd">
                Are you sure you want to discard the changes?
              </Text>
            </Modal.Section>
          </Modal>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
