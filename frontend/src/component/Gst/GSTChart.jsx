import React from 'react'

const GSTChart = () => {
  // Sample data for the last 6 months
  const months = ['Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026']
  const outputGST = [1.2, 1.5, 1.8, 1.6, 2.0, 2.3]
  const inputTaxCredit = [0.8, 1.0, 1.1, 1.2, 1.3, 1.5]
  const netTaxPayable = [0.4, 0.5, 0.7, 0.4, 0.7, 0.8]

  // Find max value for scaling
  const maxValue = Math.max(...outputGST, ...inputTaxCredit, ...netTaxPayable)
  const chartHeight = 200

  // SVG chart - simple line chart
  const chartWidth = 600
  const padding = { top: 20, right: 20, bottom: 40, left: 50 }
  const plotWidth = chartWidth - padding.left - padding.right
  const plotHeight = chartHeight - padding.top - padding.bottom
  const xStep = plotWidth / (months.length - 1)
  const yScale = plotHeight / maxValue

  // Generate SVG paths
  const generatePath = (data, color) => {
    const points = data.map((value, i) => ({
      x: padding.left + i * xStep,
      y: padding.top + plotHeight - value * yScale
    }))
    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    return { pathData, points }
  }

  const outputPath = generatePath(outputGST, '#3b82f6')
  const inputPath = generatePath(inputTaxCredit, '#10b981')
  const netPath = generatePath(netTaxPayable, '#f59e0b')

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">GST Summary (Last 6 Months)</h3>
        <button className="text-xs text-gray-500 hover:text-gray-700">View Detailed Report →</button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span className="text-xs text-gray-600">Output GST</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <span className="text-xs text-gray-600">Input Tax Credit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
          <span className="text-xs text-gray-600">Net Tax Payable</span>
        </div>
      </div>

      {/* Chart SVG */}
      <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
        {/* Y-axis grid lines */}
        {[...Array(5)].map((_, i) => {
          const y = padding.top + (plotHeight * i) / 4
          return (
            <line
              key={`grid-${i}`}
              x1={padding.left}
              y1={y}
              x2={chartWidth - padding.right}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="4"
            />
          )
        })}

        {/* Y-axis labels */}
        {[...Array(5)].map((_, i) => {
          const value = ((4 - i) * maxValue) / 4
          const y = padding.top + (plotHeight * i) / 4
          return (
            <text
              key={`y-label-${i}`}
              x={padding.left - 10}
              y={y + 4}
              textAnchor="end"
              fontSize="12"
              fill="#9ca3af"
            >
              ₹{value.toFixed(1)}L
            </text>
          )
        })}

        {/* X-axis */}
        <line
          x1={padding.left}
          y1={padding.top + plotHeight}
          x2={chartWidth - padding.right}
          y2={padding.top + plotHeight}
          stroke="#e5e7eb"
          strokeWidth="1"
        />

        {/* Output GST line */}
        <path
          d={outputPath.pathData}
          stroke="#10b981"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {outputPath.points.map((p, i) => (
          <circle key={`output-${i}`} cx={p.x} cy={p.y} r="4" fill="#10b981" stroke="white" strokeWidth="2" />
        ))}

        {/* Input Tax Credit line */}
        <path
          d={inputPath.pathData}
          stroke="#3b82f6"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {inputPath.points.map((p, i) => (
          <circle key={`input-${i}`} cx={p.x} cy={p.y} r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
        ))}

        {/* Net Tax Payable line */}
        <path
          d={netPath.pathData}
          stroke="#f59e0b"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {netPath.points.map((p, i) => (
          <circle key={`net-${i}`} cx={p.x} cy={p.y} r="4" fill="#f59e0b" stroke="white" strokeWidth="2" />
        ))}

        {/* X-axis labels (months) */}
        {months.map((month, i) => {
          const x = padding.left + i * xStep
          return (
            <text
              key={`x-label-${i}`}
              x={x}
              y={chartHeight - 10}
              textAnchor="middle"
              fontSize="12"
              fill="#9ca3af"
            >
              {month}
            </text>
          )
        })}
      </svg>

      <p className="text-xs text-gray-400 mt-2">Report generated on 14 May 2026, 10:30 AM</p>
    </div>
  )
}

export default GSTChart
