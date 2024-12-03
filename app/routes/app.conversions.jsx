import React, { useState } from 'react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import {
  Page,
  Card,
  Tabs,
  Filters,
  DataTable,
  TextField,
  Link,
  Icon,
} from '@shopify/polaris';
import {

  MobileIcon as MobileMajor,

} from '@shopify/polaris-icons';

export const loader = async () => {
  const clicks = [
    {
      id: '1',
      date: 'Nov 7 at 4:54 pm',
      insights: ['desktop', 'mobile', 'tablet'],
      affiliate: { name: 'Deepak S', initials: 'D' },
      referralSite: 'https://quickstart-8a578432.myshopify.com/?bg_ref=0Rm20uMFwc',
      destinationUrl: 'https://quickstart-8a578432.myshopify.com/?bg_ref=0Rm20uMFwc',
      ip: '2401:4900:8827',
      country: 'IN',
    },
  ];

  const customers = [
    {
      id: '1',
      date: 'Nov 8 at 2:30 pm',
      name: 'John Doe',
      email: 'john.doe@example.com',
      orderTotal: '$150.00',
      affiliate: { name: 'Sarah M', initials: 'S' },
      country: 'US',
    },
  ];

  return json({ clicks, customers });
};

export default function Conversions() {
  const { clicks, customers } = useLoaderData();
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    { id: 'clicks', content: 'Clicks' },
    { id: 'customers', content: 'Customers' },
  ];

  const renderInsights = (insights) => {
    const iconMap = {

      mobile: MobileMajor,

    };

    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        {insights.map((insight) => (
          <Icon key={insight} source={iconMap[insight]} color="base" />
        ))}
      </div>
    );
  };

  const clickRows = clicks.map((click) => [
    click.date,
    renderInsights(click.insights),
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      
      {click.affiliate.name}
    </div>,
    <Link url={click.referralSite} external>
      {click.referralSite}
    </Link>,
    <Link url={click.destinationUrl} external>
      {click.destinationUrl}
    </Link>,
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <img
        src={`https://flagcdn.com/w20/${click.country.toLowerCase()}.png`}
        alt={`${click.country} flag`}
        style={{ width: '20px', height: 'auto' }}
      />
      {click.ip}
    </div>,
  ]);

  const customerRows = customers.map((customer) => [
    customer.date,
    customer.name,
    customer.email,
    customer.orderTotal,
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {customer.affiliate.name}
    </div>,
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <img
        src={`https://flagcdn.com/w20/${customer.country.toLowerCase()}.png`}
        alt={`${customer.country} flag`}
        style={{ width: '20px', height: 'auto' }}
      />
      {customer.country}
    </div>,
  ]);

  const clickHeadings = [
    'Date',
    'Insights',
    'Affiliate',
    'Referral site',
    'Destination url',
    'IP',
  ];

  const customerHeadings = [
    'Date',
    'Name',
    'Email',
    'Order Total',
    'Affiliate',
    'Country',
  ];

  return (
    <Page title="Conversions">
      <Card>
        <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab} />
        <div style={{ padding: '16px' }}>
          <Filters
            queryValue=""
            filters={[
              {
                key: 'date',
                label: 'Date',
                filter: <TextField label="Date" onChange={() => {}} />,
              },
              {
                key: 'affiliate',
                label: 'Affiliate',
                filter: <TextField label="Affiliate" onChange={() => {}} />,
              },
              {
                key: 'country',
                label: 'Country',
                filter: <TextField label="Country" onChange={() => {}} />,
              },
            ]}
            appliedFilters={[]}
            onQueryChange={() => {}}
            onQueryClear={() => {}}
            onClearAll={() => {}}
          />
          <DataTable
            columnContentTypes={Array(6).fill('text')}
            headings={selectedTab === 0 ? clickHeadings : customerHeadings}
            rows={selectedTab === 0 ? clickRows : customerRows}
          />
        </div>
      </Card>
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <Link url="#">Learn more about conversions</Link>
      </div>
    </Page>
  );
}