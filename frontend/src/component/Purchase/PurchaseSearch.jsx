export default function PurchaseSearch({ tableSearch, setTableSearch }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 sm:flex-none">
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5"
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search"
          value={tableSearch}
          onChange={(e) => setTableSearch(e.target.value)}
          className="w-full sm:w-40 pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-200 bg-white"
        />
      </div>
      <button className="shrink-0 flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition bg-white">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
        </svg>
        <span className="hidden xs:inline">Filters</span>
      </button>
    </div>
  );
}