import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import InvoicePagination from './InvoicePagination'
import { fetchInvoices, updateInvoiceStatus, deleteInvoice } from '../../api/invoiceService'

// ─── Financial year options (must match backend query params) ────────────────
const FINANCIAL_YEARS = [
  { label: 'All Years',  value: 'all' },
  { label: 'FY 2025–26', value: '2025-26', start: '2025-04-01', end: '2026-03-31' },
  { label: 'FY 2024–25', value: '2024-25', start: '2024-04-01', end: '2025-03-31' },
  { label: 'FY 2023–24', value: '2023-24', start: '2023-04-01', end: '2024-03-31' },
]

const STATUS_OPTIONS = ['Pending', 'Open', 'Paid', 'Cancelled', 'Draft']

const getStatusColor = (status) => {
  const colors = {
    Pending:   'bg-amber-100 text-amber-800',
    Open:      'bg-green-100 text-green-800',
    Paid:      'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
    Draft:     'bg-gray-100 text-gray-800',
    Overdue:   'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// ─── Loading skeleton row ─────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[...Array(7)].map((_, i) => (
      <td key={i} className="px-4 lg:px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </td>
    ))}
  </tr>
)

// ─── Status Dropdown ──────────────────────────────────────────────────────────
const StatusDropdown = ({ value, onChange, loading }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const buttonRef = useRef(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Update dropdown position when opened
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX
      })
    }
  }, [open])

  return (
    <div className="relative w-fit" ref={ref}>
      <span
        ref={buttonRef}
        onClick={() => !loading && setOpen(p => !p)}
        className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit
          ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer select-none'}
          ${getStatusColor(value)}`}
      >
        {loading ? '…' : value}
        {!loading && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        )}
      </span>
      {open && createPortal(
        <div 
          className="fixed w-36 bg-white rounded-lg border border-gray-200 shadow-lg z-50 overflow-hidden"
          style={{ 
            animation: 'fadeSlideDown 0.12s ease',
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}>
          {STATUS_OPTIONS.map(s => (
            <button key={s}
              onClick={() => { onChange(s); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 transition-colors text-left">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(s)}`}>{s}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}

// ─── Action Dropdown ──────────────────────────────────────────────────────────
const ActionDropdown = ({ invoice, onDelete, deleting }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const buttonRef = useRef(null)
  const [position, setPosition] = useState({ top: 0, right: 0 })

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Update dropdown position when opened
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right + window.scrollX
      })
    }
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button ref={buttonRef} onClick={() => setOpen(p => !p)}
        className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-md hover:bg-gray-100">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="2"/>
          <circle cx="12" cy="12" r="2"/>
          <circle cx="12" cy="19" r="2"/>
        </svg>
      </button>
      {open && createPortal(
        <div 
          className="fixed w-32 bg-white rounded-lg border border-gray-200 shadow-lg z-50 overflow-hidden"
          style={{ 
            animation: 'fadeSlideDown 0.12s ease',
            top: `${position.top}px`,
            right: `${position.right}px`,
          }}>
          <button
            onClick={() => { setOpen(false); onDelete(invoice) }}
            disabled={deleting}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left disabled:opacity-50">
            {deleting ? (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            )}
            {deleting ? 'Cancelling…' : 'Delete'}
          </button>
        </div>,
        document.body
      )}
    </div>
  )
}

// ─── FY Filter ────────────────────────────────────────────────────────────────
const FYFilter = ({ selected, onChange }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const buttonRef = useRef(null)
  const [position, setPosition] = useState({ top: 0, right: 0 })

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Update dropdown position when opened
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right + window.scrollX
      })
    }
  }, [open])

  const current = FINANCIAL_YEARS.find(f => f.value === selected)

  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button ref={buttonRef} onClick={() => setOpen(p => !p)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span className="hidden xs:inline">{current?.label || 'All Years'}</span>
        <span className="xs:hidden">FY</span>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && createPortal(
        <div 
          className="fixed bg-white rounded-lg border border-gray-200 shadow-lg z-50 overflow-hidden w-40"
          style={{ 
            animation: 'fadeSlideDown 0.12s ease',
            top: `${position.top}px`,
            right: `${position.right}px`,
          }}>
          {FINANCIAL_YEARS.map(fy => (
            <button key={fy.value} onClick={() => { onChange(fy.value); setOpen(false) }}
              className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors
                ${fy.value === selected ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
              {fy.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}

// ─── Mobile Card ──────────────────────────────────────────────────────────────
const InvoiceCard = ({ invoice, onStatusChange, onDelete, updatingId, deletingId }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="text-sm text-gray-900">{invoice.id}</p>
        <p className="text-sm text-gray-600 mt-0.5">{invoice.client}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <StatusDropdown
          value={invoice.status}
          loading={updatingId === invoice.dbId}
          onChange={(s) => onStatusChange(invoice, s)}
        />
        <ActionDropdown
          invoice={invoice}
          onDelete={onDelete}
          deleting={deletingId === invoice.dbId}
        />
      </div>
    </div>
    <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-gray-900 text-sm">{invoice.amount}</span>
        <span>{invoice.date}</span>
      </div>
      <span className="text-right truncate max-w-[140px]">{invoice.gstNo}</span>
    </div>
  </div>
)

// ─── Error banner ─────────────────────────────────────────────────────────────
const ErrorBanner = ({ message, onRetry }) => (
  <div className="flex items-center justify-between px-4 py-3 bg-red-50 border border-red-200 rounded-lg mx-4 my-3 text-sm text-red-700">
    <span>{message}</span>
    {onRetry && (
      <button onClick={onRetry} className="ml-3 text-red-600 font-semibold hover:underline flex-shrink-0">
        Retry
      </button>
    )}
  </div>
)

// ─── Main Table ───────────────────────────────────────────────────────────────
const InvoiceTable = ({
  externalFilter = 'All',
  externalSearch = '',
  refreshKey = 0,
  onRefresh,
}) => {
  const [invoices, setInvoices]     = useState([])
  const [total, setTotal]           = useState(0)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [search, setSearch]         = useState('')
  const [fyFilter, setFyFilter]     = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [updatingId, setUpdatingId] = useState(null)   // dbId being status-updated
  const [deletingId, setDeletingId] = useState(null)   // dbId being deleted
  const itemsPerPage = 10

  // ── Fetch invoices from API ───────────────────────────────────────────────
  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const fy = FINANCIAL_YEARS.find(f => f.value === fyFilter)

      const data = await fetchInvoices({
        search:   externalSearch || search,
        status:   externalFilter !== 'All' ? externalFilter : undefined,
        fyStart:  fy?.start,
        fyEnd:    fy?.end,
        page:     currentPage,
        limit:    itemsPerPage,
      })

      setInvoices(data.invoices)
      setTotal(data.total)
    } catch (err) {
      setError(err.message || 'Failed to load invoices.')
    } finally {
      setLoading(false)
    }
  }, [externalFilter, externalSearch, search, fyFilter, currentPage, refreshKey])

  useEffect(() => { loadInvoices() }, [loadInvoices])

  // Reset to page 1 when filters change
  useEffect(() => { setCurrentPage(1) }, [search, fyFilter, externalFilter, externalSearch, refreshKey])

  // ── Status change ─────────────────────────────────────────────────────────
  const handleStatusChange = async (invoice, newStatus) => {
    if (newStatus === invoice.status) return
    setUpdatingId(invoice.dbId)
    // Optimistic update
    setInvoices(prev =>
      prev.map(inv => inv.dbId === invoice.dbId ? { ...inv, status: newStatus } : inv)
    )
    try {
      await updateInvoiceStatus(invoice.dbId, newStatus)
      onRefresh?.()     // refresh stats in parent
    } catch (err) {
      // Revert on failure
      setInvoices(prev =>
        prev.map(inv => inv.dbId === invoice.dbId ? { ...inv, status: invoice.status } : inv)
      )
      setError(`Failed to update status: ${err.message}`)
    } finally {
      setUpdatingId(null)
    }
  }

  // ── Delete (soft-cancel) ──────────────────────────────────────────────────
  const handleDelete = async (invoice) => {
    if (!window.confirm(`Cancel invoice ${invoice.id}? This cannot be undone.`)) return
    setDeletingId(invoice.dbId)
    try {
      await deleteInvoice(invoice.dbId)
      // Remove from local list immediately
      setInvoices(prev => prev.filter(inv => inv.dbId !== invoice.dbId))
      setTotal(t => t - 1)
      onRefresh?.()
    } catch (err) {
      setError(`Failed to cancel invoice: ${err.message}`)
    } finally {
      setDeletingId(null)
    }
  }

  const totalPages = Math.ceil(total / itemsPerPage)

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4 border-b border-gray-200">
        <div className="relative w-full sm:max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search invoices…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-8 py-2 rounded-2xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors w-full"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Total count */}
          {!loading && (
            <span className="text-xs text-gray-400 hidden sm:inline">
              {total} invoice{total !== 1 ? 's' : ''}
            </span>
          )}
          <FYFilter selected={fyFilter} onChange={setFyFilter} />
        </div>
      </div>

      {/* Error */}
      {error && <ErrorBanner message={error} onRetry={loadInvoices} />}

      {/* ── Mobile cards (< md) ── */}
      <div className="md:hidden">
        {loading ? (
          <div className="p-3 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : invoices.length > 0 ? (
          <div className="p-3 space-y-3">
            {invoices.map((invoice, idx) => (
              <InvoiceCard
                key={`${invoice.dbId ?? invoice.id}-${idx}`}
                invoice={invoice}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                updatingId={updatingId}
                deletingId={deletingId}
              />
            ))}
          </div>
        ) : (
          <div className="px-4 py-10 text-center text-sm text-gray-500">No invoices found</div>
        )}
      </div>

      {/* ── Desktop table (≥ md) ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['ID', 'Client', 'Amount', 'Date', 'GST No.', 'Status', 'Action'].map(h => (
                <th key={h} className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              [...Array(itemsPerPage)].map((_, i) => <SkeletonRow key={i} />)
            ) : invoices.length > 0 ? (
              invoices.map((invoice, idx) => (
                <tr key={`${invoice.dbId ?? invoice.id}-${idx}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 lg:px-6 py-3.5 text-sm text-gray-900 whitespace-nowrap">{invoice.id}</td>
                  <td className="px-4 lg:px-6 py-3.5 text-sm text-gray-600 max-w-[160px] truncate">{invoice.client}</td>
                  <td className="px-4 lg:px-6 py-3.5 text-sm font-semibold text-gray-900 whitespace-nowrap">{invoice.amount}</td>
                  <td className="px-4 lg:px-6 py-3.5 text-sm text-gray-500 whitespace-nowrap">{invoice.date}</td>
                  <td className="px-4 lg:px-6 py-3.5 text-sm text-gray-500 whitespace-nowrap hidden lg:table-cell">{invoice.gstNo}</td>
                  <td className="px-4 lg:px-6 py-3.5">
                    <StatusDropdown
                      value={invoice.status}
                      loading={updatingId === invoice.dbId}
                      onChange={(s) => handleStatusChange(invoice, s)}
                    />
                  </td>
                  <td className="px-4 lg:px-6 py-3.5">
                    <ActionDropdown
                      invoice={invoice}
                      onDelete={handleDelete}
                      deleting={deletingId === invoice.dbId}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-sm text-gray-500">No invoices found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <InvoicePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}

export default InvoiceTable