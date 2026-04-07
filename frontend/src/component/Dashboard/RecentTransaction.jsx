import React, { useState } from 'react'

const statusStyles = {
  Pending: 'text-amber-700 bg-amber-50',
  Open:    'text-emerald-700 bg-emerald-50',
  Update:  'text-blue-700 bg-blue-50',
  Overdue: 'text-rose-700 bg-rose-50',
}

const transactions = [
  { id: '1019', client: 'Globe Inc',       amount: '₹ 8,750', date: '2026-01-14', gst: '2026-01-14', status: 'Pending' },
  { id: '1022', client: 'Stark Industries',amount: '₹ 4,550', date: '2026-01-09', gst: '2026-01-09', status: 'Open'    },
  { id: '1009', client: 'Soylent Corp',    amount: '₹ 2,950', date: '2026-01-10', gst: '2026-01-10', status: 'Update'  },
  { id: '1009', client: 'Soylent Corp',    amount: '₹ 2,950', date: '2026-01-10', gst: '2026-01-10', status: 'Update'  },
]

const RecentTransactions = () => {
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
      <p
        style={{ fontFamily: 'Sora, sans-serif' }}
        className="text-sm font-bold text-gray-700 mb-4 tracking-wide"
      >
        Recent Transactions
      </p>

      {/* Desktop / Tablet table (hidden on mobile) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50">
              {['ID', 'Client', 'Amount', 'Date', 'GST No.', 'Status'].map((h) => (
                <th
                  key={h}
                  className="text-left text-xs font-semibold text-gray-400 pb-3 pr-4 last:pr-0 tracking-wide uppercase whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr
                key={i}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-3 pr-4 text-gray-500 font-mono text-xs">{t.id}</td>
                <td className="py-3 pr-4 text-gray-800 font-medium whitespace-nowrap">{t.client}</td>
                <td className="py-3 pr-4 text-gray-800 font-semibold whitespace-nowrap">{t.amount}</td>
                <td className="py-3 pr-4 text-gray-400 text-xs whitespace-nowrap">{t.date}</td>
                <td className="py-3 pr-4 text-gray-400 text-xs whitespace-nowrap">{t.gst}</td>
                <td className="py-3">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      statusStyles[t.status] || 'text-gray-500 bg-gray-50'
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list (shown only on mobile) */}
      <div className="sm:hidden space-y-3">
        {transactions.map((t, i) => (
          <div
            key={i}
            className="border border-gray-100 rounded-xl p-3 cursor-pointer hover:bg-gray-50/50 transition-colors"
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            {/* Row header */}
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{t.client}</p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">#{t.id}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                    statusStyles[t.status] || 'text-gray-500 bg-gray-50'
                  }`}
                >
                  {t.status}
                </span>
                <p className="text-sm font-bold text-gray-900">{t.amount}</p>
              </div>
            </div>

            {/* Expandable details */}
            {expanded === i && (
              <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-y-2 text-xs">
                <span className="text-gray-400 uppercase tracking-wide font-medium">Date</span>
                <span className="text-gray-600 text-right">{t.date}</span>
                <span className="text-gray-400 uppercase tracking-wide font-medium">GST No.</span>
                <span className="text-gray-600 text-right font-mono">{t.gst}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentTransactions