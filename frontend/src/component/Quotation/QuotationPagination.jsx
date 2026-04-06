import React from 'react'

const QuotationPagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-between mt-6 px-6 py-3 border-t border-gray-200">
      <div className="text-sm text-gray-600">
        Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default QuotationPagination
