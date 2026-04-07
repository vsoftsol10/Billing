// InventoryHeader.jsx
// Renders the page title, subtitle, and "+ Add New" button

export default function InventoryHeader({ onAddNew }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-900 font-bold leading-snug">
          Manage your invoices and track payments easily
        </h2>
      </div>

      <button
        onClick={onAddNew}
        className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 active:scale-95
                   text-gray-900 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all
                   shadow-sm self-start sm:self-auto whitespace-nowrap"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
          <path
            d="M8 3v10M3 8h10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        + Add New
      </button>
    </div>
  );
}