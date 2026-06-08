import React from 'react'

const FilingStatus = () => {
  const filings = [
    {
      id: 1,
      form: 'GSTR - 1',
      dueDate: '20 April 2026',
      status: 'Due in 2 days',
      statusColor: 'text-orange-600',
    },
    {
      id: 2,
      form: 'GSTR - 2',
      dueDate: '20 April 2026',
      status: 'Due in 2 days',
      statusColor: 'text-orange-600',
    },
    {
      id: 3,
      form: 'GSTR - 1',
      dueDate: '20 April 2026',
      status: 'Due in 2 days',
      statusColor: 'text-orange-600',
    },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Filing Status
      </h3>

      <div className="space-y-2">
        {filings.map((filing) => (
          <div
            key={filing.id}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-3"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <svg
                className="w-5 h-5 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{filing.form}</p>
                <p className="text-xs text-gray-500">Due: {filing.dueDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
              <p className={`text-xs font-medium whitespace-nowrap ${filing.statusColor}`}>
                {filing.status}
              </p>
              <button className="px-3 py-1.5 border border-green-300 bg-green-50 rounded text-xs font-medium text-green-700 hover:bg-green-100 transition-colors whitespace-nowrap">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FilingStatus
