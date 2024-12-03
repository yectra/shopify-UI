
import {
    Card,
    Layout,
    Page,
    Form,
    FormLayout,
    TextField,
    Button,
    Select,
    Checkbox,
    BlockStack,
    InlineStack,
    Text,
    Box,
    Icon,
    Banner,
    Toast,
    Frame,
  } from "@shopify/polaris";
  import {
    DomainIcon,
    XIcon,
    LogoInstagramIcon,
    LogoYoutubeIcon,
    BlogIcon,
  } from "@shopify/polaris-icons";
  import { useCallback, useState, useEffect } from "react";
  import { json } from "@remix-run/node";
  import { useSubmit, useActionData, useNavigate } from "@remix-run/react";
  import { createAffiliateUser } from "../models/AffiliateMarketing.server";
  
  
  
    
  export async function loader() {
      try {
        // Return minimal defaults with proper response format
        return json({
          status: "success",
          data: {
            monthlyTraffic: "0-5k",
            experience: "Beginner"
          }
        });
      } catch (error) {
        console.error("Loader error:", error);
        return json({ 
          status: "error",
          message: "Failed to load form defaults" 
        }, { status: 500 });
      }
    }
    
    
    // Action function - handles form submission
    export async function action({ request }) {
      try {
        if (request.method !== "POST") {
          return json({ error: "Method not allowed" }, { status: 405 });
        }
    
        const formData = await request.formData();
        const data = Object.fromEntries(formData);
    
        // Validate required fields
        const errors= {};
        if (!data.firstName) errors.firstName = "First name is required";
        if (!data.lastName) errors.lastName = "Last name is required";
        if (!data.email) errors.email = "Email is required";
        if (data.agreesToTerms !== "true") 
          errors.agreesToTerms = "You must agree to the terms";
    
        if (Object.keys(errors).length > 0) {
          return json({ errors }, { status: 400 });
        }
    
        // Process the data
        const affiliateData = {
          userId: 124,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone ? data.phone.replace(/\D/g, "") : null,
          websiteTraffic: parseInt(data.monthlyTraffic) || 0,
          marketingExperience: data.experience || "Beginner",
          promotionalMethods: [
            {
              instagramUrls: data["socialLinks.instagram"] 
                ? [data["socialLinks.instagram"]] 
                : [],
              youtubeUrls: data["socialLinks.youtube"] 
                ? [data["socialLinks.youtube"]] 
                : [],
              twitterUrls: data["socialLinks.x"] 
                ? [data["socialLinks.x"]] 
                : [],
              blogUrls: data["socialLinks.blog"] 
                ? [data["socialLinks.blog"]] 
                : [],
              websiteUrls: data["socialLinks.website"] 
                ? [data["socialLinks.website"]] 
                : [],
            },
          ],
        };
    
        // Create the affiliate user
        await createAffiliateUser(affiliateData);
    
        // Return success response
        return json({
          success: true,
          message: "Application submitted successfully!"
        });
    
      } catch (error) {
        console.error("Server error:", error);
        return json(
          { error: "An error occurred while processing your request" },
          { status: 500 }
        );
      }
    }
  
  export default function CreateUser() {
    const actionData = useActionData();
    const submit = useSubmit();
    const navigate = useNavigate();
  
    const [toastActive, setToastActive] = useState(false);
    const [toastContent, setToastContent] = useState("");
    const [toastError, setToastError] = useState(false);
  
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [selectedMethods, setSelectedMethods] = useState([]);
    const [socialLinks, setSocialLinks] = useState({
      instagram: "",
      youtube: "",
      x: "",
      blog: "",
      website: "",
    });
    const [monthlyTraffic, setMonthlyTraffic] = useState("");
    const [experience, setExperience] = useState("");
    const [agreesToTerms, setAgreesToTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    useEffect(() => {
      if (actionData?.error) {
        setToastContent(actionData.error);
        setToastError(true);
        setToastActive(true);
        setIsSubmitting(false);
      } else if (actionData?.success) {
        setToastContent(actionData.message);
        setToastError(false);
        setToastActive(true);
        setTimeout(() => {
          navigate("/app");
        }, 2000);
      }
    }, [actionData, navigate]);
  
    const promotionalMethodOptions = [
      { label: "Social Media Marketing", value: "social" },
      { label: "Blogging", value: "blog" },
      { label: "Website/Display Advertising", value: "display" },
    ];
  
    const trafficOptions = [
      { label: "0-5,000 visitors", value: "0-5k" },
      { label: "5,000-20,000 visitors", value: "5k-20k" },
      { label: "20,000-50,000 visitors", value: "20k-50k" },
      { label: "50,000+ visitors", value: "50k+" },
    ];
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      setIsSubmitting(true);
  
      const formData = new FormData(event.target);
      formData.append("agreesToTerms", agreesToTerms.toString());
  
      // Add social links to formData
      Object.entries(socialLinks).forEach(([key, value]) => {
        formData.append(`socialLinks.${key}`, value);
      });
  
      try {
        submit(formData, { method: "post" });
      } catch (error) {
        setToastContent("An error occurred while submitting the form");
        setToastError(true);
        setToastActive(true);
        setIsSubmitting(false);
      }
    };
  
    const handleMethodChange = (value, checked) => {
      setSelectedMethods(
        checked
          ? [...selectedMethods, value]
          : selectedMethods.filter((method) => method !== value),
      );
    };
  
    const updateSocialLink = (platform, value) => {
      setSocialLinks((prev) => ({
        ...prev,
        [platform]: value,
      }));
    };
  
    const toggleActive = useCallback(
      () => setToastActive((active) => !active),
      [],
    );
  
    return (
      <Frame>
        <Page
          backAction={{ content: "Dashboard", url: "/app" }}
          title="Become an Affiliate"
          subtitle="Join our affiliate program and start earning commissions"
        >
          {toastActive && (
            <Toast
              content={toastContent}
              error={toastError}
              onDismiss={toggleActive}
              duration={4000}
            />
          )}
          <BlockStack gap="500">
            <Banner title="Important" status="info">
              Please complete all required fields and provide accurate information
              to expedite your application process.
            </Banner>
  
            <Layout>
              <Layout.Section>
                <Form onSubmit={handleSubmit}>
                  <BlockStack gap="500">
                    {/* Personal Information Card */}
                    <Card>
                      <BlockStack gap="400" padding="400">
                        <Text as="h2" variant="headingMd">
                          Personal Information
                        </Text>
                        <FormLayout>
                          <InlineStack gap="300" wrap={false}>
                            <Box width="50%">
                              <TextField
                                label="First Name"
                                name="firstName"
                                value={firstName}
                                onChange={setFirstName}
                                autoComplete="given-name"
                                required
                                error={actionData?.errors?.firstName}
                              />
                            </Box>
                            <Box width="50%">
                              <TextField
                                label="Last Name"
                                name="lastName"
                                value={lastName}
                                onChange={setLastName}
                                autoComplete="family-name"
                                required
                                error={actionData?.errors?.lastName}
                              />
                            </Box>
                          </InlineStack>
                          <InlineStack gap="300" wrap={false}>
                            <Box width="50%">
                              <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={setEmail}
                                autoComplete="email"
                                required
                                error={actionData?.errors?.email}
                              />
                            </Box>
                            <Box width="50%">
                              <TextField
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                value={phone}
                                onChange={setPhone}
                                autoComplete="tel"
                                error={actionData?.errors?.phone}
                              />
                            </Box>
                          </InlineStack>
                        </FormLayout>
                      </BlockStack>
                    </Card>
  
                    {/* Promotional Methods Card */}
                    <Card>
                      <BlockStack gap="400" padding="400">
                        <Text as="h2" variant="headingMd">
                          Promotional Methods
                        </Text>
                        <BlockStack gap="400">
                          <Text as="p" variant="bodyMd" color="subdued">
                            Select all methods you plan to use for promotion
                          </Text>
  
                          {promotionalMethodOptions.map((option) => (
                            <Checkbox
                              key={option.value}
                              label={option.label}
                              checked={selectedMethods.includes(option.value)}
                              onChange={(checked) =>
                                handleMethodChange(option.value, checked)
                              }
                            />
                          ))}
  
                          {selectedMethods.includes("social") && (
                            <BlockStack gap="300">
                              <Text as="h3" variant="headingSm">
                                Social Media Profiles
                              </Text>
                              <FormLayout>
                                <TextField
                                  label="Instagram Profile URL"
                                  value={socialLinks.instagram}
                                  onChange={(value) =>
                                    updateSocialLink("instagram", value)
                                  }
                                  prefix={<Icon source={LogoInstagramIcon} />}
                                />
                                <TextField
                                  label="YouTube Channel URL"
                                  value={socialLinks.youtube}
                                  onChange={(value) =>
                                    updateSocialLink("youtube", value)
                                  }
                                  prefix={<Icon source={LogoYoutubeIcon} />}
                                />
                                <TextField
                                  label="X URL(twitter)"
                                  value={socialLinks.x}
                                  onChange={(value) =>
                                    updateSocialLink("x", value)
                                  }
                                  prefix={<Icon source={XIcon} />}
                                />
                              </FormLayout>
                            </BlockStack>
                          )}
  
                          {selectedMethods.includes("blog") && (
                            <TextField
                              label="Blog URL"
                              value={socialLinks.blog}
                              onChange={(value) =>
                                updateSocialLink("blog", value)
                              }
                              prefix={<Icon source={BlogIcon} />}
                            />
                          )}
  
                          {selectedMethods.includes("display") && (
                            <TextField
                              label="Website URL"
                              value={socialLinks.website}
                              onChange={(value) =>
                                updateSocialLink("website", value)
                              }
                              prefix={<Icon source={DomainIcon} />}
                            />
                          )}
                        </BlockStack>
                      </BlockStack>
                    </Card>
  
                    {/* Experience & Traffic Card */}
                    <Card>
                      <BlockStack gap="400" padding="400">
                        <Text as="h2" variant="headingMd">
                          Experience & Traffic
                        </Text>
                        <FormLayout>
                          <Select
                            label="Monthly Website Traffic"
                            name="monthlyTraffic"
                            options={trafficOptions}
                            value={monthlyTraffic}
                            onChange={setMonthlyTraffic}
                          />
                          <TextField
                            label="Previous Affiliate Marketing Experience"
                            name="experience"
                            value={experience}
                            onChange={setExperience}
                            multiline={3}
                            placeholder="Please describe your previous experience with affiliate marketing, if any..."
                          />
                        </FormLayout>
                      </BlockStack>
                    </Card>
  
                    {/* Terms & Conditions Card */}
                    <Card>
                      <BlockStack gap="400" padding="400">
                        <Checkbox
                          label="I agree to the terms and conditions of the affiliate program"
                          checked={agreesToTerms}
                          onChange={setAgreesToTerms}
                          error={actionData?.errors?.agreesToTerms}
                        />
                        <Button
                          submit
                          primary
                          disabled={!agreesToTerms || isSubmitting}
                          loading={isSubmitting}
                          fullWidth
                        >
                          {isSubmitting ? "Submitting..." : "Submit Application"}
                        </Button>
                      </BlockStack>
                    </Card>
                  </BlockStack>
                </Form>
              </Layout.Section>
  
              {/* Sidebar Information */}
              <Layout.Section secondary>
                <Card>
                  <BlockStack gap="400" padding="400">
                    <Text as="h2" variant="headingMd">
                      Application Tips
                    </Text>
                    <BlockStack gap="300">
                      <Text as="p" variant="bodySm" color="subdued">
                        • Provide accurate contact information
                      </Text>
                      <Text as="p" variant="bodySm" color="subdued">
                        • Include all relevant social media profiles
                      </Text>
                      <Text as="p" variant="bodySm" color="subdued">
                        • Be specific about your marketing experience
                      </Text>
                      <Text as="p" variant="bodySm" color="subdued">
                        • Double-check all entered information
                      </Text>
                    </BlockStack>
                  </BlockStack>
                </Card>
              </Layout.Section>
            </Layout>
          </BlockStack>
        </Page>
      </Frame>
    );
  }
  