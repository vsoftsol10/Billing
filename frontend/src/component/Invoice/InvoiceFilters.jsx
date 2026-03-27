import React, { useState } from 'react'

const InvoiceFilters = ({ onFilterChange, onSearchChange }) => {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filters = ['All', 'Pending', 'Open', 'Paid', 'Cancelled', 'Draft']

  const handleFilterClick = (filter) => {
    setActiveFilter(filter)
    onFilterChange(filter)
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearchChange(value)
  }

  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div className="flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            className={`px-4 py-2 rounded-lg font-medium transition-all text-sm
              ${activeFilter === filter
                ? 'bg-amber-400 text-gray-900'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
