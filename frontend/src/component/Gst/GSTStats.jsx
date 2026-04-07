import React from 'react'

const statConfig = [
  {
    key: 'totalCollected',
    label: 'Total GST Collected',
    prefix: '₹',
    sub: '12% from last month',
    icon: (
      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 16v-4" />
      </svg>
    ),
  },
  {
    key: 'inputTaxCredit',
    label: 'Input Tax Credit',
    prefix: '₹',
    sub: '12% from last month',
    icon: (
      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 10h20" />
      </svg>
    ),
  },
  {
    key: 'totalFiled',
    label: 'Total GST Collected',
    prefix: '₹',
    sub: '12% from last month',
    icon: (
      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v13a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    key: 'pending',
    label: 'Pending',
    prefix: '',
    sub: 'Pending filing',
    accent: true,
    icon: (
      <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01" />
      </svg>
    ),
  },
]

const GSTStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statConfig.map((s) => (
        <div
          key={s.key}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start justify-between"
        >
          <div>
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.accent ? 'text-gray-800' : 'text-gray-900'}`}>
              {s.prefix}{stats[s.key]?.toLocaleString?.() ?? stats[s.key]}
            </p>
            <p className={`text-xs mt-1 ${s.accent ? 'text-gray-500' : 'text-gray-400'}`}>
              {s.sub}
            </p>
          </div>
          <div className="mt-1">{s.icon}</div>
        </div>
      ))}
    </div>
  )
}

export default GSTStats