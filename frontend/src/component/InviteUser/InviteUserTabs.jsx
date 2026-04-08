// InviteUserTabs.jsx
// Three tab navigation: All User | Roles And Permission | Approval Workflow

const TABS = ["All User", "Roles And Permission", "Approval Workflow"];

export default function InviteUserTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex gap-0 border-b border-gray-200 mb-0 overflow-x-auto">
      {TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`relative px-4 sm:px-6 py-3 text-sm font-semibold whitespace-nowrap transition-colors
              ${isActive
                ? "text-gray-900 border-b-2 border-yellow-400 -mb-px"
                : "text-gray-400 hover:text-gray-600"
              }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}