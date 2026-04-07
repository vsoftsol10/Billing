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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const sampleInvoices = [
    { id: '1019', client: 'Globa Inc', amount: '₹ 8,750', date: '2026-01-14', gstNo: '2026-01-14', status: 'Pending' },
    { id: '1022', client: 'Stark Industries', amount: '₹ 4,550', date: '2026-01-09', gstNo: '2026-01-09', status: 'Open' },
    { id: '1009', client: 'Soylent Corp', amount: '₹ 2,950', date: '2026-01-10', gstNo: '2026-01-10', status: 'Open' },
    { id: '1009', client: 'Soylent Corp', amount: '₹ 2,950', date: '2026-01-10', gstNo: '2026-01-10', status: 'Update' },
    { id: '1009', client: 'Soylent Corp', amount: '₹ 2,950', date: '2026-01-10', gstNo: '2026-01-10', status: 'Update' },
  ]

  const stats = {
    total: sampleInvoices.length,
    pending: sampleInvoices.filter(i => i.status === 'Pending').length,
    paid: sampleInvoices.filter(i => i.status === 'Open' || i.status === 'Paid').length,
    overdue: sampleInvoices.filter(i => i.status === 'Update').length,
  }

  const handleCreateInvoice = () => console.log('Create new invoice')
  const handleEditInvoice = (id) => console.log(`Edit invoice: ${id}`)
  const handleDeleteInvoice = (id) => console.log(`Delete invoice: ${id}`)

  return (
    /*
     * KEY FIX: Use `relative overflow-hidden` on the root so the sidebar
     * overlay never causes horizontal scroll / content shift on mobile.
     */
    <div className="relative flex bg-gray-50 min-h-screen overflow-hidden">

      {/* ── Sidebar ── */}
      <Sidebar
        activeItem={sidebarActive}
        onNavigate={setSidebarActive}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* ── Mobile backdrop — closes sidebar on outside tap ── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/*
       * KEY FIX: `min-w-0 w-full` prevents the main column from ever
       * overflowing its flex container, which was causing the left-clip.
       */}
      <div className="flex-1 flex flex-col min-w-0 w-full">

        {/* Navbar */}
        <Navbar
          title="Invoice"
          subtitle={true}
          user="VBILL"
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        {/* Page content — px-4 on mobile, more on larger screens */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-auto min-w-0">
          <InvoiceHeader onCreateInvoice={handleCreateInvoice} />

          {/* <InvoiceStats stats={stats} /> */}

          <InvoiceFilters
            onFilterChange={setActiveFilter}
            onSearchChange={setSearchQuery}
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