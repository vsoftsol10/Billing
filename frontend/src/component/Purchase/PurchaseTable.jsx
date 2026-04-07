import { useState } from 'react';
import { statusStyles, formatINR, statusOptions, modeOptions, modeStyles } from './purchaseConstants';

export default function PurchaseTable({ filtered, onUpdateStatus, onUpdateMode }) {
  const [openStatusRow, setOpenStatusRow] = useState(null);
  const [openModeRow, setOpenModeRow] = useState(null);

  const toggleDropdown = (rowIndex) => {
    setOpenStatusRow((prev) => (prev === rowIndex ? null : rowIndex));
  };

  const toggleModeDropdown = (rowIndex) => {
    setOpenModeRow((prev) => (prev === rowIndex ? null : rowIndex));
  };

  const handleSelectStatus = (rowIndex, status) => {
    onUpdateStatus?.(rowIndex, status);
    setOpenStatusRow(null);
  };

  const handleSelectMode = (rowIndex, mode) => {
    onUpdateMode?.(rowIndex, mode);
    setOpenModeRow(null);
  };

  const getRowKey = (row) => `${row.id}-${row.vendor}-${row.date}`;


  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {["ID", "Vendor", "Mode", "Amount", "Date", "Status", "Action"].map((col) => (
              <th key={col} className="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
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

                <td className="py-3.5 px-4 text-center text-gray-700 font-medium">{row.id}</td>

                <td className="py-3.5 px-4 text-center text-gray-700">{row.vendor}</td>

                <td className="py-3.5 px-4 text-center">
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onClick={() => toggleModeDropdown(i)}
                      className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-md ${modeStyles[row.mode] || "bg-gray-100 text-gray-500"}`}
                    >
                      {row.mode}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>

                    {openModeRow === i && (
                      <div className="absolute left-0 mt-2 w-32 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                        {modeOptions.map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => handleSelectMode(i, mode)}
                            className={`w-full px-3 py-2 text-left text-sm ${mode === row.mode ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>

                <td className="py-3.5 px-4 text-center text-gray-700 font-semibold">
                  {formatINR(row.amount)}
                </td>

                <td className="py-3.5 px-4 text-center text-gray-500">{row.date}</td>

                <td className="py-3.5 px-4 text-center">
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onClick={() => toggleDropdown(i)}
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg ${statusStyles[row.status] || "bg-gray-100 text-gray-500"}`}
                    >
                      {row.status}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>

                    {openStatusRow === i && (
                      <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                        {statusOptions.map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => handleSelectStatus(i, status)}
                            className={`w-full px-3 py-2 text-left text-sm ${status === row.status ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition" title="View">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition" title="Edit">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition" title="Delete">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
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