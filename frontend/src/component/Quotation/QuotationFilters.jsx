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
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
      <div className="flex flex-wrap gap-2">
        {statusOptions.map(status => (
          <button
            key={status}
            type="button"
            onClick={() => onFilterChange(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === status
                ? 'bg-amber-400 text-gray-900'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="search"
            placeholder="Search quotations..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-72 pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setOpenFilter((prev) => !prev)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Filters
          </button>

          {openFilter && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-40 p-3">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500">Time frame</label>
                <div className="flex gap-2 flex-wrap">
                  {timeFrames.map(frame => (
                    <button
                      key={frame}
                      onClick={() => onTimeFrameChange(frame)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold ${
                        timeFrame === frame ? 'bg-amber-400 text-gray-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {frame}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <label className="text-xs font-semibold text-gray-500">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => onYearChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm"
                >
                  <option value="">All</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </div>

              {timeFrame === 'Monthly' && (
                <div className="mt-3 space-y-2">
                  <label className="text-xs font-semibold text-gray-500">Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => onMonthChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm"
                  >
                    <option value="">All</option>
                    {monthOptions.map((month) => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={onClearTimeFilters}
                  className="text-xs text-neutral-500 hover:text-neutral-700"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setOpenFilter(false)}
                  className="px-3 py-1.5 bg-amber-400 text-white text-xs rounded-md"
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
