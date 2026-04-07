import { statusStyles, formatINR } from './purchaseConstants';

export default function PurchaseTable({ filtered }) {
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
                  <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-md">
                    {row.mode}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-center text-gray-700 font-semibold">
                  {formatINR(row.amount)}
                </td>

                <td className="py-3.5 px-4 text-center text-gray-500">{row.date}</td>

                <td className="py-3.5 px-4 text-center">
                  <button className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg ${statusStyles[row.status] || "bg-gray-100 text-gray-500"}`}>
                    {row.status}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
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