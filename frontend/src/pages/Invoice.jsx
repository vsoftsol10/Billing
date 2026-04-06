import React, { useState } from 'react'
import Navbar from '../component/common/Navbar'
import Sidebar from '../component/common/SideBar'
import InvoiceHeader from '../component/Invoice/InvoiceHeader'
import InvoiceFilters from '../component/Invoice/InvoiceFilters'
import InvoiceStats from '../component/Invoice/InvoiceStats'
import InvoiceTable from '../component/Invoice/InvoiceTable'

const Invoice = () => {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarActive, setSidebarActive] = useState('Invoice')

  // Sample invoice data
  const sampleInvoices = [
    { id: '1019', client: 'Globa Inc', amount: '₹ 8,750', date: '2026-01-14', gstNo: '2026-01-14', status: 'Pending' },
    { id: '1022', client: 'Stark Industries', amount: '₹ 4,550', date: '2026-01-09', gstNo: '2026-01-09', status: 'Open' },
    { id: '1009', client: 'Soylent Corp', amount: '₹ 2,950', date: '2026-01-10', gstNo: '2026-01-10', status: 'Open' },
    { id: '1009', client: 'Soylent Corp', amount: '₹ 2,950', date: '2026-01-10', gstNo: '2026-01-10', status: 'Update' },
    { id: '1009', client: 'Soylent Corp', amount: '₹ 2,950', date: '2026-01-10', gstNo: '2026-01-10', status: 'Update' },
  ]

  // Filter invoices based on active filter and search
  const getFilteredInvoices = () => {
    let filtered = sampleInvoices

    if (activeFilter !== 'All') {
      filtered = filtered.filter(invoice => invoice.status === activeFilter)
    }

    if (searchQuery) {
      filtered = filtered.filter(invoice =>
        invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.id.includes(searchQuery)
      )
    }

    return filtered
  }

  const stats = {
    total: sampleInvoices.length,
    pending: sampleInvoices.filter(i => i.status === 'Pending').length,
    paid: sampleInvoices.filter(i => i.status === 'Open' || i.status === 'Paid').length,
    overdue: sampleInvoices.filter(i => i.status === 'Update').length,
  }

  const filteredInvoices = getFilteredInvoices()

  const handleCreateInvoice = () => {
    console.log('Create new invoice')
    // Add logic to open create invoice modal
  }

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
  }

  const handleSearchChange = (query) => {
    setSearchQuery(query)
  }

  const handleInvoiceAction = (invoiceId, action) => {
    console.log(`Action: ${action} on invoice ${invoiceId}`)
    // Add logic for invoice actions (edit, delete, view, etc.)
  }

  const handleEditInvoice = (invoiceId) => {
    console.log(`Edit invoice: ${invoiceId}`)
    // Add logic to open edit invoice modal
  }

  const handleDeleteInvoice = (invoiceId) => {
    console.log(`Delete invoice: ${invoiceId}`)
    // Add logic to confirm and delete invoice
  }

  return (
    <div className="flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeItem={sidebarActive} onNavigate={setSidebarActive} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar title="Invoice" subtitle={true} user="VBILL" />

        {/* Page Content */}
        <main className="flex-1 p-7 overflow-auto">
          <InvoiceHeader onCreateInvoice={handleCreateInvoice} />
          
          {/* <InvoiceStats stats={stats} /> */}
          
          <InvoiceFilters 
            onFilterChange={handleFilterChange} 
            onSearchChange={handleSearchChange}
          />

          <InvoiceTable 
            externalFilter={activeFilter}
            externalSearch={searchQuery}
            onEdit={handleEditInvoice}
            onDelete={handleDeleteInvoice}
          />
        </main>
      </div>
    </div>
  )
}

export default Invoice