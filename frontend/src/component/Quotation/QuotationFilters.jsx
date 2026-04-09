// QuotationFilters.jsx
import React, { useState, useRef, useEffect } from 'react'

const statusOptions = ['All', 'Open', 'Closed', 'Partial', 'Cancelled', 'Draft']
const timeFrames = ['All', 'Yearly', 'Monthly']
const monthOptions = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
]

const QuotationFilters = ({
  activeFilter,
  onFilterChange,
  searchText,
  onSearchChange,
  timeFrame,
  onTimeFrameChange,
  selectedYear,
  onYearChange,
  selectedMonth,
  onMonthChange,
  onClearTimeFilters,
}) => {
  const [openFilter, setOpenFilter] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpenFilter(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="flex flex-col gap-2 mb-4">

      {/* Status tab strip — single scrollable row, never wraps */}
      <div className="relative">
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10" />
        <div className="flex overflow-x-auto gap-1.5 pb-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {statusOptions.map(status => (
            <button
              key={status}
              type="button"
              onClick={() => onFilterChange(status)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                activeFilter === status
                  ? 'bg-amber-400 text-gray-900 border-amber-400 shadow-sm'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Search + Filter row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 min-w-0">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 shrink-0"
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search quotations..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100"
          />
        </div>

        <div className="relative shrink-0" ref={ref}>
          <button
            type="button"
            onClick={() => setOpenFilter(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
              openFilter
                ? 'bg-amber-400 border-amber-400 text-gray-900'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
            </svg>
            <span>Filters</span>
          </button>

          {openFilter && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-40 p-4">

              {/* Time frame */}
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Time frame
              </p>
              <div className="flex gap-1.5 flex-wrap mb-4">
                {timeFrames.map(frame => (
                  <button
                    key={frame}
                    type="button"
                    onClick={() => onTimeFrameChange(frame)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      timeFrame === frame
                        ? 'bg-amber-400 border-amber-400 text-gray-900'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {frame}
                  </button>
                ))}
              </div>

              {/* Year */}
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Year
              </p>
              <select
                value={selectedYear}
                onChange={(e) => onYearChange(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-amber-400 mb-4"
              >
                <option value="">All years</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>

              {/* Month */}
              {timeFrame === 'Monthly' && (
                <>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Month
                  </p>
                  <select
                    value={selectedMonth}
                    onChange={(e) => onMonthChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-amber-400 mb-4"
                  >
                    <option value="">All months</option>
                    {monthOptions.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => { onClearTimeFilters(); setOpenFilter(false) }}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={() => setOpenFilter(false)}
                  className="px-4 py-1.5 bg-amber-400 text-gray-900 text-xs font-semibold rounded-lg hover:bg-amber-500 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    
  )
}

export default QuotationFilters