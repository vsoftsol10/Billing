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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
      {/* Tabs */}
      <div className="flex gap-1 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-yellow-400 text-gray-900'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-2">
        <div className="relative">
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
            placeholder="Search"
            value={search}
            onChange={handleSearch}
            className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-300 w-44"
          />
        </div>
        <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M11 20h2" />
          </svg>
          Filters
        </button>
      </div>
    </div>
  )
}

export default EWayBillFilters