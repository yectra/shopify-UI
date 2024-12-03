import { useState } from "react";
import { json, redirect } from "@remix-run/node";
import {
  useActionData,
  useNavigation,
  useSubmit,
  useNavigate,
} from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
  Card,
  Button,
  Layout,
  Page,
  Text,
  BlockStack,
  PageActions,
  InlineStack,
  TextField,
  Box,
  Banner,
  Select,
  Icon,
  EmptyState,
} from "@shopify/polaris";
import {
  ProductIcon,
  LinkIcon,
  ChevronRightIcon,
  ImageIcon,
  ProductListIcon,
} from "@shopify/polaris-icons";
import { createAffiliateLink } from "../models/AffiliateMarketing.server";

export async function loader({ request, params }) {
  const { admin } = await authenticate.admin(request);

  if (params.id === "new") {
    return json({
      destination: "product",
      title: "",
    });
  }

  return json("hi");
}

export async function action({ request, params }) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  const formData = await request.formData();
  const userId = session.userId;

  const data = {
    title: formData.get("title"),
    productId: formData.get("productId"),
    productVariantId: formData.get("productVariantId"),
    productHandle: formData.get("productHandle"),
    destination: formData.get("destination"),
    commission: formData.get("commission"),
    customPath: formData.get("customPath"),
    campaignSource: formData.get("campaignSource"),
  };

  const affiliateLink = await createAffiliateLink({
    userId,
    productName: data.productHandle,
    productId: data.productId,
    shop,
    commission: data.commission,
    customPath: data.customPath,
    campaignSource: data.campaignSource,
  });

  return redirect(`/app/affiliates/${affiliateLink.id}`);
}

export default function AffiliateLinkCreationForm() {
  const errors = useActionData()?.errors || {};
  const navigate = useNavigate();
  const nav = useNavigation();

  const isSaving = nav.state === "submitting";
  const isDeleting =
    nav.state === "submitting" && nav.formData?.get("action") === "delete";

  const [formState, setFormState] = useState({
    title: "",
    productId: "",
    productVariantId: "",
    productHandle: "",
    productTitle: "",
    productImage: "",
    productPrice: "",
    commission: "10",
    customPath: "",
    campaignSource: "direct",
  });

  const campaignSources = [
    { label: "Direct Link", value: "direct" },
    { label: "Social Media", value: "social" },
    { label: "Blog Post", value: "blog" },
    { label: "Email Campaign", value: "email" },
  ];

  const submit = useSubmit();

  async function selectProduct() {
    const products = await window.shopify.resourcePicker({
      type: "product",
      action: "select",
    });

    if (products) {
      const { images, id, variants, title, handle } = products[0];
      const price = variants[0]?.price || "0.00";

      setFormState((prev) => ({
        ...prev,
        productId: id,
        productVariantId: variants[0].id,
        productTitle: title,
        productHandle: handle,
        productAlt: images[0]?.altText,
        productImage: images[0]?.originalSrc,
        productPrice: price,
        title: `Affiliate link for ${title}`,
        customPath: handle,
      }));
    }
  }

  function handleSave() {
    const data = {
      title: formState.title,
      productId: formState.productId,
      productVariantId: formState.productVariantId,
      productHandle: formState.productHandle,
      commission: formState.commission,
      customPath: formState.customPath,
      campaignSource: formState.campaignSource,
    };

    submit(data, { method: "post" });
  }

  return (
    <Page
      backAction={{ content: "Affiliate Dashboard", url: "/app" }}
      title="Create Affiliate Link"
      subtitle="Generate a unique affiliate link for your selected product"
    >
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400" padding="400">
                <Text as="h2" variant="headingMd">
                  Select Product
                </Text>

                {!formState.productId ? (
                  <EmptyState
                    heading="No product selected"
                    action={{
                      content: "Select Product",
                      onAction: selectProduct,
                      icon: ProductListIcon,
                    }}
                    image=""
                  >
                    <p>Choose a product to create an affiliate link</p>
                  </EmptyState>
                ) : (
                  <BlockStack gap="400">
                    <Box
                      padding="400"
                      background="bg-surface-secondary"
                      borderRadius="200"
                    >
                      <InlineStack gap="400" align="center">
                        <Box
                          background="bg-surface"
                          borderRadius="200"
                          padding="200"
                          minWidth="100px"
                        >
                          {formState.productImage ? (
                            <img
                              src={formState.productImage}
                              alt={formState.productAlt || "Product image"}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <Icon source={ImageIcon} />
                          )}
                        </Box>
                        <BlockStack gap="200">
                          <Text as="h3" variant="headingSm">
                            {formState.productTitle}
                          </Text>
                          <Text as="p" variant="bodySm" color="subdued">
                            ${formState.productPrice}
                          </Text>
                        </BlockStack>
                        <Box>
                          <Button onClick={selectProduct}>Change</Button>
                        </Box>
                      </InlineStack>
                    </Box>
                  </BlockStack>
                )}
              </BlockStack>
            </Card>

            {formState.productId && (
              <BlockStack gap="500">
                <Card>
                  <BlockStack gap="400" padding="400">
                    <Text as="h2" variant="headingMd">
                      Link Settings
                    </Text>
                    <BlockStack gap="400">
                      <TextField
                        label="Link Title"
                        value={formState.title}
                        onChange={(value) =>
                          setFormState((prev) => ({ ...prev, title: value }))
                        }
                        error={errors.title}
                        autoComplete="off"
                      />
                      <TextField
                        label="Custom Path"
                        value={formState.customPath}
                        onChange={(value) =>
                          setFormState((prev) => ({
                            ...prev,
                            customPath: value,
                          }))
                        }
                        error={errors.customPath}
                        prefix={<Icon source={LinkIcon} />}
                        autoComplete="off"
                      />
                      <Select
                        label="Campaign Source"
                        options={campaignSources}
                        value={formState.campaignSource}
                        onChange={(value) =>
                          setFormState((prev) => ({
                            ...prev,
                            campaignSource: value,
                          }))
                        }
                      />
                    </BlockStack>
                  </BlockStack>
                </Card>

                {/* Preview Card */}
                <Card>
                  <BlockStack gap="400" padding="400">
                    <Text as="h2" variant="headingMd">
                      Link Preview
                    </Text>
                    <Box
                      padding="400"
                      background="bg-surface-secondary"
                      borderRadius="200"
                    >
                      <BlockStack gap="300">
                        <InlineStack align="center" gap="200">
                          <Icon source={LinkIcon} />
                          <Text as="span" variant="bodySm">
                            {`https://yourstore.com/ref/${formState.customPath}?source=${formState.campaignSource}`}
                          </Text>
                        </InlineStack>
                        <Banner status="info">
                          This link will track visits and sales for your
                          selected product.
                        </Banner>
                      </BlockStack>
                    </Box>
                  </BlockStack>
                </Card>
              </BlockStack>
            )}
          </Layout.Section>

          <Layout.Section secondary>
            <Card>
              <BlockStack gap="400" padding="400">
                <Text as="h2" variant="headingMd">
                  Link Guidelines
                </Text>
                <BlockStack gap="200">
                  <Text as="p" variant="bodySm" color="subdued">
                    • Custom paths should be unique and descriptive
                  </Text>
                  <Text as="p" variant="bodySm" color="subdued">
                    • Choose appropriate campaign sources for tracking
                  </Text>
                  <Text as="p" variant="bodySm" color="subdued">
                    • Links are automatically activated upon creation
                  </Text>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        <Layout.Section>
          <PageActions
            primaryAction={{
              content: "Create Affiliate Link",
              loading: isSaving,
              disabled: !formState.productId || isSaving || isDeleting,
              onAction: handleSave,
            }}
          />
        </Layout.Section>
      </BlockStack>
    </Page>
  );
}