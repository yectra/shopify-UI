import React, { useState, useCallback } from 'react'
import {
  Page,
  Layout,
  Card,
  DataTable,
  Button,
  Modal,
  Form,
  FormLayout,
  TextField,
  Select,
  EmptyState,
  Filters,
  Badge,
  ButtonGroup,
  Text,
  Banner,
} from '@shopify/polaris'
import { SearchIcon as SearchMinor, PlusIcon as PlusMinor } from '@shopify/polaris-icons'

export default function AffiliateList() {
  const [affiliates, setAffiliates] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', sales: 1500, commission: 150 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Pending', sales: 0, commission: 0 },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newAffiliate, setNewAffiliate] = useState({ name: '', email: '', status: 'Pending' })
  const [searchValue, setSearchValue] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const handleModalClose = useCallback(() => setIsModalOpen(false), [])
  const handleModalOpen = useCallback(() => setIsModalOpen(true), [])

  const handleAddAffiliate = useCallback(() => {
    const newId = affiliates.length + 1
    setAffiliates([...affiliates, { ...newAffiliate, id: newId, sales: 0, commission: 0 }])
    setNewAffiliate({ name: '', email: '', status: 'Pending' })
    handleModalClose()
  }, [affiliates, newAffiliate, handleModalClose])

  const handleSearchChange = useCallback((value) => setSearchValue(value), [])
  const handleStatusChange = useCallback((value) => setSelectedStatus(value), [])

  const filteredAffiliates = affiliates.filter((affiliate) => {
    const matchesSearch = affiliate.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                          affiliate.email.toLowerCase().includes(searchValue.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || affiliate.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const affiliateTableRows = filteredAffiliates.map((affiliate) => [
    affiliate.name,
    affiliate.email,
    <Badge status={affiliate.status === 'Active' ? 'success' : 'attention'}>{affiliate.status}</Badge>,
    `$${affiliate.sales.toFixed(2)}`,
    `$${affiliate.commission.toFixed(2)}`,
    <ButtonGroup>
      <Button size="slim">Edit</Button>
      <Button size="slim" destructive>Deactivate</Button>
    </ButtonGroup>
  ])

 

  return (
    <Page
      title="Affiliate Management"
      primaryAction={{
        content: 'Add Affiliate',
        icon: PlusMinor,
        onAction: handleModalOpen,
      }}
    >
      <Layout>
        <Layout.Section>
          <Card title="Affiliates" sectioned>
            <Filters
              queryValue={searchValue}
              queryPlaceholder="Search affiliates"
              onQueryChange={handleSearchChange}
              onQueryClear={() => setSearchValue('')}
              filters={[
                {
                  key: 'status',
                  label: 'Status',
                  filter: (
                    <Select
                      options={[
                        {label: 'All', value: 'all'},
                        {label: 'Active', value: 'Active'},
                        {label: 'Pending', value: 'Pending'},
                      ]}
                      value={selectedStatus}
                      onChange={handleStatusChange}
                    />
                  ),
                },
              ]}
            />
            {filteredAffiliates.length > 0 ? (
              <DataTable
                columnContentTypes={[
                  'text',
                  'text',
                  'text',
                  'numeric',
                  'numeric',
                  'text',
                ]}
                headings={[
                  'Name',
                  'Email',
                  'Status',
                  'Total Sales',
                  'Commission Earned',
                  'Actions',
                ]}
                rows={affiliateTableRows}
              />
            ) : (
              <EmptyState
                heading="No affiliates found"
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                <p>Add affiliates or adjust your search parameters.</p>
              </EmptyState>
            )}
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card title="Program Overview" sectioned>
            <Text variant="bodyMd" as="p">
              Total Affiliates: {affiliates.length}
            </Text>
            <Text variant="bodyMd" as="p">
              Active Affiliates: {affiliates.filter(a => a.status === 'Active').length}
            </Text>
            <Text variant="bodyMd" as="p">
              Total Sales: ${affiliates.reduce((sum, a) => sum + a.sales, 0).toFixed(2)}
            </Text>
            <Text variant="bodyMd" as="p">
              Total Commissions: ${affiliates.reduce((sum, a) => sum + a.commission, 0).toFixed(2)}
            </Text>
          </Card>
        </Layout.Section>
      </Layout>
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        title="Add New Affiliate"
        primaryAction={{
          content: 'Add Affiliate',
          onAction: handleAddAffiliate,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleModalClose,
          },
        ]}
      >
        <Modal.Section>
          <Form onSubmit={handleAddAffiliate}>
            <FormLayout>
              <TextField
                label="Name"
                value={newAffiliate.name}
                onChange={(value) => setNewAffiliate({...newAffiliate, name: value})}
                autoComplete="name"
              />
              <TextField
                label="Email"
                value={newAffiliate.email}
                onChange={(value) => setNewAffiliate({...newAffiliate, email: value})}
                autoComplete="email"
                type="email"
              />
              <Select
                label="Status"
                options={[
                  {label: 'Active', value: 'Active'},
                  {label: 'Pending', value: 'Pending'},
                ]}
                value={newAffiliate.status}
                onChange={(value) => setNewAffiliate({...newAffiliate, status: value})}
              />
            </FormLayout>
          </Form>
        </Modal.Section>
      </Modal>
    </Page>
  )
}