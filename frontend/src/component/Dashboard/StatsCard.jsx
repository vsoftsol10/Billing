import React from 'react'

const StatCard = ({ label, value, sub, icon, trend }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex flex-col gap-3 hover:shadow-md hover:shadow-amber-50 transition-shadow duration-200">
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium mb-1 truncate">{label}</p>
        <p
          style={{ fontFamily: 'Sora, sans-serif' }}
          className="text-lg sm:text-xl font-bold text-gray-900 truncate"
        >
          {value}
        </p>
        {sub && (
          <p className="text-xs text-gray-400 mt-1 truncate">{sub}</p>
        )}
      </div>
      <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
        {icon}
      </div>
    </div>
    {trend && (
      <div
        className={`text-xs font-semibold flex items-center gap-1 ${
          trend.up ? 'text-emerald-500' : 'text-rose-400'
        }`}
      >
        <svg
          width="12" height="12" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
        >
          {trend.up
            ? <polyline points="18 15 12 9 6 15" />
            : <polyline points="6 9 12 15 18 9" />
          }
        </svg>
        {trend.text}
      </div>
    )}
  </div>
)

const StatCards = () => {
  const stats = [
    {
      label: 'Invoice',
      value: '₹ 48,200',
      sub: '12 paid • 5 pending',
      trend: null,
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
    },
    {
      label: 'GST Payable',
      value: '₹ 18,240',
      sub: '25% of total revenue',
      trend: null,
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
    },
    {
      label: 'Pending Payment',
      value: '₹ 63,500',
      sub: '3 Overdue',
      trend: { up: false, text: '3 overdue' },
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: 'Total Revenue',
      value: '₹ 48,200',
      sub: null,
      trend: { up: true, text: '+5% Last month' },
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  )
}

export default StatCards