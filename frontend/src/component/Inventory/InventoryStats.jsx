// InventoryStats.jsx
// Displays the 4 summary metric cards at the top of the page

const statCards = [
  {
    label: "Stock Value",
    value: "₹ 3,25,000",
    sub: "+6% from last month",
    accent: "border-l-4 border-yellow-400",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="3" stroke="#888" strokeWidth="1.5" />
        <path d="M2 10h20" stroke="#888" strokeWidth="1.5" />
        <rect x="5" y="14" width="4" height="2" rx="1" fill="#888" />
      </svg>
    ),
  },
  {
    label: "Total Products",
    value: "180",
    sub: "17+ last month",
    accent: "border-l-4 border-blue-400",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path
          d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
          stroke="#888"
          strokeWidth="1.5"
        />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="#888" strokeWidth="1.5" />
        <line x1="12" y1="22.08" x2="12" y2="12" stroke="#888" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: "Low Stacks",
    value: "12",
    sub: "Need Restocking",
    accent: "border-l-4 border-orange-400",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path
          d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
          stroke="#888"
          strokeWidth="1.5"
        />
        <line x1="12" y1="9" x2="12" y2="13" stroke="#888" strokeWidth="1.5" />
        <line x1="12" y1="17" x2="12.01" y2="17" stroke="#888" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Out of Stock",
    value: "10",
    sub: "Out Of Inventory",
    accent: "border-l-4 border-red-400",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="#888" strokeWidth="1.5" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="#888" strokeWidth="1.5" />
      </svg>
    ),
  },
];

function StatCard({ label, value, sub, icon, accent }) {
  return (
    <div
      className={`bg-white rounded-xl p-4 flex items-center justify-between gap-3
                  shadow-sm border border-gray-100 ${accent}`}
    >
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide truncate">
          {label}
        </p>
        <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-0.5 truncate">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{sub}</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-2 shrink-0">{icon}</div>
    </div>
  );
}

export default function InventoryStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
      {statCards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}