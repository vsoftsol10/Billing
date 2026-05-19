import React, { useState } from 'react'
import Navbar from '../component/common/Navbar'
import Sidebar from '../component/common/SideBar'
import InvoiceHeader from '../component/Invoice/InvoiceHeader'
import InvoiceFilters from '../component/Invoice/InvoiceFilters'
import InvoiceStats from '../component/Invoice/InvoiceStats'
import InvoiceTable from '../component/Invoice/InvoiceTable'
import CreateInvoice from '../component/Invoice/CreateInvoice'

const Invoice = () => {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarActive, setSidebarActive] = useState('Invoice')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [showCreateInvoice, setShowCreateInvoice] = useState(false)  // ← new

  const sampleInvoices = [
    { id: '1019', client: 'Globa Inc',        amount: '₹ 8,750', date: '2026-01-14', gstNo: '2026-01-14', status: 'Pending' },
    { id: '1022', client: 'Stark Industries', amount: '₹ 4,550', date: '2026-01-09', gstNo: '2026-01-09', status: 'Open' },
    { id: '1009', client: 'Soylent Corp',     amount: '₹ 2,950', date: '2026-01-10', gstNo: '2026-01-10', status: 'Open' },
    { id: '1009', client: 'Soylent Corp',     amount: '₹ 2,950', date: '2026-01-10', gstNo: '2026-01-10', status: 'Update' },
    { id: '1009', client: 'Soylent Corp',     amount: '₹ 2,950', date: '2026-01-10', gstNo: '2026-01-10', status: 'Update' },
  ]

  const stats = {
    total:   sampleInvoices.length,
    pending: sampleInvoices.filter(i => i.status === 'Pending').length,
    paid:    sampleInvoices.filter(i => i.status === 'Open' || i.status === 'Paid').length,
    overdue: sampleInvoices.filter(i => i.status === 'Update').length,
  }

  // ─── Shared shell (sidebar + navbar always visible) ──────────────────────
  const Shell = ({ children }) => (
    <div className="relative flex bg-gray-50 min-h-screen overflow-hidden">
      <Sidebar
        activeItem={sidebarActive}
        onNavigate={setSidebarActive}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-auto">
        <Navbar
          title={showCreateInvoice ? 'Create Invoice' : 'Invoice'}
          subtitle={true}
          user="VBILL"
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />
        {children}
      </div>
    </div>
  )

  // ─── Create Invoice view (inside shell, no standalone full-screen) ────────
  if (showCreateInvoice) {
    return (
      <Shell>
        {/*
          Pass onBack so clicking the back arrow returns to the invoice list.
          Pass onSave / onSaveDraft to handle saving, then navigate back.
        */}
        <CreateInvoice
          onBack={() => setShowCreateInvoice(false)}
          onSave={(data) => {
            console.log('Saved invoice:', data)
            setShowCreateInvoice(false)
          }}
          onSaveDraft={(data) => {
            console.log('Saved draft:', data)
            setShowCreateInvoice(false)
          }}
        />
      </Shell>
    )
  }

  // ─── Invoice list view ────────────────────────────────────────────────────
  return (
    <Shell>
      <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-auto min-w-0">
        {/*
          Pass onCreateClick so the header button triggers the in-shell view
          instead of navigating away with react-router.
        */}
        <InvoiceHeader onCreateClick={() => setShowCreateInvoice(true)} />
        {/* <InvoiceStats stats={stats} /> */}
        <InvoiceFilters
          onFilterChange={setActiveFilter}
          onSearchChange={setSearchQuery}
        />
        <InvoiceTable
          externalFilter={activeFilter}
          externalSearch={searchQuery}
          onEdit={(id) => console.log('Edit', id)}
          onDelete={(id) => console.log('Delete', id)}
        />
      </main>
    </Shell>
  )
}

export default Invoice