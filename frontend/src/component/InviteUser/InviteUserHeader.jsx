// InviteUserHeader.jsx
// Page title, subtitle, Activate / Deactivate / Add New buttons

export default function InviteUserHeader({ onActivate, onDeactivate, onAddNew }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-900 font-bold leading-snug">
          Invite and manage users for your workspace
        </h2>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onActivate}
          className="px-5 py-2 rounded-xl text-sm font-semibold border border-green-300
                     bg-green-50 text-green-700 hover:bg-green-100 active:scale-95
                     transition-all whitespace-nowrap"
        >
          Activate
        </button>

        <button
          onClick={onDeactivate}
          className="px-5 py-2 rounded-xl text-sm font-semibold border border-red-300
                     bg-red-50 text-red-600 hover:bg-red-100 active:scale-95
                     transition-all whitespace-nowrap"
        >
          Deactivate
        </button>

        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold
                     bg-yellow-500 hover:bg-yellow-600 active:scale-95 text-black
                     transition-all shadow-sm whitespace-nowrap"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add New
        </button>
      </div>
    </div>
  );
}