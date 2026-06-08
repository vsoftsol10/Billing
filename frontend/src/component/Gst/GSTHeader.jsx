import React from 'react'

const GSTHeader = ({ onCreateGST, activeTab, onTabChange }) => {
  const tabs = ['Overview', 'GSTR-1', 'GSTR-2']

  return (
    <div className="mb-6">
      {/* Header with title and subtitle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">GST</h1>
          <p className="text-gray-600">Manage your GST filings, taxes, and compliance</p>
        </div>
        <button
          onClick={onCreateGST}
          className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 transition-colors text-gray-900 font-semibold text-sm px-6 py-2.5 rounded-lg shadow-sm whitespace-nowrap h-fit"
        >
          Re-login
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange?.(tab)}
            className={`pb-3 font-medium text-sm transition-colors relative ${
              activeTab === tab
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default GSTHeader