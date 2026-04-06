import React from 'react'

const QuotationHeader = ({ onCreateQuotation }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-lg text-gray-900 font-bold  mt-1">Create and manage quotations for your clients</h2>
      </div>
      <button
        onClick={onCreateQuotation}
        className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-gray-900 font-semibold rounded-lg hover:bg-amber-500 transition-colors"
      >
        <span className="text-lg font-bold">+</span>
        Quotation
      </button>
    </div>
  )
}

export default QuotationHeader
