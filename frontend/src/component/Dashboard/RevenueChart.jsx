import React, { useState } from 'react'

const weekData = [15, 28, 22, 35, 42, 38, 55]
const monthData = [20, 45, 30, 50, 40, 60, 75, 55, 65, 80, 70, 90, 82, 95, 78, 88, 65, 72, 85, 92, 78, 88, 72, 80, 91, 85, 78, 88, 92, 98]

const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const buildPath = (data, w, h, pad = 20) => {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const xs = data.map((_, i) => pad + (i / (data.length - 1)) * (w - pad * 2))
  const ys = data.map(v => h - pad - ((v - min) / range) * (h - pad * 2))

  let d = `M ${xs[0]} ${ys[0]}`
  for (let i = 1; i < xs.length; i++) {
    const cpX = (xs[i - 1] + xs[i]) / 2
    d += ` C ${cpX} ${ys[i - 1]}, ${cpX} ${ys[i]}, ${xs[i]} ${ys[i]}`
  }

  const area = d + ` L ${xs[xs.length - 1]} ${h - pad} L ${xs[0]} ${h - pad} Z`
  return { line: d, area, xs, ys }
}

const RevenueChart = () => {
  const [tab, setTab] = useState('MONTH')

  const raw = tab === 'MONTH' ? monthData : weekData
  const xLabels = tab === 'WEEK' ? weekDays : monthNames

  const W = 1000, H = 200
  const { line, area, xs, ys } = buildPath(raw, W, H)

  const yLabels = ['2 K', '10 K', '50 K', '60 K', '90 K']

  // Pick evenly spaced label indices so they don't crowd
  const labelCount = tab === 'WEEK' ? xLabels.length : 12
  const labelIndices = Array.from({ length: labelCount }, (_, i) =>
    Math.round((i / (labelCount - 1)) * (xLabels.length - 1))
  )

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <p style={{ fontFamily: 'Sora, sans-serif' }} className="text-sm font-bold text-gray-700 tracking-wide uppercase">
          Revenue Overview
        </p>
        <div className="flex rounded-xl border border-gray-100 overflow-hidden">
          {['MONTH', 'WEEK'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 text-xs font-semibold transition-all duration-150
                ${tab === t ? 'bg-amber-400 text-gray-900' : 'bg-white text-gray-400 hover:text-gray-700'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="flex gap-3">
        {/* Y labels */}
        <div className="flex flex-col justify-between text-xs text-gray-300 font-medium pb-6 text-right w-10 shrink-0">
          {[...yLabels].reverse().map(l => <span key={l}>{l}</span>)}
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            style={{ height: 180 }}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0.2, 0.4, 0.6, 0.8].map((r, i) => (
              <line key={i} x1="20" y1={20 + r * 160} x2={W - 20} y2={20 + r * 160}
                stroke="#f3f4f6" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            ))}

            {/* Area fill */}
            <path d={area} fill="url(#chartGrad)" />

            {/* Line */}
            <path d={line} fill="none" stroke="#f59e0b" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />

            {/* Last dot highlight */}
            <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="5" fill="#f59e0b" />
            <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="9" fill="#f59e0b" fillOpacity="0.2" />
          </svg>

          {/* X labels — evenly spaced across full width */}
          <div className="flex justify-between mt-1 px-0">
            {labelIndices.map((dataIdx, i) => (
              <span key={i} className="text-xs text-gray-300 font-medium">
                {xLabels[dataIdx]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RevenueChart