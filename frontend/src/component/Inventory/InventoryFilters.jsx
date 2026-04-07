// InventoryFilters.jsx
// Search bar + status filter dropdown toolbar above the table

export default function InventoryFilters({ search, onSearch, statusFilter, onStatusFilter }) {
  const statuses = ["All", "Pending", "Open", "Update"];

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      {/* Search */}
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-white
                     focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400
                     placeholder-gray-400 text-gray-700 transition"
        />
      </div>

      {/* Status filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => onStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
              ${
                statusFilter === s
                  ? "bg-yellow-400 border-yellow-400 text-gray-900"
                  : "bg-white border-gray-200 text-gray-500 hover:border-yellow-300 hover:text-gray-800"
              }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}