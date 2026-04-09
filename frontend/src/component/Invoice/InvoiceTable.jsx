import React, { useState, useRef, useEffect } from 'react'
import InvoicePagination from './InvoicePagination'

const DUMMY_INVOICES = [
  { id: 'INV-001', client: 'Acme Corp', amount: '₹45,000', date: '2024-04-05', gstNo: '29ABCDE1234F1Z5', status: 'Paid' },
  { id: 'INV-002', client: 'Bright Solutions', amount: '₹12,500', date: '2024-05-12', gstNo: '27XYZAB5678G2H6', status: 'Pending' },
  { id: 'INV-003', client: 'CloudNine Ltd', amount: '₹78,000', date: '2024-06-20', gstNo: '33PQRST9012I3J7', status: 'Open' },
  { id: 'INV-004', client: 'Delta Traders', amount: '₹9,800', date: '2024-07-01', gstNo: '24UVWXY3456K4L8', status: 'Draft' },
  { id: 'INV-005', client: 'Eagle Enterprises', amount: '₹33,200', date: '2024-08-15', gstNo: '19MNOPQ7890M5N9', status: 'Cancelled' },
  { id: 'INV-006', client: 'FutureTech', amount: '₹21,750', date: '2024-09-22', gstNo: '06ABCDE2345O6P0', status: 'Paid' },
  { id: 'INV-007', client: 'GreenMart', amount: '₹55,000', date: '2024-10-10', gstNo: '09XYZAB6789Q7R1', status: 'Pending' },
  { id: 'INV-008', client: 'Horizon Labs', amount: '₹16,400', date: '2024-11-03', gstNo: '36PQRST0123S8T2', status: 'Open' },
  { id: 'INV-009', client: 'Indus Retail', amount: '₹62,300', date: '2024-12-18', gstNo: '22UVWXY4567U9V3', status: 'Paid' },
  { id: 'INV-010', client: 'Jupiter & Co', amount: '₹8,100', date: '2025-01-07', gstNo: '32MNOPQ8901W0X4', status: 'Draft' },
  { id: 'INV-011', client: 'Kestrel Infra', amount: '₹94,500', date: '2025-02-14', gstNo: '21ABCDE3456Y1Z5', status: 'Pending' },
  { id: 'INV-012', client: 'Luminary Pvt', amount: '₹37,600', date: '2025-03-25', gstNo: '07XYZAB7890A2B6', status: 'Cancelled' },
  { id: 'INV-013', client: 'Luminary Pvt', amount: '₹45,600', date: '2026-03-25', gstNo: '07XYZAB7890A2B6', status: 'Pending' },
  { id: 'INV-014', client: 'Luminary Pvt', amount: '₹45,600', date: '2026-03-25', gstNo: '07XYZAB7890A2B6', status: 'Open' },
]

const FINANCIAL_YEARS = [
  { label: 'All Years', value: 'all' },
  { label: 'FY 2025–26', value: '2025-26', start: '2025-04-01', end: '2026-03-31' },
  { label: 'FY 2024–25', value: '2024-25', start: '2024-04-01', end: '2025-03-31' },
  { label: 'FY 2023–24', value: '2023-24', start: '2023-04-01', end: '2024-03-31' },
]

const STATUS_OPTIONS = ['Pending', 'Open', 'Paid', 'Cancelled', 'Draft']

const getStatusColor = (status) => {
  const colors = {
    'Pending':   'bg-amber-100 text-amber-800',
    'Open':      'bg-green-100 text-green-800',
    'Update':    'bg-blue-100 text-blue-800',
    'Paid':      'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'Draft':     'bg-gray-100 text-gray-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// ─── Status Dropdown ────────────────────────────────────────────────────────
const StatusDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative w-fit" ref={ref}>
      <span
        onClick={() => setOpen(p => !p)}
        className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit cursor-pointer select-none ${getStatusColor(value)}`}
      >
        {value}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </span>
      {open && (
        <div
          className="absolute left-0 mt-1 w-36 bg-white rounded-lg border border-gray-200 shadow-lg z-30 overflow-hidden"
          style={{ animation: 'fadeSlideDown 0.12s ease' }}
        >
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => { onChange(s); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 transition-colors text-left"
            >
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(s)}`}>{s}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Action Dropdown ─────────────────────────────────────────────────────────
const ActionDropdown = ({ invoiceId, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(p => !p)}
        className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-md hover:bg-gray-100"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute right-0 mt-1 w-32 bg-white rounded-lg border border-gray-200 shadow-lg z-30 overflow-hidden"
          style={{ animation: 'fadeSlideDown 0.12s ease' }}
        >
          <button
            onClick={() => { setOpen(false); if (onEdit) onEdit(invoiceId) }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </button>
          <button
            onClick={() => { setOpen(false); if (onDelete) onDelete(invoiceId) }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

// ─── FY Filter ───────────────────────────────────────────────────────────────
const FYFilter = ({ selected, onChange }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = FINANCIAL_YEARS.find(f => f.value === selected)

  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
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
      {open && (
        <div
          className="absolute right-0 mt-1 w-40 bg-white rounded-lg border border-gray-200 shadow-lg z-30 overflow-hidden"
          style={{ animation: 'fadeSlideDown 0.12s ease' }}
        >
          {FINANCIAL_YEARS.map(fy => (
            <button
              key={fy.value}
              onClick={() => { onChange(fy.value); setOpen(false) }}
              className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors
                ${fy.value === selected ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {fy.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Mobile Card ─────────────────────────────────────────────────────────────
const InvoiceCard = ({ invoice, onStatusChange, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
    {/* Top row */}
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="text-sm text-gray-900">{invoice.id}</p>
        <p className="text-sm text-gray-600 mt-0.5">{invoice.client}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <StatusDropdown value={invoice.status} onChange={(s) => onStatusChange(invoice.id, s)} />
        <ActionDropdown invoiceId={invoice.id} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
    {/* Details row */}
    <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-gray-900 text-sm">{invoice.amount}</span>
        <span>{invoice.date}</span>
      </div>
      <span className="text-right truncate max-w-[140px]">{invoice.gstNo}</span>
    </div>
  </div>
)

// ─── Main Table ───────────────────────────────────────────────────────────────
const InvoiceTable = ({ externalFilter = 'All', externalSearch = '', onEdit, onDelete }) => {
  const [invoices, setInvoices] = useState(DUMMY_INVOICES)
  const [search, setSearch] = useState('')
  const [fyFilter, setFyFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const updateStatus = (id, newStatus) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv))
  }

  const filtered = invoices.filter(inv => {
    const q = (externalSearch || search).toLowerCase()
    const matchesSearch =
      inv.id.toLowerCase().includes(q) ||
      inv.client.toLowerCase().includes(q) ||
      inv.amount.toLowerCase().includes(q) ||
      inv.date.includes(q) ||
      inv.gstNo.toLowerCase().includes(q) ||
      inv.status.toLowerCase().includes(q)

    let matchesStatus = true
    if (externalFilter !== 'All') {
      matchesStatus = inv.status === externalFilter
    }

    let matchesFY = true
    if (fyFilter !== 'all') {
      const fy = FINANCIAL_YEARS.find(f => f.value === fyFilter)
      if (fy) matchesFY = inv.date >= fy.start && inv.date <= fy.end
    }

    return matchesSearch && matchesStatus && matchesFY
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedInvoices = filtered.slice(startIndex, startIndex + itemsPerPage)

  useEffect(() => { setCurrentPage(1) }, [search, fyFilter, externalFilter, externalSearch])

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        /* hide scrollbar on filter strip */
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
        <FYFilter selected={fyFilter} onChange={setFyFilter} />
      </div>

      {/* ── Mobile card list (< md) ── */}
      <div className="md:hidden">
        {paginatedInvoices.length > 0 ? (
          <div className="p-3 space-y-3">
            {paginatedInvoices.map((invoice, idx) => (
              <InvoiceCard
                key={`${invoice.id}-${idx}`}
                invoice={invoice}
                onStatusChange={updateStatus}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div className="px-4 py-10 text-center text-sm text-gray-500">No invoices found</div>
        )}
      </div>

      {/* ── Desktop / tablet table (≥ md) ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['ID', 'Client', 'Amount', 'Date', 'GST No.', 'Status', 'Action'].map(h => (
                <th key={h} className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-black-500 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedInvoices.length > 0 ? (
              paginatedInvoices.map((invoice, idx) => (
                <tr key={`${invoice.id}-${idx}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 lg:px-6 py-3.5 text-sm text-gray-900 whitespace-nowrap">{invoice.id}</td>
                  <td className="px-4 lg:px-6 py-3.5 text-sm text-gray-600 max-w-[160px] truncate">{invoice.client}</td>
                  <td className="px-4 lg:px-6 py-3.5 text-sm font-semibold text-gray-900 whitespace-nowrap">{invoice.amount}</td>
                  <td className="px-4 lg:px-6 py-3.5 text-sm text-gray-500 whitespace-nowrap">{invoice.date}</td>
                  <td className="px-4 lg:px-6 py-3.5 text-sm text-gray-500 whitespace-nowrap hidden lg:table-cell">{invoice.gstNo}</td>
                  <td className="px-4 lg:px-6 py-3.5">
                    <StatusDropdown value={invoice.status} onChange={(s) => updateStatus(invoice.id, s)} />
                  </td>
                  <td className="px-4 lg:px-6 py-3.5">
                    <ActionDropdown invoiceId={invoice.id} onEdit={onEdit} onDelete={onDelete} />
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
      {totalPages > 1 && (
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