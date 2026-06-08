// InviteUserTable.jsx
// Data table with view / edit / delete actions.
// Mobile: card-per-row layout. Desktop: full table.

const STATUS_STYLES = {
  Paid:         "text-green-500 font-semibold",
  Inactive:     "text-orange-400 font-semibold",
  "Admin Access": "text-blue-500 font-semibold",
};

function StatusLabel({ status }) {
  return (
    <span className={STATUS_STYLES[status] ?? "text-gray-500 font-semibold"}>
      {status}
    </span>
  );
}

function ActionIcons({ onView, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-3">
      {/* View */}
      <button
        onClick={onView}
        className="text-gray-400 hover:text-blue-500 transition-colors"
        title="View"
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>

      {/* Edit */}
      <button
        onClick={onEdit}
        className="text-gray-400 hover:text-yellow-500 transition-colors"
        title="Edit"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="text-gray-400 hover:text-red-500 transition-colors"
        title="Delete"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

// Mobile card
function UserCard({ user, onView, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-800 text-sm">{user.client}</p>
          <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
        </div>
        <StatusLabel status={user.status} />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        <div>
          <span className="text-gray-400 block">Role</span>
          <span className="text-gray-700 font-medium">{user.role}</span>
        </div>
        <div>
          <span className="text-gray-400 block">Last Active</span>
          <span className="text-gray-700 font-medium">{user.lastActive}</span>
        </div>
      </div>
      <div className="pt-1 border-t border-gray-100">
        <ActionIcons onView={onView} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}

const COLS = ["Client", "Email", "Role", "Last Active", "Status", "Action"];

export default function InviteUserTable({ users, onView, onEdit, onDelete }) {
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-16 text-center text-sm text-gray-400">
        No users found.
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-b-xl shadow-sm border border-t-0 border-gray-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
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
            {users.map((user, i) => (
              <tr
                key={user.id}
                className={`border-b border-gray-50 hover:bg-gray-50/60 transition-colors
                            ${i % 2 !== 0 ? "bg-gray-50/30" : ""}`}
              >
                <td className="px-5 py-3.5 font-medium text-gray-800">{user.client}</td>
                <td className="px-5 py-3.5 text-gray-500">{user.email}</td>
                <td className="px-5 py-3.5 text-gray-600">{user.role}</td>
                <td className="px-5 py-3.5 text-gray-500">{user.lastActive}</td>
                <td className="px-5 py-3.5">
                  <StatusLabel status={user.status} />
                </td>
                <td className="px-5 py-3.5">
                  <ActionIcons
                    onView={() => onView(user.id)}
                    onEdit={() => onEdit(user.id)}
                    onDelete={() => onDelete(user.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="flex flex-col gap-3 md:hidden mt-3">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onView={() => onView(user.id)}
            onEdit={() => onEdit(user.id)}
            onDelete={() => onDelete(user.id)}
          />
        ))}
      </div>
    </>
  );
}