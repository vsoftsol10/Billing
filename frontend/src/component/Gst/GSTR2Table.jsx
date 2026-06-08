import React, { useState } from 'react'

const STATUS_STYLES = {
  Pending: 'bg-orange-100 text-orange-700 border border-orange-200',
  Open: 'bg-green-100 text-green-700 border border-green-200',
  Update: 'bg-blue-100 text-blue-700 border border-blue-200',
  Paid: 'bg-teal-100 text-teal-700 border border-teal-200',
  Cancelled: 'bg-red-100 text-red-700 border border-red-200',
  Draft: 'bg-gray-100 text-gray-600 border border-gray-200',
  'Difference detected': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
}

const SAMPLE_DATA = [
  { id: '2026-01-14', supplier: 'Alpha Supplies', gst: '₹ 8,750', tax: '₹ 8,750', date: '2026-01-14', status: 'Pending' },
  { id: '2026-01-09', supplier: 'Beta Industries', gst: '₹ 4,550', tax: '₹ 4,550', date: '2026-01-09', status: 'Open' },
  { id: '2026-01-10a', supplier: 'Gamma Corp', gst: '₹ 2,950', tax: '₹ 2,950', date: '2026-01-10', status: 'Open' },
  { id: '2026-01-10b', supplier: 'Gamma Corp', gst: '₹ 2,950', tax: '₹ 2,950', date: '2026-01-10', status: 'Difference detected' },
  { id: '2026-01-10c', supplier: 'Gamma Corp', gst: '₹ 2,950', tax: '₹ 2,950', date: '2026-01-10', status: 'Difference detected' },
]

/* ── Action Menu ── */
const ActionMenu = ({ rowId, menuOpen, onToggle }) => (
  <div className="relative">
    <button
      onClick={() => onToggle(rowId)}
      className="text-gray-400 hover:text-gray-700 p-1 rounded transition-colors"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="5" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="12" cy="19" r="2" />
      </svg>
    </button>

    {menuOpen === rowId && (
      <div className="absolute right-0 top-6 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-40">
        {[
          { label: 'View' },
          { label: 'Edit' },
          { label: 'Download' },
          { label: 'Delete' },
        ].map(({ label }) => (
          <button
            key={label}
            onClick={() => {
              console.log(`${label} clicked for row ${rowId}`)
              onToggle(null)
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors text-gray-700"
          >
            {label}
          </button>
        ))}
      </div>
    )}
  </div>
)

const GSTR2Table = () => {
  const [menuOpen, setMenuOpen] = useState(null)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                GST No
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                GST Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Tax Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {SAMPLE_DATA.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{row.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{row.supplier}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{row.gst}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{row.tax}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{row.date}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                      STATUS_STYLES[row.status]
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <ActionMenu
                    rowId={row.id}
                    menuOpen={menuOpen}
                    onToggle={setMenuOpen}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GSTR2Table
