import React from 'react'

const tabs = ['All', 'Open', 'Closed', 'Partial', 'Cancelled', 'Draft']

const QuotationTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {tabs.map(tab => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === tab
              ? 'bg-amber-400 text-gray-900'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export default QuotationTabs
