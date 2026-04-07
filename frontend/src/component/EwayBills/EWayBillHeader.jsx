import React from 'react'

const EWayBillHeader = ({ onConnect }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        {/* <h1 className="text-2xl font-bold text-gray-900">E-Way Bills</h1> */}
        <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-900 font-bold leading-snug">
          Generate and track your e-way bills efficiently
        </h2>
      </div>
      <button
        onClick={onConnect}
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
        Connect to E-way Bills
      </button>
    </div>
  )
}

export default EWayBillHeader