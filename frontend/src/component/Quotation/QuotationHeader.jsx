import React from 'react'

const QuotationHeader = ({ onCreateQuotation }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div className="min-w-0">
        <h2 className="text-base sm:text-lg text-gray-900 font-bold mt-1 leading-snug">
          Create and manage quotations for your clients
        </h2>
      </div>
      <button
        onClick={onCreateQuotation}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-400 text-gray-900 font-semibold rounded-lg hover:bg-amber-500 transition-colors whitespace-nowrap self-start sm:self-auto shrink-0"
      >
        <span className="text-lg font-bold leading-none">+</span>
        Create Quotation
      </button>
    </div>
  )
}

export default QuotationHeader