// InventoryTable.jsx
// Data table with status badge and action buttons.
// On mobile collapses to card-per-row layout for readability.

const STATUS_STYLES = {
  Pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  Open:    "bg-green-100  text-green-800  border border-green-300",
  Update:  "bg-blue-100   text-blue-700   border border-blue-300",
};

function StatusBadge({ status, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
                  cursor-pointer transition-opacity hover:opacity-80 ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-700"}`}
    >
      {status}
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function ActionButtons({ onStockIn, onStockOut }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onStockIn}
        className="flex items-center gap-1 text-xs font-semibold text-green-700
                   border border-green-300 bg-green-50 hover:bg-green-100
                   rounded-full px-3 py-1 transition-colors whitespace-nowrap"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
          <path d="M6 3.5V8.5M3.5 6H8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        Stock In
      </button>
      <button
        onClick={onStockOut}
        className="flex items-center gap-1 text-xs font-semibold text-red-700
                   border border-red-300 bg-red-50 hover:bg-red-100
                   rounded-full px-3 py-1 transition-colors whitespace-nowrap"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
          <path d="M3.5 6H8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        Stock Out
      </button>
    </div>
  );
}

// Mobile card for a single row
function MobileCard({ item, onStatusChange, onStockIn, onStockOut }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-800 text-sm">{item.name}</span>
        <StatusBadge status={item.status} onClick={() => onStatusChange(item.id)} />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-500">
        <div><span className="text-gray-400">Qty</span><p className="text-gray-700 font-medium">{item.qty}</p></div>
        <div><span className="text-gray-400">Sales Price</span><p className="text-gray-700 font-medium">{item.salesPrice}</p></div>
        <div><span className="text-gray-400">Purchase Price</span><p className="text-gray-700 font-medium">{item.purchasePrice}</p></div>
        <div><span className="text-gray-400">Date</span><p className="text-gray-700 font-medium">{item.date}</p></div>
      </div>
      <ActionButtons onStockIn={() => onStockIn(item.id)} onStockOut={() => onStockOut(item.id)} />
    </div>
  );
}

const COLS = ["Items", "Qty", "Sales Price", "Purchase Price", "Date", "Status", "Action"];

export default function InventoryTable({ items, onStatusChange, onStockIn, onStockOut }) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-16 text-center text-sm text-gray-400">
        No items found.
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100">
              {COLS.map((c) => (
                <th
                  key={c}
                  className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr
                key={item.id}
                className={`border-b border-gray-50 hover:bg-yellow-50/30 transition-colors
                            ${i % 2 !== 0 ? "bg-gray-50/40" : ""}`}
              >
                <td className="px-5 py-3.5 font-medium text-gray-800">{item.name}</td>
                <td className="px-5 py-3.5 text-gray-600">{item.qty}</td>
                <td className="px-5 py-3.5 text-gray-600">{item.salesPrice}</td>
                <td className="px-5 py-3.5 text-gray-600">{item.purchasePrice}</td>
                <td className="px-5 py-3.5 text-gray-500">{item.date}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={item.status} onClick={() => onStatusChange(item.id)} />
                </td>
                <td className="px-5 py-3.5">
                  <ActionButtons
                    onStockIn={() => onStockIn(item.id)}
                    onStockOut={() => onStockOut(item.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="flex flex-col gap-3 md:hidden">
        {items.map((item) => (
          <MobileCard
            key={item.id}
            item={item}
            onStatusChange={onStatusChange}
            onStockIn={onStockIn}
            onStockOut={onStockOut}
          />
        ))}
      </div>
    </>
  );
}