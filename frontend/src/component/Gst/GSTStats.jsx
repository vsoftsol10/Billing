import React from 'react'

const statConfig = [
  {
    key: 'totalCollected',
    label: 'Total Gst Collected',
    prefix: '₹ ',
    sub: 'GST filed month',
    icon: (
      <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
      </svg>
    ),
  },
  {
    key: 'inputTaxCredit',
    label: 'Input Tax Credit',
    prefix: '₹',
    sub: 'GST filed month',
    icon: (
      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18" />
      </svg>
    ),
  },
  {
    key: 'totalFiled',
    label: 'Total Gst Collected',
    prefix: '₹ ',
    sub: 'GST filed month',
    icon: (
      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
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
      <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
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
          className="bg-white rounded-lg border border-gray-200 p-4 flex items-start justify-between"
        >
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-2 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold ${s.accent ? 'text-gray-800' : 'text-gray-900'}`}>
              {s.prefix}{stats[s.key]?.toLocaleString?.() ?? stats[s.key]}
            </p>
            <p className={`text-xs mt-2 ${s.accent ? 'text-gray-500' : 'text-gray-400'}`}>
              {s.sub}
            </p>
          </div>
          <div className="ml-3 flex-shrink-0">
            {s.icon}
          </div>
        </div>
      ))}
    </div>
  )
}

export default GSTStats