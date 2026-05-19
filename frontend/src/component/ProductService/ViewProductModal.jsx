export default function ViewProductModal({ item, onClose }) {
  if (!item) return null;

  const row = (label, value) => (
    <div className="flex justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value ?? "—"}</span>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/35 z-50 flex items-start justify-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white w-96 h-full flex flex-col shadow-2xl"
        style={{ animation: "slideIn 0.22s ease" }}
      >
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(40px); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-bold text-gray-900">View Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">

          {/* Avatar / name banner */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center text-white font-bold text-lg shrink-0">
              {item.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-base">{item.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">Product</p>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl border border-gray-100 px-4 py-1 mb-4">
            {row("Quantity",      item.qty)}
            {row("MRP",          item.mrp?.toLocaleString("en-IN", { style: "currency", currency: "INR" }))}
            {row("Selling Price", item.sellingPrice)}
            {row("Cost Price",   item.costPrice?.toLocaleString("en-IN", { style: "currency", currency: "INR" }))}
            {row("Tax / GST",    item.taxableAmount)}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}