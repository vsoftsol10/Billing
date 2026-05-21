import React, { useState, useEffect, useCallback } from 'react'
import Navbar from '../component/common/Navbar'
import Sidebar from '../component/common/SideBar'
import InvoiceHeader from '../component/Invoice/InvoiceHeader'
import InvoiceFilters from '../component/Invoice/InvoiceFilters'
import InvoiceStats from '../component/Invoice/InvoiceStats'
import InvoiceTable from '../component/Invoice/InvoiceTable'
import CreateInvoice from '../component/Invoice/CreateInvoice'
import { fetchInvoiceStats } from '../api/invoiceService'

const Invoice = () => {
  const [activeFilter, setActiveFilter]         = useState('All')
  const [searchQuery, setSearchQuery]           = useState('')
  const [sidebarActive, setSidebarActive]       = useState('Invoice')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [showCreateInvoice, setShowCreateInvoice] = useState(false)

  // Stats for InvoiceStats component
  const [stats, setStats]       = useState({ total: 0, pending: 0, paid: 0, overdue: 0 })
  const [statsLoading, setStatsLoading] = useState(true)

  // Refresh key — incrementing it forces InvoiceTable to re-fetch
  const [refreshKey, setRefreshKey] = useState(0)

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true)
      const data = await fetchInvoiceStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to load invoice stats:', err)
    } finally {
      setStatsLoading(false)
    }
  }, [])

  useEffect(() => { loadStats() }, [loadStats, refreshKey])

  const handleInvoiceSaved = () => {
    setShowCreateInvoice(false)
    setRefreshKey(k => k + 1)   // triggers table + stats refresh
  }

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

  if (showCreateInvoice) {
    return (
      <Shell>
        <CreateInvoice
          onBack={() => setShowCreateInvoice(false)}
          onSave={handleInvoiceSaved}
          onSaveDraft={handleInvoiceSaved}
        />
      </Shell>
    )
  }

  return (
    <Shell>
      <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-auto min-w-0">
        <InvoiceHeader onCreateClick={() => setShowCreateInvoice(true)} />
        <InvoiceStats stats={stats} loading={statsLoading} />
        <InvoiceFilters
          onFilterChange={setActiveFilter}
          onSearchChange={setSearchQuery}
        />
        <InvoiceTable
          externalFilter={activeFilter}
          externalSearch={searchQuery}
          refreshKey={refreshKey}
          onRefresh={() => setRefreshKey(k => k + 1)}
        />
      </main>
    </Shell>
  )
}

export default Invoice