export default function PurchaseSearch({ tableSearch, setTableSearch }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative w-full sm:w-auto">
        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search"
          value={tableSearch}
          onChange={(e) => setTableSearch(e.target.value)}
          className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-200 w-full sm:w-40 bg-white"
        />
      </div>
      <button className="flex items-center justify-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition bg-white w-full sm:w-auto">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/>
          <line x1="11" y1="18" x2="13" y2="18"/>
        </svg>
        Filters
      </button>
    </div>
  );
}