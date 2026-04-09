// QuotationPagination.jsx
import React from 'react'

const QuotationPagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 border-t border-gray-200">
      <div className="text-sm text-gray-600 text-center sm:text-left">
        Page <span className="font-semibold">{currentPage}</span> of{' '}
        <span className="font-semibold">{totalPages}</span>
      </div>
      <div className="flex gap-2 justify-center sm:justify-end">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex-1 sm:flex-none px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex-1 sm:flex-none px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default QuotationPagination