import React, { useState } from 'react'

const InvoiceFilters = ({ onFilterChange, onSearchChange }) => {
  const [activeFilter, setActiveFilter] = useState('All')

  const filters = ['All', 'Pending', 'Open', 'Paid', 'Cancelled', 'Draft']

  const handleFilterClick = (filter) => {
    setActiveFilter(filter)
    onFilterChange(filter)
  }

  return (
    <div className="mb-4 sm:mb-6">
      {/* Scrollable filter chips — no wrapping on mobile, scroll instead */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:pb-0 scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            className={`whitespace-nowrap flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm
              ${activeFilter === filter
                ? 'bg-amber-400 text-gray-900 shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300'
              }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  )
}

export default InvoiceFilters