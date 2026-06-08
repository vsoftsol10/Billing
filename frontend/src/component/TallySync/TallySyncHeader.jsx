import React from 'react'

const TallySyncHeader = ({ onAddNew }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div>
        {/* <h1 className="text-3xl font-bold text-gray-900">Tally Sync</h1> */}
        <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-900 font-bold leading-snug">Sync your data seamlessly with Tally</h2>
      </div>
      <button
        onClick={onAddNew}
        className="bg-yellow-400 hover:bg-yellow-500 transition-colors text-gray-900 font-semibold text-sm px-6 py-2.5 rounded-lg shadow-sm whitespace-nowrap flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
        Add New
      </button>
    </div>
  )
}

export default TallySyncHeader
