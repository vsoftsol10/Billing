// pages/EWayBills.jsx  — wired to the real backend
import React, { useState, useEffect, useCallback } from 'react'
import Navbar from '../component/common/Navbar'
import Sidebar from '../component/common/SideBar'
import EWayBillHeader from '../component/EWayBills/EWayBillHeader'
import EWayBillFilters from '../component/EWayBills/EWayBillFilters'
import EWayBillTable from '../component/EWayBills/EWayBillTable'
import EWayBillConnectModal from '../component/EWayBills/EWayBillConnectModal'
import {
  fetchEWayBills,
  getConnectionStatus,
} from '../api/ewayBillService'

const EWayBills = () => {
  const [activeFilter,      setActiveFilter]      = useState('All')
  const [searchQuery,       setSearchQuery]        = useState('')
  const [sidebarActive,     setSidebarActive]      = useState('EWayBills')
  const [mobileSidebarOpen, setMobileSidebarOpen]  = useState(false)
  const [showConnectModal,  setShowConnectModal]   = useState(false)

  // ── Data state ───────────────────────────────────────────────────────────────
  const [bills,     setBills]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [connected, setConnected] = useState(false)

  // ── Load connection status + bills on mount ───────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [statusRes, billsData] = await Promise.all([
        getConnectionStatus(),
        fetchEWayBills(),
      ])
      setConnected(statusRes.connected ?? false)

      // Normalise backend rows to the shape EWayBillTable expects:
      // { id, client, amount, date, status }
      const normalised = billsData.map((b) => ({
        id:     b.ewb_no   ?? b.id   ?? '—',
        client: b.to_gstin ?? b.client ?? '—',   // swap to trade name when backend sends it
        amount: b.total_value != null
          ? `₹ ${Number(b.total_value).toLocaleString('en-IN')}`
          : b.amount ?? '—',
        date:   b.ewb_date
          ? new Date(b.ewb_date).toISOString().slice(0, 10)
          : b.date ?? '—',
        status: b.status ?? 'Pending',
        // Keep raw row available for view/edit handlers
        _raw: b,
      }))
      setBills(normalised)
    } catch (err) {
      setError(err.message || 'Failed to load e-way bills.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleConnect = () => setShowConnectModal(true)

  // Called by EWayBillConnectModal after a successful connect
  const handleConnected = async () => {
    setConnected(true)
    await loadData()          // re-fetch so the table reflects any new data
  }

  const handleView   = (id) => console.log('View E-way Bill:', id)
  const handleEdit   = (id) => console.log('Edit E-way Bill:', id)
  const handleDelete = (id) => console.log('Delete E-way Bill:', id)

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
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

      <div className="flex-1 flex flex-col min-w-0 w-full lg:ml-52">
        <Navbar
          title="E-Way Bills"
          subtitle={true}
          user="VBILL"
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-auto min-w-0">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header — shows Connect or Disconnect depending on status */}
            <EWayBillHeader
              connected={connected}
              onConnect={handleConnect}
            />

            {/* Global error banner */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
                  <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {error}
                <button
                  onClick={loadData}
                  className="ml-auto underline text-red-600 hover:text-red-800 text-xs"
                >
                  Retry
                </button>
              </div>
            )}

            <EWayBillFilters
              onFilterChange={setActiveFilter}
              onSearchChange={setSearchQuery}
            />

            {/* Loading skeleton */}
            {loading ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 flex items-center justify-center gap-3 text-sm text-gray-400">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
                Loading e-way bills…
              </div>
            ) : (
              <EWayBillTable
                data={bills}
                externalFilter={activeFilter}
                externalSearch={searchQuery}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </main>
      </div>

      {showConnectModal && (
        <EWayBillConnectModal
          onClose={() => setShowConnectModal(false)}
          onConnected={handleConnected}
        />
      )}
    </div>
  )
}

export default EWayBills