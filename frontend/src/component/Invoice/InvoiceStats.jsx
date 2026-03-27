import React from 'react'

const InvoiceStats = ({ stats }) => {
  const StatCard = ({ title, value, bgColor, textColor, iconBg, children }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-3 ${textColor}`}>{value}</p>
        </div>
        <div className={`${iconBg} p-3 rounded-lg flex-shrink-0`}>
          {children}
        </div>
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Invoices"
        value={stats?.total || 0}
        textColor="text-gray-600"
        iconBg="bg-gray-100"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="13" x2="8" y2="13"/>
          <line x1="12" y1="17" x2="8" y2="17"/>
        </svg>
      </StatCard>

      <StatCard
        title="Pending"
        value={stats?.pending || 0}
        textColor="text-amber-600"
        iconBg="bg-amber-100"
      >
        {/* Clock — waiting/pending */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      </StatCard>

      <StatCard
        title="Paid"
        value={stats?.paid || 0}
        textColor="text-green-600"
        iconBg="bg-green-100"
      >
        {/* Badge check — clearly "approved / paid" */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
          <path d="M12 2l2.6 2.3 3.4-.4 1 3.2 2.8 1.9-1 3.3 1 3.3-2.8 1.9-1 3.2-3.4-.4L12 22l-2.6-2.3-3.4.4-1-3.2L2.2 15l1-3.3-1-3.3L5 6.5l1-3.2 3.4.4z"/>
          <polyline points="9 12 11 14 15 10"/>
        </svg>
      </StatCard>

      <StatCard
        title="Overdue"
        value={stats?.overdue || 0}
        textColor="text-red-600"
        iconBg="bg-red-100"
      >
        {/* Alert circle — overdue/warning */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </StatCard>
    </div>
  )
}

export default InvoiceStats