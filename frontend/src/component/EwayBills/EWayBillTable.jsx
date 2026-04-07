import React, { useState, useMemo } from 'react'

const STATUS_STYLES = {
  Pending:  'bg-orange-100 text-orange-700 border border-orange-200',
  Open:     'bg-green-100  text-green-700  border border-green-200',
  Update:   'bg-teal-100   text-teal-700   border border-teal-200',
  Success:  'bg-green-100  text-green-700  border border-green-200',
  Failed:   'bg-red-100    text-red-700    border border-red-200',
  Canceled: 'bg-gray-100   text-gray-600   border border-gray-200',
}

const ROWS_PER_PAGE = 7

const SAMPLE_DATA = [
  { id: '1019', client: 'Globe Inc',         amount: '₹ 8,750',  date: '2026-01-14', status: 'Pending'  },
  { id: '1022', client: 'Stark Industries',  amount: '₹ 4,550',  date: '2026-01-09', status: 'Open'     },
  { id: '1009', client: 'Soylent Corp',      amount: '₹ 2,950',  date: '2026-01-10', status: 'Open'     },
  { id: '1009', client: 'Soylent Corp',      amount: '₹ 2,950',  date: '2026-01-10', status: 'Update'   },
  { id: '1009', client: 'Soylent Corp',      amount: '₹ 2,950',  date: '2026-01-10', status: 'Update'   },
  { id: '1031', client: 'Wayne Enterprises', amount: '₹ 12,400', date: '2026-01-15', status: 'Success'  },
  { id: '1045', client: 'Acme Corp',         amount: '₹ 5,300',  date: '2026-01-16', status: 'Failed'   },
  { id: '1052', client: 'Umbrella Ltd',      amount: '₹ 7,100',  date: '2026-01-17', status: 'Canceled' },
]

/* ── Status Badge ── */
const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600'}`}>
    {status}
    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </span>
)

/* ── Row Action Icons ── */
const RowActions = ({ rowId, onView, onEdit, onDelete }) => (
  <div className="flex items-center gap-3">
    {/* View */}
    <button
      onClick={() => onView?.(rowId)}
      title="View"
      className="text-gray-400 hover:text-gray-700 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    </button>

    {/* Edit */}
    <button
      onClick={() => onEdit?.(rowId)}
      title="Edit"
      className="text-gray-400 hover:text-gray-700 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H8v-2.414a2 2 0 01.586-1.414z" />
      </svg>
    </button>

    {/* Delete */}
    <button
      onClick={() => onDelete?.(rowId)}
      title="Delete"
      className="text-gray-400 hover:text-red-500 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <polyline points="3 6 5 6 21 6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m5 0V4a1 1 0 011-1h2a1 1 0 011 1v2" />
      </svg>
    </button>
  </div>
)

/* ── Main Table ── */
const EWayBillTable = ({
  data = SAMPLE_DATA,
  externalFilter = 'All',
  externalSearch = '',
  onView,
  onEdit,
  onDelete,
}) => {
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
        row.id.includes(q) ||
        row.date.includes(q)

      return matchFilter && matchSearch
    })
  }, [data, externalFilter, externalSearch])

  React.useEffect(() => { setCurrentPage(1) }, [externalFilter, externalSearch])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const paginated  = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
              {['ID', 'Client', 'Amount', 'Date', 'Status', 'Action'].map((col) => (
                <th key={col} className="px-4 py-3 font-medium whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                  No records found
                </td>
              </tr>
            ) : (
              paginated.map((row, idx) => (
                <tr key={`${row.id}-${idx}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5 text-gray-600 font-mono text-xs whitespace-nowrap">{row.id}</td>
                  <td className="px-4 py-3.5 font-medium text-gray-800 whitespace-nowrap">{row.client}</td>
                  <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap">{row.amount}</td>
                  <td className="px-4 py-3.5 text-gray-500 font-mono text-xs whitespace-nowrap">{row.date}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <RowActions
                      rowId={row.id}
                      onView={onView}
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

export default EWayBillTable