import { useState } from 'react';
import { statusStyles, formatINR, statusOptions, modeOptions, modeStyles } from './purchaseConstants';

export default function PurchaseTable({ filtered, onUpdateStatus, onUpdateMode }) {
  const [openStatusRow, setOpenStatusRow] = useState(null);
  const [openModeRow, setOpenModeRow] = useState(null);

  const handleSelectStatus = (i, status) => { onUpdateStatus?.(i, status); setOpenStatusRow(null); };
  const handleSelectMode = (i, mode) => { onUpdateMode?.(i, mode); setOpenModeRow(null); };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-sm" style={{ minWidth: '520px' }}>
        <thead>
          <tr className="border-b border-gray-100">
            {['ID', 'Vendor', 'Mode', 'Amount', 'Date', 'Status', 'Action'].map((col) => (
              <th
                key={col}
                className={`py-3 px-3 sm:px-4 text-center text-xs font-bold text-black-500 uppercase tracking-wide ${
                  col === 'Date' ? 'hidden sm:table-cell' : ''
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-16 text-gray-400 text-sm">
                No purchases found
              </td>
            </tr>
          ) : (
            filtered.map((row, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-amber-50/30 transition-colors">

                <td className="py-3 px-3 sm:px-4 text-center text-gray-700 text-xs sm:text-sm">
                  {row.id}
                </td>

                <td className="py-3 px-3 sm:px-4 text-center text-gray-700 text-xs sm:text-sm max-w-[100px] truncate">
                  {row.vendor}
                </td>

                {/* Mode dropdown */}
                <td className="py-3 px-3 sm:px-4 text-center">
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onClick={() => setOpenModeRow(prev => prev === i ? null : i)}
                      className={`inline-flex items-center gap-1 text-xs font-bold px-2 sm:px-3 py-1 rounded-md ${modeStyles[row.mode] || 'bg-gray-100 text-gray-500'}`}
                    >
                      <span className="hidden sm:inline">{row.mode}</span>
                      <span className="sm:hidden">{row.mode.slice(0, 3)}</span>
                      <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openModeRow === i && (
                      <div className="absolute left-0 mt-2 w-32 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                        {modeOptions.map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => handleSelectMode(i, mode)}
                            className={`w-full px-3 py-2 text-left text-xs sm:text-sm ${mode === row.mode ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>

                <td className="py-3 px-3 sm:px-4 text-center text-gray-700 font-semibold text-xs sm:text-sm whitespace-nowrap">
                  {formatINR(row.amount)}
                </td>

                {/* Date — hidden on mobile */}
                <td className="py-3 px-3 sm:px-4 text-center text-gray-500 text-xs sm:text-sm hidden sm:table-cell">
                  {row.date}
                </td>

                {/* Status dropdown */}
                <td className="py-3 px-3 sm:px-4 text-center">
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onClick={() => setOpenStatusRow(prev => prev === i ? null : i)}
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 sm:px-3 py-1 rounded-lg ${statusStyles[row.status] || 'bg-gray-100 text-gray-500'}`}
                    >
                      {row.status}
                      <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openStatusRow === i && (
                      <div className="absolute left-0 mt-2 w-36 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                        {statusOptions.map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => handleSelectStatus(i, status)}
                            className={`w-full px-3 py-2 text-left text-xs sm:text-sm ${status === row.status ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3 px-3 sm:px-4">
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <button className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition" title="View">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition" title="Edit">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button className="p-1 sm:p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition" title="Delete">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </div>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}