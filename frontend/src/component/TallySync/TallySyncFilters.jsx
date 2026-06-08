import React, { useState } from 'react'

const TallySyncFilters = ({ activeFilter, onFilterChange, searchQuery, onSearchChange }) => {
  const filters = ['All', 'Pending', 'Paid', 'Canceled', 'Draft']

  return (
    <div className="mb-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === filter
                ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
        </div>
        <button className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 whitespace-nowrap">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM10 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm7 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm0-11a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          Filters
        </button>
      </div>
    </div>
  )
}

export default TallySyncFilters
