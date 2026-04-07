import React from 'react'

const EWayBillHeader = ({ onConnect }) => {
  return (
    <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6 min-w-0">
      <div className="min-w-0 flex-1 overflow-hidden">
        <h2 className="truncate whitespace-nowrap text-sm sm:text-base lg:text-lg xl:text-xl text-gray-900 font-bold leading-snug">
          Generate and track e-way bills efficiently
        </h2>
      </div>
      <button
        onClick={onConnect}
        className="inline-flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 transition-colors text-gray-900 font-semibold rounded-lg shadow-sm text-xs sm:text-sm whitespace-nowrap shrink-0"
      >
        <svg
          className="w-3 h-3 sm:w-4 sm:h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span className="hidden sm:inline">Connect to E-way Bills</span>
        <span className="sm:hidden">Connect</span>
      </button>
    </div>
  )
}

export default EWayBillHeader