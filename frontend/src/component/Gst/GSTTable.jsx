import React, { useState, useMemo } from 'react'

const STATUS_STYLES = {
  Pending:  'bg-orange-100 text-orange-700 border border-orange-200',
  Open:     'bg-green-100 text-green-700 border border-green-200',
  Update:   'bg-blue-100 text-blue-700 border border-blue-200',
  Paid:     'bg-teal-100 text-teal-700 border border-teal-200',
  Canceled: 'bg-red-100 text-red-700 border border-red-200',
  Draft:    'bg-gray-100 text-gray-600 border border-gray-200',
}

const ROWS_PER_PAGE = 5

const SAMPLE_DATA = [
  { id: '2026-01-14', client: 'Globe Inc',        gst: '₹ 8,750',  tax: '₹ 8,750',  date: '2026-01-14', status: 'Pending'  },
  { id: '2026-01-09', client: 'Stark Industries', gst: '₹ 4,550',  tax: '₹ 4,550',  date: '2026-01-09', status: 'Open'     },
  { id: '2026-01-10a', client: 'Soylent Corp',    gst: '₹ 2,950',  tax: '₹ 2,950',  date: '2026-01-10', status: 'Open'     },
  { id: '2026-01-10b', client: 'Soylent Corp',    gst: '₹ 2,950',  tax: '₹ 2,950',  date: '2026-01-10', status: 'Update'   },
  { id: '2026-01-10c', client: 'Soylent Corp',    gst: '₹ 2,950',  tax: '₹ 2,950',  date: '2026-01-10', status: 'Update'   },
  { id: '2026-01-15', client: 'Wayne Enterprises',gst: '₹ 12,400', tax: '₹ 12,400', date: '2026-01-15', status: 'Paid'     },
  { id: '2026-01-16', client: 'Acme Corp',        gst: '₹ 5,300',  tax: '₹ 5,300',  date: '2026-01-16', status: 'Canceled' },
  { id: '2026-01-17', client: 'Umbrella Ltd',     gst: '₹ 7,100',  tax: '₹ 7,100',  date: '2026-01-17', status: 'Draft'    },
]

/* ── Action Menu ── */
const ActionMenu = ({ rowId, menuOpen, onToggle, onEdit, onDelete }) => (
  <div className="relative">
    <button
      onClick={() => onToggle(rowId)}
      className="text-gray-400 hover:text-gray-700 p-1 rounded transition-colors"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="5"  r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="12" cy="19" r="1.5" />
      </svg>
    </button>

    {menuOpen === rowId && (
      <div className="absolute right-4 top-8 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-36">
        {[
          { label: 'View',     action: () => { onToggle(null) } },
          { label: 'Edit',     action: () => { onEdit?.(rowId);   onToggle(null) } },
          { label: 'Download', action: () => { onToggle(null) } },
          { label: 'Delete',   action: () => { onDelete?.(rowId); onToggle(null) } },
        ].map(({ label, action }) => (
          <button
            key={label}
            onClick={action}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
              label === 'Delete' ? 'text-red-500' : 'text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    )}
  </div>
)

/* ── Status Badge ── */
const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[status] ?? ''}`}>
    {status}
    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </span>
)

/* ── Main Table ── */
const GSTTable = ({
  data = SAMPLE_DATA,
  externalFilter = 'All',
  externalSearch = '',
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen]       = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = useMemo(() => {
    return data.filter((row) => {
      const matchFilter =
        externalFilter === 'All' ||
        row.status.toLowerCase() === externalFilter.toLowerCase()

      const q = externalSearch.toLowerCase()
      const matchSearch =
        !q ||
        row.client.toLowerCase().includes(q) ||
        row.id.toLowerCase().includes(q) ||
        row.date.includes(q)

      return matchFilter && matchSearch
    })
  }, [data, externalFilter, externalSearch])

  // Reset to page 1 when filter/search changes
  React.useEffect(() => { setCurrentPage(1) }, [externalFilter, externalSearch])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const paginated  = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE)

  const handleToggle = (id) => setMenuOpen((prev) => (prev === id ? null : id))

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
              {['GST No.', 'Client', 'GST Amount', 'Tax Amount', 'Date', 'Status', 'Action'].map((col) => (
                <th key={col} className="px-4 py-3 font-bold whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400 text-sm">
                  No records found
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5 text-gray-600 text-xs whitespace-nowrap">
                    {row.id.replace(/[abc]$/, '')}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-gray-800 whitespace-nowrap">{row.client}</td>
                  <td className="px-4 py-3.5 text-gray-700 font-bold whitespace-nowrap">{row.gst}</td>
                  <td className="px-4 py-3.5 text-gray-700 font-bold whitespace-nowrap">{row.tax}</td>
                  <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">{row.date}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <ActionMenu
                      rowId={row.id}
                      menuOpen={menuOpen}
                      onToggle={handleToggle}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
        <span>Showing {paginated.length} of {filtered.length} entries</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-40"
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-2.5 py-1 rounded transition-colors ${
                currentPage === page
                  ? 'bg-yellow-400 text-gray-900 font-semibold'
                  : 'hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-40"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}

export default GSTTable