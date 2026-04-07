import React, { useState, useMemo } from 'react'
import EWayBillPagination from './EWayBillPagination'

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
  </span>
)

/* ── Mobile Card ───────────────────────────────────────────────────────────── */
const EWayBillCard = ({ bill, onView, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
    {/* Top row */}
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="text-sm font-bold text-gray-900">{bill.id}</p>
        <p className="text-sm text-gray-600 mt-0.5">{bill.client}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <StatusBadge status={bill.status} />
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView?.(bill.id)}
            title="View"
            className="text-gray-400 hover:text-gray-700 transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => onEdit?.(bill.id)}
            title="Edit"
            className="text-gray-400 hover:text-gray-700 transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H8v-2.414a2 2 0 01.586-1.414z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete?.(bill.id)}
            title="Delete"
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m5 0V4a1 1 0 011-1h2a1 1 0 011 1v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    {/* Details row */}
    <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-gray-900 text-sm">{bill.amount}</span>
        <span>{bill.date}</span>
      </div>
    </div>
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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* ── Mobile card list (< md) ── */}
      <div className="md:hidden">
        {paginated.length > 0 ? (
          <div className="p-3 space-y-3">
            {paginated.map((bill, idx) => (
              <EWayBillCard
                key={`${bill.id}-${idx}`}
                bill={bill}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div className="px-4 py-10 text-center text-sm text-gray-500">No e-way bills found</div>
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
            {paginated.length > 0 ? (
              paginated.map((bill, idx) => (
                <tr key={`${bill.id}-${idx}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 lg:px-6 py-3.5 text-sm font-semibold text-gray-900 whitespace-nowrap">{bill.id}</td>
                  <td className="px-4 lg:px-6 py-3.5 text-sm text-gray-600 max-w-40 truncate">{bill.client}</td>
                  <td className="px-4 lg:px-6 py-3.5 text-sm font-semibold text-gray-900 whitespace-nowrap">{bill.amount}</td>
                  <td className="px-4 lg:px-6 py-3.5 text-sm text-gray-500 whitespace-nowrap">{bill.date}</td>
                  <td className="px-4 lg:px-6 py-3.5">
                    <StatusBadge status={bill.status} />
                  </td>
                  <td className="px-4 lg:px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView?.(bill.id)}
                        title="View"
                        className="text-gray-500 hover:text-gray-900 transition-colors p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onEdit?.(bill.id)}
                        title="Edit"
                        className="text-gray-500 hover:text-gray-900 transition-colors p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H8v-2.414a2 2 0 01.586-1.414z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete?.(bill.id)}
                        title="Delete"
                        className="text-gray-500 hover:text-red-500 transition-colors p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <polyline points="3 6 5 6 21 6" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m5 0V4a1 1 0 011-1h2a1 1 0 011 1v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500">No e-way bills found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <EWayBillPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}

export default EWayBillTable