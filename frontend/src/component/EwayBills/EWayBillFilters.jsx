import React, { useState } from 'react'

const TABS = ['All', 'Pending', 'Success', 'Failed', 'Canceled']

const EWayBillFilters = ({ onFilterChange, onSearchChange }) => {
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    onFilterChange?.(tab)
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    onSearchChange?.(e.target.value)
  }

  return (
    <>
      <style>{`
        /* hide scrollbar on filter strip */
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="mb-4 sm:mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`whitespace-nowrap shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm
                ${activeTab === tab
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          <div className="relative flex-1 min-w-50 sm:min-w-70 lg:min-w-75">
            <svg
              className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search e-way bills..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>

          <button className="shrink-0 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors whitespace-nowrap">
            Filters
          </button>
        </div>
      </div>
    </>
  )
}

export default EWayBillFilters