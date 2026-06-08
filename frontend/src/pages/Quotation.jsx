// src/pages/Quotation.jsx
import React, { useState, useEffect, useCallback } from 'react'
import Navbar from '../component/common/Navbar'
import Sidebar from '../component/common/SideBar'
import QuotationHeader from '../component/Quotation/QuotationHeader'
import QuotationFilters from '../component/Quotation/QuotationFilters'
import QuotationTable from '../component/Quotation/QuotationTable'
import CreateQuotation from '../component/Quotation/CreateQuotation'
import ViewQuotationModal from '../component/Quotation/ViewQuotationModal'
import EditQuotationModal from '../component/Quotation/EditQuotationModal'
import {
  getQuotations,
  deleteQuotation,
  updateQuotationStatus,
  createQuotation,
} from '../api/quotationService'

// Map the frontend pill labels to the DB enum values the backend expects.
// The table/filter uses 'All', 'Open', 'Draft', etc. (title-case).
// The backend stores 'OPEN', 'DRAFT', etc. (upper-case).
const toApiStatus = (s) => (s === 'All' ? undefined : s.toUpperCase())
const toUiStatus  = (s) => s.charAt(0) + s.slice(1).toLowerCase() // 'OPEN' → 'Open'

const Quotation = () => {
  // ── UI state ───────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab]               = useState('All')
  const [searchText, setSearchText]             = useState('')
  const [sidebarActive, setSidebarActive]       = useState('Quotation')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage]           = useState(1)
  const [timeFrame, setTimeFrame]               = useState('All')
  const [selectedYear, setSelectedYear]         = useState('')
  const [selectedMonth, setSelectedMonth]       = useState('')
  const [showCreate, setShowCreate]             = useState(false)

  // ── Data state ─────────────────────────────────────────────────────────────
  const [quotations, setQuotations] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)

  // ── View/Edit state ────────────────────────────────────────────────────────
  const [viewingQuotation, setViewingQuotation] = useState(null)
  const [editingQuotation, setEditingQuotation] = useState(null)
  const [editingLoading, setEditingLoading]     = useState(false)

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchQuotations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const filters = {
        status: toApiStatus(activeTab),
        search: searchText || undefined,
        year:   selectedYear  || undefined,
        month:  selectedMonth || undefined,
        page:   currentPage,
        limit:  10,
      }
      const res = await getQuotations(filters)

      // Normalise DB enum values back to the title-case the UI expects
      const rows = res.data.map((q) => ({
        id:     q.quotation_number,
        _id:    q.id,                                        // real UUID for mutations
        client: q.customers?.name ?? '—',
        amount: `₹ ${Number(q.total_amount).toLocaleString('en-IN')}`,
        date:   q.issue_date?.split('T')[0] ?? '',
        status: toUiStatus(q.status),
      }))

      setQuotations(rows)
      setTotalPages(res.meta.totalPages)
      setTotalCount(res.meta.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [activeTab, searchText, selectedYear, selectedMonth, currentPage])

  useEffect(() => {
    fetchQuotations()
  }, [fetchQuotations])

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleStatusChange = async (id, newUiStatus) => {
    // `id` here is the quotation number (display id); we stored the real UUID in _id.
    const row = quotations.find((q) => q.id === id)
    if (!row) return
    try {
      await updateQuotationStatus(row._id, newUiStatus.toUpperCase())
      setQuotations((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: newUiStatus } : q))
      )
    } catch (err) {
      console.error('Status update failed:', err.message)
    }
  }

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete quotation ${row.id}?`)) return
    try {
      await deleteQuotation(row._id)
      // Refresh the current page; if it becomes empty go back one page
      if (quotations.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1)
      } else {
        fetchQuotations()
      }
    } catch (err) {
      console.error('Delete failed:', err.message)
    }
  }

  const handleView = (quotation) => {
    setViewingQuotation(quotation)
  }

  const handleEdit = (quotation) => {
    setEditingQuotation(quotation)
  }

  const handleEditSave = async (quotationId, formData) => {
    setEditingLoading(true)
    try {
      // Call your backend API to update the quotation
      // For now, this is a placeholder - you'll need to create an updateQuotation API
      await updateQuotationStatus(quotationId, formData.status.toUpperCase())
      
      // Update the local list
      setQuotations(prev =>
        prev.map(q =>
          q._id === quotationId
            ? { ...q, client: formData.client, status: formData.status }
            : q
        )
      )
      
      setEditingQuotation(null)
    } catch (err) {
      console.error('Edit failed:', err.message)
      throw err
    } finally {
      setEditingLoading(false)
    }
  }

  const handleSave = async (data) => {
    try {
      // The CreateQuotation component now sends the correct payload shape
      const payload = data
      
      // Ensure items are properly formatted
      if (payload.items && payload.items.length > 0) {
        payload.items = payload.items.map((it) => ({
          name:        it.name || '',
          description: it.description || undefined,
          hsnCode:     it.hsn || undefined,
          quantity:    Number(it.qty || 0),
          unitRate:    Number(it.rate || 0),
        }))
      } else {
        throw new Error('At least one item is required')
      }

      await createQuotation(payload)
      setShowCreate(false)
      setCurrentPage(1)
      fetchQuotations()
    } catch (err) {
      console.error('Create failed:', err.message)
      alert(`Failed to save: ${err.message}`)
    }
  }

  const handleSaveDraft = (data) => handleSave({ ...data, status: 'DRAFT' })

  const handleTimeFrameChange = (frame) => {
    setTimeFrame(frame)
    setCurrentPage(1)
    if (frame === 'All') { setSelectedYear(''); setSelectedMonth('') }
  }

  const clearTimeFilters = () => {
    setTimeFrame('All'); setSelectedYear(''); setSelectedMonth(''); setCurrentPage(1)
  }

  // ── Layout shell ───────────────────────────────────────────────────────────
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
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-auto lg:ml-52">
        {children}
      </div>
    </div>
  )

  // ── Create view ────────────────────────────────────────────────────────────
  if (showCreate) {
    return (
      <Shell>
        <CreateQuotation
          onBack={() => setShowCreate(false)}
          onSave={handleSave}
          onSaveDraft={handleSaveDraft}
        />
      </Shell>
    )
  }

  // ── List view ──────────────────────────────────────────────────────────────
  return (
    <Shell>
      <Navbar
        title="Quotation"
        subtitle={true}
        user="VBILL"
        onMenuToggle={() => setMobileSidebarOpen(true)}
      />
      <main className="flex-1 p-3 sm:p-5 lg:p-7 overflow-auto min-w-0">
        <QuotationHeader onCreateQuotation={() => setShowCreate(true)} />

        <QuotationFilters
          activeFilter={activeTab}
          onFilterChange={(f) => { setActiveTab(f); setCurrentPage(1) }}
          searchText={searchText}
          onSearchChange={(t) => { setSearchText(t); setCurrentPage(1) }}
          timeFrame={timeFrame}
          onTimeFrameChange={handleTimeFrameChange}
          selectedYear={selectedYear}
          onYearChange={(y) => { setSelectedYear(y); setCurrentPage(1) }}
          selectedMonth={selectedMonth}
          onMonthChange={(m) => { setSelectedMonth(m); setCurrentPage(1) }}
          onClearTimeFilters={clearTimeFilters}
        />

        {/* Error banner */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
            <button
              onClick={fetchQuotations}
              className="ml-3 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        <QuotationTable
          quotations={quotations}
          loading={loading}
          activeTab={activeTab}
          searchText={searchText}
          timeFrame={timeFrame}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={setCurrentPage}
          onStatusChange={handleStatusChange}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          serverSide={true}   // tells the table NOT to filter/paginate locally
        />

        {/* View Modal */}
        {viewingQuotation && (
          <ViewQuotationModal
            quotation={viewingQuotation}
            onClose={() => setViewingQuotation(null)}
          />
        )}

        {/* Edit Modal */}
        {editingQuotation && (
          <EditQuotationModal
            quotation={editingQuotation}
            onClose={() => setEditingQuotation(null)}
            onSave={handleEditSave}
            isLoading={editingLoading}
          />
        )}
      </main>
    </Shell>
  )
}

export default Quotation