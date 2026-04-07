import React, { useState, useEffect, useRef } from 'react'
import QuotationPagination from './QuotationPagination'

const STATUS_OPTIONS = ['Open', 'Closed', 'Partial', 'Pending', 'Cancelled', 'Draft']

const statusClass = status => {
  const mapping = {
    Open: 'bg-green-100 text-green-800',
    Closed: 'bg-blue-100 text-blue-800',
    Partial: 'bg-indigo-100 text-indigo-800',
    Pending: 'bg-amber-100 text-amber-800',
    Cancelled: 'bg-red-100 text-red-800',
    Draft: 'bg-gray-100 text-gray-800',
  }
  return mapping[status] || 'bg-gray-100 text-gray-800'
}

const StatusDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onClick = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusClass(value)}`}
      >
        {value}
        <span className="text-xs">▾</span>
      </button>
      {open && (
        <div className="absolute z-30 mt-1 w-32 sm:w-40 bg-white border border-gray-200 rounded-lg shadow-md left-0 sm:left-auto">
          {STATUS_OPTIONS.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => { onChange(option); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-xs transition-colors ${option === value ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
            >
              <span className={`px-2 py-0.5 rounded-full ${statusClass(option)}`}>{option}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const ActionMenu = ({ quote, onView, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onClick = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(prev => !prev)} className="text-gray-500 hover:text-gray-700 p-1">
        •••
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-32 sm:w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
          <button onClick={() => { setOpen(false); onView(quote) }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">View</button>
          <button onClick={() => { setOpen(false); onEdit(quote) }} className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50">Edit</button>
          <button onClick={() => { setOpen(false); onDelete(quote) }} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
        </div>
      )}
    </div>
  )
}

// ─── Mobile Card ─────────────────────────────────────────────────────────────
const QuotationCard = ({ quote, onStatusChange, onView, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
    {/* Top row */}
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="text-sm font-bold text-gray-900">{quote.id}</p>
        <p className="text-sm text-gray-600 mt-0.5">{quote.client}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <StatusDropdown value={quote.status} onChange={(s) => onStatusChange(quote.id, s)} />
        <ActionMenu quote={quote} onView={onView} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
    {/* Details row */}
    <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-gray-900 text-sm">{quote.amount}</span>
        <span>{quote.date}</span>
      </div>
    </div>
  </div>
)

const DUMMY_QUOTATIONS = [
  { id: '1001', client: 'Globe Inc', amount: '₹ 8,750', date: '2023-01-14', status: 'Pending' },
  { id: '1002', client: 'Stark Industries', amount: '₹ 4,550', date: '2023-02-09', status: 'Open' },
  { id: '1003', client: 'Soylent Corp', amount: '₹ 2,950', date: '2023-03-10', status: 'Open' },
  { id: '1004', client: 'Wayne Enterprises', amount: '₹ 3,150', date: '2024-04-22', status: 'Closed' },
  { id: '1005', client: 'Umbrella Corp', amount: '₹ 5,450', date: '2024-05-17', status: 'Partial' },
  { id: '1006', client: 'Nexus LLC', amount: '₹ 6,840', date: '2024-06-08', status: 'Cancelled' },
  { id: '1007', client: 'Horizon Labs', amount: '₹ 9,990', date: '2024-07-19', status: 'Draft' },
  { id: '1008', client: 'Aperture', amount: '₹ 12,100', date: '2025-08-30', status: 'Open' },
  { id: '1009', client: 'Acme Corp', amount: '₹ 7,320', date: '2025-09-04', status: 'Pending' },
  { id: '1010', client: 'Cyberdyne', amount: '₹ 14,750', date: '2025-10-13', status: 'Closed' },
  { id: '1011', client: 'Soylent Corp', amount: '₹ 2,950', date: '2026-01-10', status: 'Open' },
  { id: '1012', client: 'Umbrella Corp', amount: '₹ 11,450', date: '2026-02-03', status: 'Cancelled' },
  { id: '1013', client: 'Wayne Enterprises', amount: '₹ 19,250', date: '2026-03-12', status: 'Draft' },
  { id: '1014', client: 'Stark Industries', amount: '₹ 8,100', date: '2026-04-08', status: 'Partial' },
  { id: '1015', client: 'Globe Inc', amount: '₹ 5,200', date: '2026-05-11', status: 'Open' },
  { id: '1016', client: 'Nexus LLC', amount: '₹ 3,700', date: '2026-06-27', status: 'Pending' },
]

const QuotationTable = ({ quotations, activeTab, searchText, timeFrame, selectedYear, selectedMonth, currentPage, onPageChange, onStatusChange, onView, onEdit, onDelete }) => {
  const page = currentPage || 1
  const perPage = 10

  const filtered = quotations.filter(q => {
    const matchesTab = activeTab === 'All' || q.status === activeTab
    const term = searchText?.toLowerCase() || ''
    const matchesSearch =
      q.id.toLowerCase().includes(term) ||
      q.client.toLowerCase().includes(term) ||
      q.amount.toLowerCase().includes(term) ||
      q.date.toLowerCase().includes(term) ||
      q.status.toLowerCase().includes(term)

    const [year = '', month = ''] = q.date.split('-')
    let matchesTime = true

    if (timeFrame === 'Yearly' && selectedYear) {
      matchesTime = year === selectedYear
    }

    if (timeFrame === 'Monthly' && selectedYear) {
      matchesTime = year === selectedYear && (selectedMonth ? month === selectedMonth : true)
    }

    return matchesTab && matchesSearch && matchesTime
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* ── Mobile card list (< md) ── */}
      <div className="md:hidden">
        {paged.length > 0 ? (
          <div className="p-3 space-y-3">
            {paged.map((quote, idx) => (
              <QuotationCard
                key={`${quote.id}-${idx}`}
                quote={quote}
                onStatusChange={onStatusChange}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div className="px-4 py-10 text-center text-sm text-gray-500">No quotations found</div>
        )}
      </div>

      {/* ── Desktop / tablet table (≥ md) ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['ID', 'Client', 'Amount', 'Date', 'Status', 'Action'].map(h => (
                <th key={h} className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paged.length > 0 ? (
              paged.map((quote, idx) => (
                <tr key={`${quote.id}-${idx}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 lg:px-6 py-3.5 text-sm font-semibold text-gray-900 whitespace-nowrap">{quote.id}</td>
                  <td className="px-4 lg:px-6 py-3.5 text-sm text-gray-600 max-w-[160px] truncate">{quote.client}</td>
                  <td className="px-4 lg:px-6 py-3.5 text-sm font-semibold text-gray-900 whitespace-nowrap">{quote.amount}</td>
                  <td className="px-4 lg:px-6 py-3.5 text-sm text-gray-500 whitespace-nowrap">{quote.date}</td>
                  <td className="px-4 lg:px-6 py-3.5">
                    <StatusDropdown value={quote.status} onChange={(s) => onStatusChange(quote.id, s)} />
                  </td>
                  <td className="px-4 lg:px-6 py-3.5">
                    <ActionMenu quote={quote} onView={onView} onEdit={onEdit} onDelete={onDelete} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500">No quotations found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <QuotationPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}

export { DUMMY_QUOTATIONS }
export default QuotationTable
