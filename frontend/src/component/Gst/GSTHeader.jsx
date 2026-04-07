import React from 'react'

const GSTHeader = ({ onCreateGST }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage your GST filings, taxes, and compliance
        </p>
      </div>
      <button
        onClick={onCreateGST}
        className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 transition-colors text-gray-900 font-semibold text-sm px-4 py-2.5 rounded-lg shadow-sm whitespace-nowrap"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        GST
      </button>
    </div>
  )
}

export default GSTHeader