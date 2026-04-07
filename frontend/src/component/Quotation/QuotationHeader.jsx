import React from 'react'

const QuotationHeader = ({ onCreateQuotation }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
      <div className="min-w-0 flex-1">
        <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-900 font-bold leading-snug">
          Create and manage quotations for your clients
        </h2>
      </div>
      <button
        onClick={onCreateQuotation}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 text-gray-900 font-semibold rounded-lg hover:bg-amber-500 active:bg-amber-600 transition-colors text-sm sm:text-base whitespace-nowrap flex-shrink-0"
      >
        <span className="text-lg font-bold">+</span>
        Quotation
      </button>
    </div>
  )
}

export default QuotationHeader
