import React from 'react'

const statusStyles = {
  Pending: 'text-amber-500 bg-amber-50',
  Open: 'text-emerald-500 bg-emerald-50',
  Update: 'text-blue-500 bg-blue-50',
  Overdue: 'text-rose-500 bg-rose-50',
}

const transactions = [
  { id: '1019', client: 'Globe Inc', amount: '₹ 8,750', date: '2026-01-14', gst: '2026-01-14', status: 'Pending' },
  { id: '1022', client: 'Stark Industries', amount: '₹ 4,550', date: '2026-01-09', gst: '2026-01-09', status: 'Open' },
  { id: '1009', client: 'Saylent Corp', amount: '₹ 2,950', date: '2026-01-10', gst: '2026-01-10', status: 'Update' },
  { id: '1009', client: 'Saylent Corp', amount: '₹ 2,950', date: '2026-01-10', gst: '2026-01-10', status: 'Update' },
]

const RecentTransactions = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <p style={{ fontFamily: 'Sora, sans-serif' }} className="text-sm font-bold text-gray-700 mb-4 tracking-wide">
        Recent Transactions
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50">
              {['ID', 'Client', 'Amount', 'Date', 'GST No.', 'Status'].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-gray-400 pb-3 pr-6 last:pr-0 tracking-wide uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <td className="py-3 pr-6 text-gray-500 font-mono text-xs">{t.id}</td>
                <td className="py-3 pr-6 text-gray-800 font-medium">{t.client}</td>
                <td className="py-3 pr-6 text-gray-800 font-semibold">{t.amount}</td>
                <td className="py-3 pr-6 text-gray-400 text-xs">{t.date}</td>
                <td className="py-3 pr-6 text-gray-400 text-xs">{t.gst}</td>
                <td className="py-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusStyles[t.status] || 'text-gray-500 bg-gray-50'}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentTransactions